const backendDomin = process.env.REACT_APP_BACKEND_URL;

const SummaryApi = {
  signUp: {
    url: `${backendDomin}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomin}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomin}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomin}/api/userLogout`,
    method: "get",
  },
  allUser: {
    url: `${backendDomin}/api/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomin}/api/update-user`,
    method: "post",
  },
  forgotPassword: {
    url: `${backendDomin}/api/forgot-password`,
    method: "post",
  },
  verifyForgotPasswordOtp: {
    url: `${backendDomin}/api/verify-forgot-password-otp`,
    method: "post",
  },
  resetPassword: {
    url: `${backendDomin}/api/reset-password`,
    method: "post",
  },
  deleteUser: {
    url: `${backendDomin}/api/delete-user`,
    method: "delete",
  },
  uploadProduct: {
    url: `${backendDomin}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomin}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomin}/api/update-product`,
    method: "post",
  },
  getCategoryProduct: {
    url: `${backendDomin}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomin}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomin}/api/product-details`,
    method: "post",
  },
  deleteProduct: {
    url: `${backendDomin}/api/delete-product`,
    method: "delete",
  },
  addToCartProduct: {
    url: `${backendDomin}/api/addToCart`,
    method: "post",
  },
  addToCardProductCount: {
    url: `${backendDomin}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomin}/api/view-cart-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomin}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomin}/api/delete-cart-product`,
    method: "post",
  },
  searchProduct: {
    url: `${backendDomin}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomin}/api/filter-product`,
    method: "post",
  },
  payment: {
    url: `${backendDomin}/api/create-order`,
    method: "post",
  },
  getOrder: {
    url: `${backendDomin}/api/order-list`,
    method: "get",
  },
  allOrder: {
    url: `${backendDomin}/api/all-order`,
    method: "get",
  },
  updateOrder: {
    url: `${backendDomin}/api/update-order`,
    method: "post",
  },
  rating: {
    url: `${backendDomin}/api/rating`,
    method: "post",
  },
  getRatingsByProduct: {
    url: `${backendDomin}/api/ratings`,
    method: "get",
  },
  getMessages: {
    url: `${backendDomin}/api/chat`,
    method: "get",
  },
  sendMessage: {
    url: `${backendDomin}/api/chat`,
    method: "post",
  },
  notificationsReplies: {
    url: `${backendDomin}/api/notifications/replies`,
    method: "get",
  },
  notificationsRepliesMarkRead: {
    url: `${backendDomin}/api/notifications/replies/read`,
    method: "patch",
  },
  getAllChatController: {
    url: `${backendDomin}/api/chats`,
    method: "get",
  },
  deleteChatController: {
    url: `${backendDomin}/api/delete`,
    method: "delete",
  },
  // THÊM CÁI NÀY VÀO
  chatbot: {
    url: `${backendDomin}/api/chatbot`,
    method: "post",
  },
};

export default SummaryApi;
