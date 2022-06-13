import React from 'react';
import {Footer} from './components/UIkit'
import Router from "./Router";
import {Header} from "./components/Header";

    // HTMLではタグを並列に並べることができないので、<></>で挟む
const App = () => {
    return (
        <>
            <Header />
            <main className="c-main">
                <Router />
            </main>
            <Footer />
        </>
    );
};

export default App;