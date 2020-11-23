import React, { useEffect } from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getIsSignedIn} from "./reducks/users/selectors";
import {listenAuthState} from "./reducks/users/operations";

// Authコンポーネントが呼び出されるとchildrenの子要素を呼び出して、
//　もしサインインしてなかったらlistenAuthStateを呼び出す。
const Auth = ({children}) => {
    const dispatch = useDispatch();
    const selector = useSelector((state) => state);
    const isSignedIn = getIsSignedIn(selector);

    useEffect(() => {
        if (!isSignedIn) {
            dispatch(listenAuthState())
        }
    },[]);
    // RouterでAuthを呼び出したときにもしサインインしていないなら、
    //　空っぽのjsxを返す。サインインしてたら子要素、を返す。
    // 　子供のコンポーネントになっているのを返す？？？
    if (!isSignedIn) {
        return <></>
    } else {
        return children
    }
}

export default Auth;