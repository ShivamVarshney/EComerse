export const BASE_URL = import.meta.env.MODE === 'development'
  ? 'http://localhost:5000' 
  : 'https://eccomerceproject-1.onrender.com';
export const USERS_URL = "/api/v1/users";
export const CATEGORY_URL = "/api/v1/category";
export const PRODUCT_URL = "/api/v1/products";
export const ORDERS_URL = "/api/v1/orders"
export const PAYPAL_URL = "/api/v1/config/paypal"
