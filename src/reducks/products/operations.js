import {db, FirebaseTimestamp} from "../../firebase";
import {push} from "connected-react-router";
import {fetchProductsAction, deleteProductAction} from "./actions";
import toast from 'react-hot-toast';

const productsRef = db.collection('products');

    // actions.jsにDELETE_PRODUCTSタイプのdeleteProductActionが渡る
export const deleteProduct = (id) => {
    return async (dispatch, getState) => {
        productsRef.doc(id).delete()
            .then(() => {
                const prevProducts = getState().products.list
                const nextProducts = prevProducts.filter(product => product.id !== id)
                dispatch(deleteProductAction(nextProducts))
            })
    }
}

    // ProductRefはdb.collectionに対するクエリ。orderByはソート
export const fetchProducts = (category) => {
    return async (dispatch) => {
        productsRef.orderBy('updated_at', 'desc').get()
            .then(snapshots => {
                const productList = []
                snapshots.forEach(snapshot => {
                    const product = snapshot.data();
                    productList.push(product)
                })
                dispatch(fetchProductsAction(productList))
            })
    }
}

    // firestoreのトランザクション。バッチ書き込み方式
    // call createPaymentIntent function from payments/operations.js
export const orderProduct = (productsInCart, amount) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const userRef = db.collection('users').doc(uid);
        const timestamp = FirebaseTimestamp.now();

        let products = {};
        let soldOutProducts = [];

        const batch = db.batch()
            // for文でこの中をぐるぐる回して処理をしている

        for (const product of productsInCart) {
            const snapshot = await productsRef.doc(product.productId).get()
            const sizes = snapshot.data().sizes;

            const updatedSizes = sizes.map(size => {
                if (size.size === product.size) {
                    if(size.quantity === 0) {
                        soldOutProducts.push(product.name);
                        return size
                    }
                    return {
                        size: size.size,
                        quantity: size.quantity -1
                    }
                } else {
                    return size
                }
            });
                // productsという注文履歴登録用のデータを作成。(同じ商品の違うサイズを購入時にidが同じになってしまうなどの問題を防ぐため)
            products[product.productId] = {
                id: product.productId,
                images: product.images,
                name: product.name,
                price: product.price,
                size: product.size
            };

            batch.update(                            // 在庫が1減る更新をかける
                productsRef.doc(product.productId),
                {sizes: updatedSizes}
            );

            batch.delete(                            // カート内の商品のIdを削除
                userRef.collection('cart').doc(product.cartId)
            );
        }

        if (soldOutProducts.length > 0) {
            const errorMessage = (soldOutProducts.length > 1) ?
                                soldOutProducts.join('と') :
                                soldOutProducts[0];
            alert('大変申し訳ありません。' + errorMessage + 'が在庫切れとなったため、注文処理を中断しました。')
            return false
        } else {
            batch.commit()
                    .then(() => {
                        // Create order history data
                        const orderRef = userRef.collection('orders').doc();
                        const date = timestamp.toDate()

                        // Calculate shipping date which is the date after 3days
                        const shippingDate = FirebaseTimestamp.fromDate(new Date(date.setDate(date.getDate() + 3)));

                        const history = {
                            amount: products.price,
                            created_at: timestamp,
                            id: orderRef.id,
                            products: products,     //map型の変数オブジェクト
                            shipping_date: shippingDate,    // shipping_date(配送日時)とupdated_atは全てに持たせる
                            updated_at: timestamp
                        }

                        orderRef.set(history)

                        dispatch(push('/order/complete'))
                    }).catch(() => {
                        alert('注文処理に失敗しました。通信環境をご確認のうえ、もう一度お試しください。')
                        return false
                    })
        }
    }
}

    // 引数の順番に注意！！
export const saveProduct = (id, name, description, category, price, images, sizes) => {
    return async (dispatch) => {
        const timestamp = FirebaseTimestamp.now()

        const data = {
            category: category,
            description: description,
            images: images,
            name: name,
            price: parseInt(price, 10), // 10進数
            sizes: sizes,
            updated_at: timestamp
        }

        if (id === "") {
        // 初期でのみしたい処理
            const ref = productsRef.doc()
            id = ref.id;
            data.id = id;
            data.created_at = timestamp;
        }

        // merge:trueを入れると更新された部分のみを更新する。
        return productsRef.doc(id).set(data, {merge: true})
            .then(() => {
                dispatch(push('/'))
            }).catch((error) => {
                throw new Error(error)
            })

    }
}