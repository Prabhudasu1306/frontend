import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { useCart } from './CartContext';
import './Cart.css';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { addItemToCart, getCartItems, removeItemFromCart } = useCart(); 

  useEffect(() => {
    axios.get('http://localhost:8080/foods/all')
      .then(response => {
        const filteredItems = response.data.filter(item => item.categoryName === category);
        setItems(filteredItems);
      })
      .catch(error => {
        console.error('Error fetching items:', error);
      });
  }, [category]);

  const cartItems = getCartItems();

  const handleIncrease = (itemId) => {
    addItemToCart(cartItems.find(item => item.id === itemId), 1);
  };

  const handleDecrease = (itemId) => {
    removeItemFromCart(itemId);
  };

  const handleAddToCart = (item) => {
    addItemToCart(item, 1);
  };

  return (
    <div>
      <h2>Items in {category}</h2>
      <div className="cart-items">
        {items.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.imageUrl} alt={item.name} className="item-image" />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Price: ₹{item.price}</p>
              <p>GST: ₹{item.totalGST}</p>
              {cartItems.find(cartItem => cartItem.id === item.id) ? (
                <div className="quantity-controls">
                  <button onClick={() => handleDecrease(item.id)}>-</button>
                  <span>{cartItems.find(cartItem => cartItem.id === item.id).quantity}</span>
                  <button onClick={() => handleIncrease(item.id)}>+</button>
                </div>
              ) : (
                <button onClick={() => handleAddToCart(item)} className="add-to-cart">
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cart;