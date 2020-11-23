import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './reducks/store/store';
import * as serviceWorker from './serviceWorker';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConnectedRouter } from 'connected-react-router';
import * as History from 'history';
import {MuiThemeProvider} from "@material-ui/core";
import {theme} from "./assets/theme";

export {default as Router} from './Router';
export {default as Auth} from './Auth';

const history = History.createBrowserHistory();
// storeという定数にstoreの情報を与える
export const store = createStore(history);

// Providerというコンポーネントにpropsとしてstoreを渡す。Providerはラッピングのような役割
// 子要素にアプリのルートのコンポーネントになるAppに入れている。
// store={store}でstoreの情報をpropsに入れている
// Material-uiのthemeを使うにはここでProviderのラッピングが必要

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
