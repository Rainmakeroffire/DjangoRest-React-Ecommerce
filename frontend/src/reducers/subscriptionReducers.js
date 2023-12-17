import {
    SUBSCRIBE_INITIATE_REQUEST,
    SUBSCRIBE_INITIATE_SUCCESS,
    SUBSCRIBE_INITIATE_FAILURE,
    SUBSCRIBE_INITIATE_RESET,

    SUBSCRIBE_CONFIRM_REQUEST,
    SUBSCRIBE_CONFIRM_SUCCESS,
    SUBSCRIBE_CONFIRM_FAILURE,

    UNSUBSCRIBE_CONFIRM_REQUEST,
    UNSUBSCRIBE_CONFIRM_SUCCESS,
    UNSUBSCRIBE_CONFIRM_FAILURE,
  } from '../constants/subscriptionConstants';
  
  export const subscribeInitiateReducer = (state = {}, action) => {
    switch (action.type) {
      case SUBSCRIBE_INITIATE_REQUEST:
        return { loading: true };
      case SUBSCRIBE_INITIATE_SUCCESS:
        return { loading: false, success: true, message: action.payload };
      case SUBSCRIBE_INITIATE_FAILURE:
        return { loading: false, error: action.payload };
      case SUBSCRIBE_INITIATE_RESET:
        return { };
      default:
        return state;
    }
  };
  
  export const subscribeConfirmReducer = (state = {}, action) => {
    switch (action.type) {
      case SUBSCRIBE_CONFIRM_REQUEST:
        return { loading: true };
      case SUBSCRIBE_CONFIRM_SUCCESS:
        return { loading: false, success: true, message: action.payload };
      case SUBSCRIBE_CONFIRM_FAILURE:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const unsubscribeConfirmReducer = (state = {}, action) => {
    switch (action.type) {
      case UNSUBSCRIBE_CONFIRM_REQUEST:
        return { loading: true };
      case UNSUBSCRIBE_CONFIRM_SUCCESS:
        return { loading: false, success: true, message: action.payload };
      case UNSUBSCRIBE_CONFIRM_FAILURE:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  