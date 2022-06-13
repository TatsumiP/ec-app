import React, {useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MenuIcon from '@material-ui/icons/Menu';
import {getProductsInCart, getFavoriteProducts, getUserId} from "../../reducks/users/selectors";
import {useDispatch, useSelector} from 'react-redux';
import {db} from '../../firebase/index';
import {fetchProductsInCart, fetchFavoriteProducts} from "../../reducks/users/operations";
import {push} from "connected-react-router";

    // Uncaught (in promise) FirebaseError: Missing or insufficient permissions.    【解決法】firestore.rulesのcartのサブコレを変更できるように追加
const HeaderMenus = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);
    let productsInCart = getProductsInCart(selector);
    let favoriteProducts = getFavoriteProducts(selector);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(uid).collection('cart')
            .onSnapshot(snapshots => {                          // onSnapshotでリスナーを設定
                snapshots.docChanges().forEach(change => {      // snapshotsはcartsubcollectionにあるデータ全て
                    const product = change.doc.data();          // カートに追加された商品のデータオブジェクトをproductと宣言している。
                    const changeType = change.type

                    switch (changeType) {                       // change.typeに応じて配列操作
                        case 'added':                           // カート内情報を追加するときは新しいproduct情報を追加
                            productsInCart.push(product);
                            break;
                        case 'modified':                        // カート内情報を変更するときは変更する商品情報が何番目か調べてそれを上書き
                            const index = productsInCart.findIndex(product => product.cartId === change.doc.id)  // findIndex:配列の何番目が変化したのか
                            productsInCart[index] = product;
                            break;
                        case 'removed':                         // カート内情報を削除するときは、削除する商品のId以外を抽出した配列に置き直している。
                            productsInCart = productsInCart.filter(product => product.cardId !== change.doc.id)
                            break;
                        default:
                            break;
                    }
                });

                dispatch(fetchProductsInCart(productsInCart))      // reduxのstoreの状態を更新するoperation
            })

        return() => unsubscribe()
    },[]);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(uid).collection('favorite')
            .onSnapshot(snapshots => {
                snapshots.docChanges().forEach(change => {
                    const product = change.doc.data();
                    const changeType = change.type

                    switch (changeType) {
                        case 'added':
                            favoriteProducts.push(product);
                            break;
                        case 'modified':
                            const index = favoriteProducts.findIndex(product => product.favoriteId === change.doc.id)
                            favoriteProducts[index] = product;
                            break;
                        case 'removed':
                            favoriteProducts = favoriteProducts.filter(product => product.favoriteId !== change.doc.id)
                            break;
                        default:
                            break;
                    }
                });

                dispatch(fetchFavoriteProducts(favoriteProducts))
            })

        return() => unsubscribe()
    },[]);

    return (
        <>
            <IconButton onClick={() => dispatch(push('/cart'))}>
                <Badge badgeContent={productsInCart.length} color="secondary">
                <ShoppingCartIcon />
                </Badge>
            </IconButton>
            <IconButton onClick={() => dispatch(push('/favorite'))}>
                <Badge badgeContent={3} color="secondary">
                <FavoriteBorderIcon />
                </Badge>
            </IconButton>
            <IconButton onClick={(e) => props.handleDrawerToggle(e)}>
                <MenuIcon />
            </IconButton>
        </>
    )
}

export default HeaderMenus;