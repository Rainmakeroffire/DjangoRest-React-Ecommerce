import {
    FAVORITES_ADD_REQUEST,
    FAVORITES_ADD_SUCCESS,
    FAVORITES_ADD_FAIL,
    FAVORITES_ADD_RESET,

    FAVORITES_REMOVE_REQUEST,
    FAVORITES_REMOVE_SUCCESS,
    FAVORITES_REMOVE_FAIL,
    FAVORITES_REMOVE_RESET,

    FAVORITES_LIST_MY_REQUEST,
    FAVORITES_LIST_MY_SUCCESS,
    FAVORITES_LIST_MY_FAIL,
} from "../constants/favoritesConstants";

export const favoriteAddReducer = (state = {}, action) => {
    switch (action.type) {
      case FAVORITES_ADD_REQUEST:
        return { loading: true };
      case FAVORITES_ADD_SUCCESS:
        return { loading: false, success: true, favItem: action.payload };
      case FAVORITES_ADD_FAIL:
        return { loading: false, error: action.payload };
      case FAVORITES_ADD_RESET:
        return {};
      default:
        return state;
    }
  };

export const favoriteRemoveReducer = (state = {}, action) => {
  switch (action.type) {
      case FAVORITES_REMOVE_REQUEST:
        return { loading: true };
      case FAVORITES_REMOVE_SUCCESS:
        return { loading: false, success: true };
      case FAVORITES_REMOVE_FAIL:
        return { loading: false, error: action.payload };
      case FAVORITES_REMOVE_RESET:
        return {};
      default:
        return state;
    }
};

export const favoriteListMyReducer = (state = { favorites: [] }, action) => {
  switch (action.type) {
    case FAVORITES_LIST_MY_REQUEST:
      return { 
        loading: true 
      };
    case FAVORITES_LIST_MY_SUCCESS:
      return { 
        loading: false,
        favorites: action.payload.myfavorites,
      };
    case FAVORITES_LIST_MY_FAIL:
      return { 
        loading: false, 
        error: action.payload 
      };
      
    default:
      return state;
  }
};
