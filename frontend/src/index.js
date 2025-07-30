import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext'; // Import the new provider

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ProductProvider> {/* ProductProvider wraps CartProvider */}
        <CartProvider>
          <App />
        </CartProvider>
      </ProductProvider>
    </ClerkProvider>
  </React.StrictMode>
);