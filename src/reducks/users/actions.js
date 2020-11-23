export const FETCH_PRODUCTS_IN_CART = "FETCH_PRODUCTS_IN_CART";
export const fetchProductsInCartAction = (products) => {
    return {
        type: "FETCH_PRODUCTS_IN_CART",
        payload: products
    }
};

// Action typeを定義してexport
export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState) => {
    // typeとpayloadを記述
    // プレーンなobjectを返す
    return {
        type: "SIGN_IN",
        payload: {
            isSignedIn: true,
            role:userState.role,
            uid: userState.uid,
            username: userState.username
        }
    }
};

export const SIGN_OUT = "SIGN_OUT";
export const signOutAction = () => {
    return {
        type: "SIGN_OUT",
        payload: {
            isSignedIn: false,
            role:"",
            uid: "",
            username: ""
        }
    }
};