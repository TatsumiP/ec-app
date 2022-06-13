import {CardElement} from "@stripe/react-stripe-js";
import {db} from "../../firebase/index";
import {push} from "connected-react-router";
import {updateUserStateAction} from "../users/actions";

// In the original redux, these are written in the users operations, but for readavility, these are written here.
// hitting stripe API with the fetch method
// Set Header
const headers = new Headers();
headers.set('Content-type', 'application/json');
const BASE_URL = 'http://localhost:3000';

// POST/v1/customers is processing to create customeringo with cardinfo
const createCustomer = async (email, paymentMethodId, uid) => {
    const response = await fetch(BASE_URL + "/v1/customer", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            email:email,
            paymentMethod: paymentMethodId,
            userId: uid,
        })
    })
    // JSON.parse() parses a JSON string, costructing the JS value or object
    const customerResponse = await response.json()
    return JSON.parse(customerResponse.body);
}

// function for calling the API with fetch method
// POST/v1/payment_methods is processing to create cardinfo tied to customerinfo
export const retrievePaymentMethod = async (paymentMethodId) => {
    const response = await fetch(BASE_URL + '/v1/paymentMethod', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            paymentMethodId: paymentMethodId,
        })
    })
    const paymentMethodResponse = await response.json()
    const paymentMethod = JSON.parse(paymentMethodResponse.body)
    return paymentMethod.card
}

// hit API, then parse the results of the execution, and return the cardInfo from the execution.
export const updatePaymentMethod = async (customerId, prevPaymentMethodId, nextPaymentMethodId) => {
    const response = await fetch(BASE_URL + '/v1/updatePaymentMethod', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            customerId: customerId,
            prevPaymentMethodId: prevPaymentMethodId,
            nextPaymentMethodId: nextPaymentMethodId
        })
    });

    const paymentMethodResponse = await response.json()
    const paymentMethod = JSON.parse(paymentMethodResponse.body);
    return paymentMethod.card
}

// Function performed when the credit registration button is pressed
// useStripe and useElement hooks introduced
export const registerCard = (stripe, elements, customerId) => {
    return async (dispatch, getState) => {
        const user = getState().users
        const email = user.email
        const uid = user.uid

        //********** START VALIDATION **********//
        if (!stripe || !elements) {
            console.error("Does not exist stripe or elements");
            return;
        }

        // Get a reference to a mounted CardElement.
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            console.error("Dose not exist cardElement");
            return;
        }
        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement
        });

        if (error) {
            alert(error.message);
            return;
        }

        // Get tokened infomation.
        const paymentMethodId = paymentMethod.id

        // Create cutomer on Stripe
        if (customerId === "") {
            const customerData = await createCustomer(email, paymentMethodId, uid)

            if (!customerData.id) {
                alert('お客様情報の登録に失敗しました。')
                return;
            } else {
                const updateUserState = {
                    customer_id: customerData.id,
                    payment_method_id: paymentMethodId
                }

                db.collection('users').doc(uid)
                    .update(updateUserState)
                    .then(() => {
                        dispatch(updateUserStateAction(updateUserState))
                        alert('お客様情報を登録しました。')
                        dispatch(push('/user/mypage'))
                    }).catch(async (error) => {
                        console.error(error);
                        // Delete stripe customer
                        const deleteCustomer = await fetch(BASE_URL + '/v1/customer', {
                            method: 'DELETE',
                            headers: headers,
                            body: JSON.stringify({customerId: customerData.id})
                        });
                        await deleteCustomer.json();
                        alert('お客様情報の登録に失敗しました')
                    })
            }
        } else {    // to edit customer info
            const prevPaymentMethodId = getState().users.payment_method_id
            const updatedPaymentMethod = await updatePaymentMethod(customerId, prevPaymentMethodId, paymentMethodId)

            if (!updatedPaymentMethod) {
                alert('お客様情報の登録に失敗しました。')
            } else {
                const updateUserState = {payment_method_id: paymentMethodId}
                db.collection('users').doc(uid)
                  .update(updateUserState)
                  .then(() => {
                      dispatch(updateUserStateAction(updateUserState))
                      alert('お客様情報を更新しました。')
                      dispatch(push('/user/mypage'))
                  }).catch(() => {
                      alert('お客様情報の更新に失敗しました。')
                  })
            }
        }
    }
}



