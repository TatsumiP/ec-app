import {createSelector} from 'reselect';

// storeで管理しているstateを参照する関数
const usersSelector = (state) => state.users;
    
export const getIsSignedIn = createSelector(
    [usersSelector],
    state => state.isSignedIn
)
    // selectorで現在計算が必要な状態stateを切り替えている。
export const getProductsInCart = createSelector(
    [usersSelector],
    state => state.cart
)

export const getUserId = createSelector(
    [usersSelector],
    state => state.uid
)

export const getUsername = createSelector(
    [usersSelector],
    state => state.username
)