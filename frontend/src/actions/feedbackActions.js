import axios from 'axios';
import {
    FEEDBACK_SUBMIT_REQUEST,
    FEEDBACK_SUBMIT_SUCCESS,
    FEEDBACK_SUBMIT_FAIL,
  } from '../constants/feedbackConstants';

  export const sendFeedback = (formData) => async (dispatch) => {
    try {
      dispatch({ type: FEEDBACK_SUBMIT_REQUEST });
  
      const { data } = await axios.post('/api/send-feedback/', formData);
  
      dispatch({ 
        type: FEEDBACK_SUBMIT_SUCCESS,
        payload: data.message 
      });
    } catch (error) {
      dispatch({
        type: FEEDBACK_SUBMIT_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };