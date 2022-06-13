import React from 'react';
import {loadStripe} from "@stripe/stripe-js/pure";
import {Elements} from "@stripe/react-stripe-js";
import {PaymentEdit} from "../components/Payment";

const STRIPE_PUBLIC_KEY = "pk_test_51Kgk61AoNoUiSh9mZGwMww882u2f5ztv2LGhcpChG0zs8EeHVKWIhos3bH3jbNXmuXGI99hOS7qBUNxOcgwMWOM000VZe42s9q";
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const CheckoutWrapper = () => {
    const options = {
        // passing the client secret obtained from the server
        clientSecret: '{{CLIENT_SECRET}}',
    }

    return (
        <Elements stripe={stripePromise} options={options}>
             <PaymentEdit />
        </Elements>
    );
};

export default CheckoutWrapper;