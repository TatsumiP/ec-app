import React from 'react';
import {Switch, Route} from "react-router";
import {
    CartList, CheckoutWrapper, FavoriteList, OrderConfirm, OrderComplete, OrderHistory, ProductDetail,
    ProductList, ProductEdit, UserMyPage, SignIn, SignUp, Reset
} from "./templates";
import Auth from './Auth';

// info: react-router-dom use Routes in stead of switch.
// info: v6 react-router-dom has some pretty significant breaking changes.bundle size decrease 80%
// info: In react-router, pathname of locationProp attempt  destructure from undefined.So we need to create ando pass these props ourself with createBrowserHistory from "history".

const Router = () => {
    return (
            <Switch>
                <Route exact path="/signup" component={SignUp} />
                <Route exact path="/signin" component={SignIn} />
                <Route exact path="/signin/reset" component={Reset} />

                <Auth>
                    <Route exact path="(/)?" component={ProductList} />
                    <Route exact path="/product/:id" component={ProductDetail} />
                    <Route path="/product/edit(/:id)?" component={ProductEdit} />

                    <Route exact path="/cart" component={CartList} />
                    <Route exact path="/favorite" component={FavoriteList} />
                    <Route exact path="/order/confirm" component={OrderConfirm} />
                    <Route exact path="/order/complete" component={OrderComplete} />
                    <Route exact path="/order/history" component={OrderHistory} />

                    <Route exact path="/user/mypage" component={UserMyPage} />
                    <Route exact path="/user/payment/edit" component={CheckoutWrapper} />

                </Auth>
            </Switch>
    );
};

export default Router;