import React, {useEffect} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MenuIcon from '@material-ui/icons/Menu';
import {getProductsInCart, getUserId} from "../../reducks/users/selectors";
import {useDispatch, useSelector} from 'react-redux';
import {db} from '../../firebase/index';
import {fetchProductsInCart} from "../../reducks/users/operations";
import {push} from "connected-react-router";

    // Uncaught (in promise) FirebaseError: Missing or insufficient permissions.    【解決法】firestore.rulesのcartのサブコレを変更できるように追加
const HeaderMenus = (props) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const uid = getUserId(selector);
    let productsInCart = getProductsInCart(selector);

    useEffect(() => {
        const unsubscribe = db.collection('users').doc(uid).collection('cart')
            .onSnapshot(snapshots => {                             // onSnapshotでリスナーを設定
                snapshots.docChanges().forEach(change => {      // snapshotsはcartsubcollectionにあるデータ全て
                    const product = change.doc.data();          // カートに追加された商品のデータオブジェクトをproductと宣言している。
                    const changeType = change.type

                    switch (changeType) {           // change.typeに応じて配列操作
                        case 'added':
                            productsInCart.push(product);
                            break;
                        case 'modified':                            
                            const index = productsInCart.findIndex(product => product.cartId === change.doc.id)  // findIndex:配列の何番目が変化したのか
                            productsInCart[index] = product;     // 特定した何番目の要素をproductで上書き
                            break;
                        case 'removed':
                            productsInCart = productsInCart.filter(product => product.cardId !== change.doc.id)　// idがマッチするもの以外を抽出
                            break;
                        default:
                            break;
                    }
                });

                dispatch(fetchProductsInCart(productsInCart))      // reduxのstoreの状態を更新するoperation
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
            <IconButton>
                <FavoriteBorderIcon />
            </IconButton>
            <IconButton onClick={(e) => props.handleDrawerToggle(e)}>
                <MenuIcon />
            </IconButton>
        </>
    )
}

export default HeaderMenus;