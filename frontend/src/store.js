import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  productLatestReducer,
  productFilteredReducer,
} from "./reducers/productReducers";
import { cartReducer } from './reducers/cartReducers'; 
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer, passwordResetInitReducer, passwordResetConfirmReducer } from './reducers/userReducers';
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderListMyReducer, orderListReducer, orderDeliverReducer } from './reducers/orderReducers';
import { favoriteAddReducer, favoriteRemoveReducer, favoriteListMyReducer } from './reducers/favoritesReducers';
import { comparisonAddReducer, comparisonRemoveReducer, comparisonListMyReducer } from './reducers/comparisonsReducers';
import { reviewRemoveReducer, reviewListMyReducer } from './reducers/reviewsReducers';
import { testimonialsListReducer } from './reducers/testimonialsReducers';
import { feedbackSendReducer } from './reducers/feedbackReducers';
import { subscribeInitiateReducer, subscribeConfirmReducer, unsubscribeConfirmReducer } from './reducers/subscriptionReducers';

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  productLatest: productLatestReducer,
  productFiltered: productFilteredReducer,

  cart: cartReducer,

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  passwordResetInit: passwordResetInitReducer,
  passwordResetConfirm: passwordResetConfirmReducer,

  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer,

  favoriteAdd: favoriteAddReducer,
  favoriteRemove: favoriteRemoveReducer,
  favoriteListMy: favoriteListMyReducer,

  comparisonAdd: comparisonAddReducer,
  comparisonRemove: comparisonRemoveReducer,
  comparisonListMy: comparisonListMyReducer,

  reviewRemove: reviewRemoveReducer,
  reviewListMy: reviewListMyReducer,

  testimonialsList: testimonialsListReducer,

  feedbackSend: feedbackSendReducer,

  subscribeInitiate: subscribeInitiateReducer,
  subscribeConfirm: subscribeConfirmReducer,
  unsubscribeConfirm: unsubscribeConfirmReducer,
});

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')): [];

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')): {};

const initialState = {
  cart: { 
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage  
  },
  userLogin: {userInfo: userInfoFromStorage}
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
