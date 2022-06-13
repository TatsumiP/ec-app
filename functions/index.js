const functions = require("firebase-functions");
// stripe secretkey allows me to use stripe method only under my deveropment
const stripe = require('stripe')(functions.config().stripe.key);
const cors = require('cors');
// Email Delivery API Marketing Service
const sendgrid = require('@sendgrid/mail');

// Configure environment variable with the following command
// firebase functions:config:set sendgrid.key="YOUR_API_KEY"
const SENDGRID_API_KEY = functions.config().sendgrid.key;

// response.send method throw response to clientside from serverside
// CORS(Cross Origin Resorce Sharing) is repels cross-domain processing. So configure settings to avoid being repeled.
const sendResponse = (response, statusCode, body) => {
    response.send({
        statusCode,
        headers: {"Access-Control-Allow-Origin": "*"},
        body: JSON.stringify(body)
    })
}

// reference from "create customer" of stripe API
// CORS rapping is often used when introducing API.
// req {object} => {email: string, userId: string, paymentMethod: string}
exports.stripeCustomer = functions.https.onRequest((req, res) => {     // creating API
    const corsHandler = cors({origin: true})

    corsHandler(req, res, () => {
        // How HTTP works: for what? = URL, what to do? = HTTP Method(GET,POST)
        // e.g. 'Get https:/api.twitter.com/user_timeline' means 'request twitter to give timeline'.
        // Determines whether the method is a POST method
        if (req.method === 'POST') {
            // After creating the user's customer info, the paymentmethod is tied to the info.
            return stripe.customer.create({
                description: "EC App user",
                email: req.body.email,
                metadata: {userId: req.body.userId},
                payment_method: req.body.paymentMethod
            }).then((customer) => {
                sendResponse(res, 200, customer)
            }).catch((error) => {
                sendResponse(res, 500, {error: error})
            })
        } else if (req.method === 'DELETE') {
            return stripe.customers.del(
                req.body.customerId
            ).then((customer) => {
                sendResponse(res, 200, customer);
            }).catch((error) => {
                console.error(error);
                sendResponse(res, 500, {error: error})
            })
        } else {
            sendResponse(res, 405, {error: "Invalid Request"})
        }
    })
})

// stripe.paymentMethods.retrieve method allows me to get card values in Backend
// I need firebase-deploy and add rewrites to firebase.json each time an API is created.
exports.retrievePaymentMethod = functions.https.onRequest((req, res) => {
    const corsHandler = cors({origin: true})

    corsHandler(req, res, () => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, {error: "Invalid Request method!"})
        }

        return stripe.paymentMethods.retrieve(
            req.body.paymentMethodId
        ).then((paymentMethod) => {
            sendResponse(res, 200, paymentMethod)
        }).catch((error) => {
            sendResponse(res, 500, {error: error})
        })
    })
})

// Create API to edit credit card info, using stripe.paymentMethods.detach and attach methods
exports.updatePaymentMethod = functions.https.onRequest((req, res) => {
    const corsHandler = cors({origin: true})

    corsHandler(req, res, () => {
        if (req.method !== 'POST') {
            sendResponse(res, 405, {error: "Invalid Request method!"})
        }
        // Passing and erasing the previous paymentMethodId
        return stripe.paymentMethods.detach(
            req.body.prevPaymentMethodId
        ).then((paymentMethod) => {
            // Pass the next paymentMethodId to the body,which customerId to tie that method to, and make the request body have the customerId.
            return stripe.paymentMethods.attach(
                req.body.nextPaymentMethodId,
                {customer: req.body.customerId}
            ).then((nextPaymentMethod) => {
                sendResponse(res, 200, paymentMethod)
            })
        }).catch((error) => {
            sendResponse(res, 500, {error: error})
        })
    })
})

exports.sendThankYouMail = functions.https.onCall(async (data, context) => {
    const body = `<p>${data.username}様 </p>
                  <p>ポムポム王国の会員登録が完了しました。</p>
                  <p>ログインしてお買い物をお楽しみください。</p>
                  <div>
                    <a
                      href="https;//localhost:3000/signin" role="button" target="_blank"
                      style="background: #4dd0e1; border-radius: 4px; color: #000; cursor: pointer; font-weight: 600;
                             height: 48px; line-height: 48px; margin: 0 auto; padding: 8px 16px;
                             text-align: center; text-decoration: none; width:320px;"
                    >
                      ログインして使い始める
                    </a>
                  </div>
                  <p>
                    ■ご注意<br>
                    このメールは、ポムポム王国にご登録いただいた方に自動送信しています。<br>
                    本メールにお心当たりがない場合は、誠に恐れ入りますが弊社サポートまでお問い合わせくださいますようお願いいたします。
                  </p>
                  <p>
                    瓜生真吾<br>
                    Email: nosniborto395@yahoo.co.jp
                    HP: localhost3000://home
                  </p>`;
    sendgrid.setApiKey(SENDGRID_API_KEY);
    const message = {
        to: data.email,
        from: "nosniborto305@yahoo.co.jp",
        subject: "【ポムポム王国】会員登録完了のお知らせ",
        html: body
    };
    await sendgrid.send(message);
    return null
});