import React, {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProductsInCart} from "../reducks/users/selectors";
import {makeStyles} from "@material-ui/core/styles";
import {CartListItem} from "../components/products";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import {PrimaryButton, TextDetail} from "../components/UIkit";
import {orderProduct} from "../reducks//products/operations";

const useStyles = makeStyles((theme) => ({
    detailBox: {
        margin: '0 auto',
        [theme.breakpoints.down('sm')]: {
            width: 320
        },
        [theme.breakpoints.up('sm')]: {
            width: 512
        }
    },
    orderBox: {
        border: '1px solid rgba(0,0,0,0.2)',        // CSSのrgbaプロパティでは色と透明度の設定が可能。red,green,blue(0~255),alpha(0~1)
        borderRadius: 4,
        boxShadow: '0 4px 2px 2px rgba(0,0,0,0.2)',
        height: 256,
        margin: '24px auto 16px auto',
        padding: 16,
        width: 288
    }
}));

const OrderConfirm = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const productsInCart = getProductsInCart(selector)

        // MDNのreduceメソッド。sumの初期値を0から計算し、商品の値段を足していく。今回はinitialValueが0
    const subtotal = useMemo(() => {
        return productsInCart.reduce((sum, product) => sum += product.price, 0)
    },[productsInCart]);

        // 合計1万超えれば送料210円分は計算に入らなくなる。
    const tax = subtotal * 0.1;
    const shippingFee = (subtotal >= 10000) ? 0 : 210;
    const total =subtotal + shippingFee + tax;

        // products/operationsで処理
    const order = useCallback(() => {
        dispatch(orderProduct(productsInCart, total))
    },[productsInCart, total]);

        // TextDetail.jsは同じコンポーネントを使いまわしできる所は使いまわしたいので作っている。
    return (
        <section className="c-section-wrapin">
            <h2 className="u-text__headline">注文の確認</h2>
            <div className="p-grid__row">
                <div className={classes.detailBox}>
                    <List>
                        {productsInCart.length > 0 && (
                            productsInCart.map(product => <CartListItem key={product.cartId} product={product} />)
                        )}
                    </List>
                </div>
                <div className={classes.orderBox}>
                    <TextDetail label={"商品合計"} value={"￥" + subtotal.toLocaleString()} />
                    <TextDetail label={"消費税"} value={"￥" + tax} />
                    <TextDetail label={"送料"} value={"￥" + shippingFee.toLocaleString()} />
                    <Divider />
                    <TextDetail label={"合計(税込)"} value={"￥" + total} />
                    <PrimaryButton label={"注文を確定する"} onClick={order} />
                </div>
            </div>
        </section>
    )
}

export default OrderConfirm