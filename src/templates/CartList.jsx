import React, {useCallback} from 'react';
import {useDispatch, useSelector} from "react-redux";
import List from "@material-ui/core/List";
import {getProductsInCart} from "../reducks/users/selectors";
import {CartListItem} from "../components/products";
import {GreyButton, PrimaryButton} from "../components/UIkit";
import {makeStyles} from "@material-ui/core/styles";
import {push} from "connected-react-router"

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '0 auto',
        maxWidth: 512,
        width: '100%'
    },
}));

const CartList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const productsInCart = getProductsInCart(selector);     // selectorを引数に持つ関数はreducksのselectorファイルで定義され、stateを切り替えている。

    const goToOrder = useCallback( () => {
        dispatch(push('/order/confirm'))
    },[]);

    const backToHome = useCallback(() => {
        dispatch(push('/'))
    },[]);

        // Error: Objects are not valid as a React child (found: object with keys {product}).
    return (
        <section className="c-section-wrapin">
            <h2 className="u-text__headline">
                ショッピングカート
            </h2>
            <List className={classes.root}>
                {productsInCart.length > 0 && (
                    productsInCart.map(product => (<CartListItem key={product.cartId} product={product} />)) // productの情報をそのまま持たせる
                        // アロー関数でproductという引数を宣言。productはproductsInCartの配列一つ一つに代入される。関数で戻り値を受け取ったものが配列化される。
                        //　ProductsInCartはカート内の商品情報オブジェクトの配列。
                        //  errorが生じたのは<CartListItem>の引数がなんらかの理由で二つ以上になっているためだと思われる。
                        // ★()で閉じたことで再レンダリング時に初期化されてしまっている可能性あり。現状初期化バグとカート内削除ができない。
                )}   
            </List> 
            <div>

            </div>
            <div className="module-spacer--medium" />
            <div className="p-grid__column">
                <PrimaryButton label={"レジへ進む"} onClick={goToOrder} />
                <div className="module-spacer--extra-extra-small" />
                <GreyButton label={"ショッピングを続ける"} onClick={backToHome} />
            </div>
        </section>
    );

};

export default CartList;