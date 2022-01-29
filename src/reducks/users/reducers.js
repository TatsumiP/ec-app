import * as Actions from './actions';
import initialState from '../store/initialState';

// UsersReducerの第一引数にstate、第二引数にactionがreturnしたプレーンなObject、値
export const UsersReducer = (state = initialState.users, action) => {
    switch (action.type) {
        case Actions.FETCH_ORDERS_HISTORY:
            return {
                ...state,
                orders: [...action.payload]         // ordersのstateを更新。actionでの引数はhistory、historyはoperationsのlistである。listは商品データの配列。これでreducers側で新しいstateが更新されたと検知される
            } // reduxのstoreの状態を更新
        case Actions.FETCH_PRODUCTS_IN_CART:
            return {
                ...state,
                cart: [...action.payload]
            } // reduxのstoreの状態を更新
        case Actions.SIGN_IN:
                     /*action.typeがActions.SIGN_INのときstateをどう変更するか*/
            return {
                ...state,
                ...action.payload
                // isSignedIn: action.payload.isSingnedIn,
                // uid: action.payload.uid,
                // username: action.payload.username　と展開される。
            }
        case Actions.SIGN_OUT:
            return {
                ...action.payload
            };
        default:
            return state
    }
};