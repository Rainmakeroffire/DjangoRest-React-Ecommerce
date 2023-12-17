import {
    REVIEWS_REMOVE_REQUEST,
    REVIEWS_REMOVE_SUCCESS,
    REVIEWS_REMOVE_FAIL,
    REVIEWS_REMOVE_RESET,

    REVIEWS_LIST_MY_REQUEST,
    REVIEWS_LIST_MY_SUCCESS,
    REVIEWS_LIST_MY_FAIL,
} from "../constants/reviewsConstants";

export const reviewRemoveReducer = (state = {}, action) => {
  switch (action.type) {
      case REVIEWS_REMOVE_REQUEST:
        return { loading: true };
      case REVIEWS_REMOVE_SUCCESS:
        return { loading: false, success: true };
      case REVIEWS_REMOVE_FAIL:
        return { loading: false, error: action.payload };
      case REVIEWS_REMOVE_RESET:
        return {};
      default:
        return state;
    }
};

export const reviewListMyReducer = (state = { reviews: [] }, action) => {
  switch (action.type) {
    case REVIEWS_LIST_MY_REQUEST:
      return { 
        loading: true 
      };
    case REVIEWS_LIST_MY_SUCCESS:
      return { 
        loading: false,
        reviews: action.payload.myreviews,
      };
    case REVIEWS_LIST_MY_FAIL:
      return { 
        loading: false, 
        error: action.payload 
      };
      
    default:
      return state;
  }
};
