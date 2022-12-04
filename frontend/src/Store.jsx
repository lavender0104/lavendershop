import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "CART_ADD_ITEM":
      // Add to cart
      // When new item is being added, the payload will store into newItem
      const newItem = action.payload;

      // Loop inside the cart to find if the newly added item exists in the cart
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );

      // If the item exists in the cart, add the 
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };

    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
