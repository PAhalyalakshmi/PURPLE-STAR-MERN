import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default API;

/* PRODUCTS */
export const getAllProducts = (query) => API.get(`/products?${query || ""}`);
export const getProductById = (id) => API.get(`/products/${id}`);

/* WISHLIST */
export const addWishlist = (productId) => API.post("/wishlist/add", { productId });
export const removeWishlist = (productId) => API.delete(`/wishlist/${productId}`);
export const getWishlist = () => API.get("/wishlist");

/* CART */
export const addToCart = (data) => API.post("/cart/add", data);
export const getCart = () => API.get("/cart");

/* ORDERS */
export const placeOrder = (data) => API.post("/orders/place", data);
export const getMyOrders = () => API.get("/orders/myorders");
export const getOrderById = (id) => API.get(`/orders/${id}`);

/* ADMIN ORDERS */
export const getAllOrders = () => API.get("/orders/admin/all");
export const updateOrderStatus = (orderId, status) => API.put(`/orders/admin/update-status/${orderId}`, { status });

/* PROFILE */
export const getProfile = () => API.get("/profile");
export const updateProfile = (formData) =>
  API.put("/profile/update", formData, { headers: { "Content-Type": "multipart/form-data" } });

/* ADMIN PRODUCTS (if any) */
export const adminAddProduct = (formData) =>
  API.post("/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const adminDeleteProduct = (id) => API.delete(`/products/${id}`);

/* COUPONS */
export const createCoupon = (data) => API.post("/coupons", data); // admin
export const getAllCoupons = () => API.get("/coupons"); // admin
export const deleteCoupon = (id) => API.delete(`/coupons/${id}`); // admin
export const validateCoupon = (data) => API.post("/coupons/validate", data); // { code, totalAmount }

/* REVIEWS */
export const addOrUpdateReview = (data) => API.post("/reviews/add", data);
export const deleteReview = (data) => API.post("/reviews/delete", data);

