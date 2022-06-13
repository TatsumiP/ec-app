import {
    createStore as reduxCreateStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import {connectRouter, routerMiddleware} from 'connected-react-router'
import thunk from 'redux-thunk';
import {ProductsReducer} from '../products/reducers';
import {UsersReducer} from '../users/reducers';


// アロー関数でもいいが、今回は名前付き関数で宣言する。
// こうすることで、ここでどのようなstateを使っているのか一目でわかるようになっている。
export default function createStore(history) {
    return reduxCreateStore(                    // reduxのcreateStoreメソッドの別名
        combineReducers({
            products:ProductsReducer,
            router: connectRouter(history),
            users: UsersReducer,
        }),
        applyMiddleware(
            routerMiddleware(history),           // Store内でルーティング情報を状態に格納。SPA機能
            thunk                                // 引数の二つ目にthunkを追加するだけで非同期処理が実現
                                                 // operationsに非同期処理の制御は記述
        )
    );
}