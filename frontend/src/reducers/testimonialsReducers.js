import {
    TESTIMONIALS_REQUEST,
    TESTIMONIALS_SUCCESS,
    TESTIMONIALS_FAIL,
  } from "../constants/testimonialsConstants";

export const testimonialsListReducer = (
    state = { testimonials: [] },
    action
  ) => {
    switch (action.type) {
      case TESTIMONIALS_REQUEST:
        return { loading: true, testimonials: [] };
      case TESTIMONIALS_SUCCESS:
        return { loading: false, testimonials: action.payload };
      case TESTIMONIALS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };