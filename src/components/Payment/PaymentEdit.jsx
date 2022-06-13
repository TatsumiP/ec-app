import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {CardElement, useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import {makeStyles} from "@material-ui/styles";
import {theme} from "../../assets/theme";
import {GreyButton, PrimaryButton, TextDetail} from '../UIkit';
import {useDispatch, useSelector} from "react-redux";
import {push} from "connected-react-router";
import {registerCard, retrievePaymentMethod} from "../../reducks/payments/operations";
import {getCustomerId, getPaymentMethodId} from "../../reducks/users/selectors";

const useStyles = makeStyles({
    element: {
        backgroundColor: theme.palette.secondary.light,
        padding: 16,
    }
});

const PaymentEdit = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();   //useElements() receives publickey property and cardinfo in CheckoutWrapper
    const selector = useSelector(state => state);
    const customerId = getCustomerId(selector);
    const paymentMethodId = getPaymentMethodId(selector);

    const [card, setCard] = useState({})

    const register = useCallback(() => {
        dispatch(registerCard(stripe, elements, customerId))
    }, [stripe, elements, customerId]);

    const goBackToMyPage = useCallback(() => {
        dispatch(push('/user/mypage'))
    }, [dispatch])

    // when paymentMethodId is called, asynchronous processing starts
    useEffect(() => {
        (async() => {
            const paymentMethod = await retrievePaymentMethod(paymentMethodId)
            if (paymentMethod) {
                setCard(paymentMethod)
            }
        })()
    },[paymentMethodId]);

    // Only the last four digits of the card are shown
    const cardNumber = useMemo(() => {
        if (card.last4) {
            return "**** **** ****" + card.last4
        } else {
            return "未登録"
        }
    },[card])

    // card.brand include Visa and MasterCard and so on.
    return (
        <section className="c-section-container">
            <h2 className="u-text__headline u-text-center">クレジットカード情報の登録・編集</h2>
            <div className="module-spacer--medium" />
            <h3>現在登録されているカード情報</h3>
            <div className="module-spacer--small" />
            <TextDetail label={card.brand} value={cardNumber} key={card.id} />
            <div className="module-spacer--small" />
            <h3>カード情報の登録・編集</h3>
            <div className="module-spacer--small" />
            <CardElement
                className={classes.element}
                options={{
                    style: {
                        base: {
                            fontSize: '16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                    },
                }}
            />
        <div className="module-spacer--medium"/>
        <div>
                <p>
                    このECアプリではStripeのテスト用カードを使うことができます。<br/>
                    実際に決済されることはないので安心して使ってください。
                </p>
                <p>
                    CVCコード、郵便番号はどんな数字でもOKです。有効期限は未来の年月ならなんでもOK。<br/>
                </p>
                <div className="module-spacer--small"/>
                <TextDetail label={"VISA"} value={"4242 4242 4242 4242"} key={"test-visa"}/>
                <TextDetail label={"Master Card"} value={"5555 5555 5555 4444"} key={"test-master-card"}/>
                <TextDetail label={"AMEX"} value={"3782 822463 10005"} key={"test-amex"}/>
                <TextDetail label={"Discover"} value={"6011 1111 1111 1117"} key={"test-discover"}/>
                <TextDetail label={"Diners Club"} value={"3056 9300 0902 0004"} key={"test-diners-club"}/>
        </div>
        <div className="module-spacer--medium"/>
            <div className="center">
                <form>
                    <PaymentElement />
                    <PrimaryButton
                        label={"カード情報を保存する"}
                        onClick={register}
                    />
                </form>
                <GreyButton
                    label={"マイページに戻る"}
                    onClick={goBackToMyPage}
                />
            </div>
        </section>


    )
}

export default PaymentEdit