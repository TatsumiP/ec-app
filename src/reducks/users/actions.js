export const FETCH_ORDERS_HISTORY = "FETCH_ORDERS_HISTORY";
export const fetchOrdersHistoryAction = (history) => {          // historyという引数にしておく
    return {
        type: "FETCH_PRODUCTS_IN_CART",
        payload: history
    }
};

export const FETCH_PRODUCTS_IN_CART = "FETCH_PRODUCTS_IN_CART";
export const fetchProductsInCartAction = (products) => {
    return {
        type: "FETCH_PRODUCTS_IN_CART",
        payload: products
    }
};

export const FETCH_FAVORITE_PRODUCTS = 'FETCH_FAVORITE_PRODUCTS';
export const fetchFavoriteProductsAction = (favorite) => {
    return {
      type: 'FETCH_FAVORITE_PRODUCTS',
      payload: favorite
    }
  };

export const DELETE_FAVORITE_PRODUCTS = 'DELETE_FAVORITE_PRODUCTS';
export const deleteFavoriteAction = (favorite) => {
    return {
      type: 'DELETE_FAVORITE_PRODUCTS',
      payload: favorite
    }
  };

// Action typeを定義してexport
export const SIGN_IN = "SIGN_IN";
export const signInAction = (userState) => {
    return {
        type: "SIGN_IN",
        payload: {
            customer_id: userState.customer_id,
            email: userState.email,
            isSignedIn: true,
            payment_method_id: userState.payment_method_id,
            role:userState.role,
            uid: userState.uid,
            username: userState.username,
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

// Adding Customerdata state with payment
export const UPDATE_USER_STATE = "UPDATE_USER_STATE";
export const updateUserStateAction = (userState) => {
    return {
        type: "UPDATE_USER_STATE",
        payload: userState
    }
};