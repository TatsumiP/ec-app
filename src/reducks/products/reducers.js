import * as Actions from './actions';
import initialState from '../store/initialState';

// UsersReducerの第一引数にstate、第二引数にactionがreturnしたプレーンなObject、値
export const ProductsReducer = (state = initialState.products, action) => {
    switch (action.type) {
        case Actions.DELETE_PRODUCTS:
            return {
                ...state,
                    //　配列を新しい配列にしなおさないとstoreの更新をコンポーネント側で検知してくれない
                list: [...action.payload]
            };
        case Actions.FETCH_PRODUCTS:
            return {
                ...state,
                    //　配列を新しい配列にしなおさないとstoreの更新をコンポーネント側で検知してくれない
                list: [...action.payload]
            };
        default:
            return state
    }
}