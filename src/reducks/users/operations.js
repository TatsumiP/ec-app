import {fetchOrdersHistoryAction, fetchProductsInCartAction, fetchFavoriteProductsAction, deleteFavoriteAction, signInAction, signOutAction} from "./actions";
import {push} from 'connected-react-router';
import {auth, db, FirebaseTimestamp} from '../../firebase/index';
import {collection} from 'firebase/firestore';
import {setDoc, doc, query, orderBy, getDocs, deleteDoc } from "firebase/firestore";
import toast from 'react-hot-toast';

const usersRef = db.collection('users')


// ショッピングカートに商品を追加する
export const addProductToCart = (addedProduct) => {                // DBにカート情報を記録する。reducks/store/initialStateにカートを保存する所を作る。
    return async (dispatch, getState) => {
        const uid = getState().users.uid;                          // getState()メソッド
        const cartRef = doc(collection(db, 'users', uid, 'cart'));
        addedProduct['cartId'] = cartRef.id;  // CartIdというサブコレクションのidをフィールドとして持たせることができる
        await cartRef.set(addedProduct);
        toast.success('商品をカートに追加しました')
        dispatch(push('/cart'))
    }
}

// 注文履歴を取得する
export const fetchOrdersHistory = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        const ordersRef = collection(db, 'users', uid, 'orders');
        const q = query(ordersRef, orderBy('updated_at', 'desc'));  // orderByで更新日付順に並べる
        getDocs(q).then((snapshots) => {
            snapshots.forEach((snapshot) => {
                const data = snapshot.data();
                list.push(data);
            })
            dispatch(fetchOrdersHistoryAction(list));
        });
    }
}

// リスナーで監視したカート情報をstoreに反映
export const fetchProductsInCart = (products) => {
    return async (dispatch) => {
        dispatch(fetchProductsInCartAction(products))
    }
};


// お気に入りリストに商品を追加する
export const addProductToFavorite = (data) => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const favoriteRef = doc(collection(db, 'users', uid, 'favorite'));

        const product = {
            ...data,
            id: favoriteRef.id
        }
        await setDoc(favoriteRef, product);
        toast.success('お気に入りに追加しました');

    }
}

// お気に入りリストを取得する
export const fetchFavoriteProducts = () => {
    return async (dispatch, getState) => {
        const uid = getState().users.uid;
        const list = [];

        const favoriteRef = collection(db, 'users', uid, 'favorite');
        const q = query(favoriteRef, orderBy('added_at', 'desc'));
        getDocs(q).then((snapshots) => {            // snapshots:QuerySnapshot<any>
            snapshots.forEach((snapshot) => {
                const data = snapshot.data();
                list.push(data);
            })
            dispatch(fetchFavoriteProductsAction(list));
        })
    }
};

// お気に入りから商品を削除する
export const removeFavorite = (id) => {
    return async (dispatch, getState) => {
      const uid = getState().users.uid;

      const favoriteRef = doc(db, 'users', uid, 'favorite', id);
      // データベースから削除
      deleteDoc(favoriteRef).then(() => {
        const prevFavorite = getState().users.favorite;
        // 削除した商品以外で、お気に入りリストを更新
        const newFavorite = prevFavorite.filter((product) => product.id !== id);
        dispatch(deleteFavoriteAction(newFavorite));
      });

    }
  }


// 認証をリッスンする
export const listenAuthState = () => {
    return async (dispatch) => {
        return auth.onAuthStateChanged(user => {
            // もしユーザーが認証されていたらor null文
            if (user) {
                const uid = user.uid
                // SQL文。snapshotでデータベースから情報を取得
                db.collection('users').doc(uid).get()
                    .then(snapshot => {
                        const data = snapshot.data()
                        // ログイン情報の更新
                        dispatch(signInAction( {
                            customer_id: (data.customer_id) ? data.customer_id : "", // if no data, return empty string
                            email: data.email,
                            isSignedIn: true,
                            payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                            role: data.role,
                            uid: uid,
                            username: data.username
                        }))
                    })
            } else {
                dispatch(push('/signin'))
            }
        })
    }
};

// パスワードをリセットする
export const resetPassword = (email) => {
    return async (dispatch) => {
        if (email === "") {
            alert("必須項目が未入力です")
            return false
        } else {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert('入力されたアドレスにパスワードリセット用のメールをお送りしました。')
                    dispatch(push('/signin'))
                }).catch(() => {
                    alert('パスワードリセットに失敗しました。もう一度ご確認ください。')
                })
        }
    }
}

// ログインを行う
export const signIn = (email, password) => {
    return async (dispatch) => {
        // Validation。色々なValidationをかけているのでGitHub参照
        if (email ==="" || password ===""){
            alert("必須項目が未入力です")
            return false
        }

        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user

                if(user) {
                    const uid = user.uid

                    db.collection('users').doc(uid).get()
                        .then(snapshot => {
                            const data = snapshot.data()
                            // ログイン情報の更新
                            dispatch(signInAction( {
                                customer_id: (data.customer_id) ? data.customer_id : "",
                                email: data.email,
                                isSignedIn: true,
                                payment_method_id: (data.payment_method_id) ? data.payment_method_id : "",
                                role: data.role,
                                uid: uid,
                                username: data.username
                            }))

                            dispatch(push('/'))

                        })
                }
            })

    }
}

// アカウント登録を行う
export const signUp = (username, email, password, confirmPassword) => {
    return async (dispatch) => {
        // Validation。色々なValidationをかけているのでGitHub参照
        if (username ==="" || email ==="" || password ==="" || confirmPassword ===""){
            alert("必須項目が未入力です")
            return false
        }

        if (password !== confirmPassword) {
            alert("パスワードが一致しません。もう1度お試しください")
            return false
        }

        return auth.createUserWithEmailAndPassword(email, password)
            .then(result => {
                const user = result.user

                if (user) {
                    const uid = user.uid
                    const timestamp = FirebaseTimestamp.now();

                    const userInitialData = {
                        created_at:timestamp,
                        email: email,
                        role: "customer",
                        uid: uid,
                        updated_at: timestamp,
                        username: username
                    }


                    db.collection('users').doc(uid).set(userInitialData)
                        .then(() => {
                            dispatch(push('/'))
                        })
                }
            })
    }
}

// ログアウトする
export const signOut = () => {
    return async (dispatch) => {
        auth.signOut()
            .then(() => {
                dispatch(signOutAction());
                dispatch(push('/signin'))
            })
    }
}