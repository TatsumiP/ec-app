import {createSelector} from 'reselect';

// storeで管理しているstateを参照する関数
const usersSelector = (state) => state.users;

export const getOrdersHistory = createSelector(
    [usersSelector],
    state => state.orders
)
    // selectorで現在計算が必要な状態stateを切り替えている。
export const getProductsInCart = createSelector(
    [usersSelector],
    state => state.cart
)

export const getFavoriteProducts = createSelector(
    [usersSelector],
    (state) => state.favorite
)

export const getUserId = createSelector(
    [usersSelector],
    state => state.uid
)

export const getUsername = createSelector(
    [usersSelector],
    state => state.username
)

export const getIsSignedIn = createSelector(
    [usersSelector],
    state => state.isSignedIn
)

export const getCustomerId = createSelector(
    [usersSelector],
    state => state.customer_id
)

export const getPaymentMethodId = createSelector(
    [usersSelector],
    state => state.payment_method_id
)