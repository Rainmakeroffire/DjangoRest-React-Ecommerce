import axios from "axios";
import {
    TESTIMONIALS_REQUEST,
    TESTIMONIALS_SUCCESS,
    TESTIMONIALS_FAIL,
  } from "../constants/testimonialsConstants";

  export const listTestimonials = () => async (dispatch) => {
    try {
      dispatch({ type: TESTIMONIALS_REQUEST });
  
      const { data } = await axios.get(`/api/testimonials/`);
  
      dispatch({
        type: TESTIMONIALS_SUCCESS,
        payload: data,
      });
  
    } catch (error) {
      
      dispatch({
        type: TESTIMONIALS_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };