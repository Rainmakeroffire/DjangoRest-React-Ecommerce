import {
    FEEDBACK_SUBMIT_REQUEST,
    FEEDBACK_SUBMIT_SUCCESS,
    FEEDBACK_SUBMIT_FAIL,
  } from '../constants/feedbackConstants';
  
  export const feedbackSendReducer = (state = { loading: false, success: false, error: null }, action) => {
    switch (action.type) {
      case FEEDBACK_SUBMIT_REQUEST:
        return { loading: true, success: false, error: null };
      case FEEDBACK_SUBMIT_SUCCESS:
        return { loading: false, success: true, error: null, message: action.payload };
      case FEEDBACK_SUBMIT_FAIL:
        return { loading: false, success: false, error: action.payload };
      default:
        return state;
    }
  };