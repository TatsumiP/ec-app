import React from 'react'
import {getUserId, getUsername} from "../reducks/users/selectors";
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "../reducks/users/operations";

const Home = () => {
    const dispatch = useDispatch();                     //
    const selector = useSelector(state => state);       // store全体のstateを取得し、定数に。
    const uid = getUserId(selector);
    const username = getUsername(selector);

    return(
        <div>
            <h2>Home</h2>
            <p>ユーザーID: {uid}</p>
            <p>ユーザー名: {username}</p>
            <button onClick={() => dispatch(signOut())}>SIGN OUT</button>
        </div>
    )
}

export default Home