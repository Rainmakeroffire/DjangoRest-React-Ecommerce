import axios from 'axios';
import {
  SUBSCRIBE_INITIATE_REQUEST,
  SUBSCRIBE_INITIATE_SUCCESS,
  SUBSCRIBE_INITIATE_FAILURE,

  SUBSCRIBE_CONFIRM_REQUEST,
  SUBSCRIBE_CONFIRM_SUCCESS,
  SUBSCRIBE_CONFIRM_FAILURE,
  
  UNSUBSCRIBE_CONFIRM_REQUEST,
  UNSUBSCRIBE_CONFIRM_SUCCESS,
  UNSUBSCRIBE_CONFIRM_FAILURE,
} from '../constants/subscriptionConstants';

export const initiateSubscribe = (email) => async (dispatch) => {
  try {
    dispatch({ type: SUBSCRIBE_INITIATE_REQUEST });

    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const { data } = await axios.post('/api/subscribe/', { email }, config);

    dispatch({
      type: SUBSCRIBE_INITIATE_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIBE_INITIATE_FAILURE,
      payload: 
        error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
    });
  }
};

export const confirmSubscribe = (subscriberId, token) => async (dispatch) => {
  try {
    dispatch({ type: SUBSCRIBE_CONFIRM_REQUEST });

    const { data } = await axios.get(`/api/confirm-subscription/${subscriberId}/${token}/`);

    dispatch({
      type: SUBSCRIBE_CONFIRM_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: SUBSCRIBE_CONFIRM_FAILURE,
      payload: 
        error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
    });
  }
};

export const confirmUnsubscribe = (subscriberId, token) => async (dispatch) => {
  try {
    dispatch({ type: UNSUBSCRIBE_CONFIRM_REQUEST });

    const { data } = await axios.get(`/api/unsubscribe/${subscriberId}/${token}/`);

    dispatch({
      type: UNSUBSCRIBE_CONFIRM_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: UNSUBSCRIBE_CONFIRM_FAILURE,
      payload: 
        error.response && error.response.data.detail 
            ? error.response.data.detail 
            : error.message,
    });
  }
};
