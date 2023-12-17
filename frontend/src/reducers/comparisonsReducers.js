import {
    COMPARISONS_ADD_REQUEST,
    COMPARISONS_ADD_SUCCESS,
    COMPARISONS_ADD_FAIL,
    COMPARISONS_ADD_RESET,

    COMPARISONS_REMOVE_REQUEST,
    COMPARISONS_REMOVE_SUCCESS,
    COMPARISONS_REMOVE_FAIL,
    COMPARISONS_REMOVE_RESET,

    COMPARISONS_LIST_MY_REQUEST,
    COMPARISONS_LIST_MY_SUCCESS,
    COMPARISONS_LIST_MY_FAIL,
} from "../constants/comparisonsConstants";

export const comparisonAddReducer = (state = {}, action) => {
    switch (action.type) {
      case COMPARISONS_ADD_REQUEST:
        return { loading: true };
      case COMPARISONS_ADD_SUCCESS:
        return { loading: false, success: true, compItem: action.payload };
      case COMPARISONS_ADD_FAIL:
        return { loading: false, error: action.payload };
      case COMPARISONS_ADD_RESET:
        return {};
      default:
        return state;
    }
  };

export const comparisonRemoveReducer = (state = {}, action) => {
  switch (action.type) {
      case COMPARISONS_REMOVE_REQUEST:
        return { loading: true };
      case COMPARISONS_REMOVE_SUCCESS:
        return { loading: false, success: true };
      case COMPARISONS_REMOVE_FAIL:
        return { loading: false, error: action.payload };
      case COMPARISONS_REMOVE_RESET:
        return {};
      default:
        return state;
    }
};

export const comparisonListMyReducer = (state = { comparisons: [] }, action) => {
  switch (action.type) {
    case COMPARISONS_LIST_MY_REQUEST:
      return { 
        loading: true 
      };
    case COMPARISONS_LIST_MY_SUCCESS:
      return { 
        loading: false,
        comparisons: action.payload.mycomparisons,
      };
    case COMPARISONS_LIST_MY_FAIL:
      return { 
        loading: false, 
        error: action.payload 
      };
      
    default:
      return state;
  }
};
