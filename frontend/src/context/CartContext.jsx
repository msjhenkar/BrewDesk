import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, { ...action.item, quantity: 1 }];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id);
    case 'INCREMENT':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    case 'DECREMENT':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const increment = (id) => dispatch({ type: 'INCREMENT', id });
  const decrement = (id) => dispatch({ type: 'DECREMENT', id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, increment, decrement, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
