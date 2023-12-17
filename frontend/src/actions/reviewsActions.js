import axios from "axios";
import {
    REVIEWS_REMOVE_REQUEST,
    REVIEWS_REMOVE_SUCCESS,
    REVIEWS_REMOVE_FAIL,

    REVIEWS_LIST_MY_REQUEST,
    REVIEWS_LIST_MY_SUCCESS,
    REVIEWS_LIST_MY_FAIL,
} from "../constants/reviewsConstants";

export const removeFromReviews = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: REVIEWS_REMOVE_REQUEST
        });

        const {
            userLogin: { userInfo }
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };
        console.log(id);
        const { data } = await axios.delete(`/api/reviews/remove/${id}/`, config);

        dispatch({
            type: REVIEWS_REMOVE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: REVIEWS_REMOVE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const listMyReviews = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: REVIEWS_LIST_MY_REQUEST
        });

        const { 
            userLogin: { userInfo } 
        } = getState();

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/users/profile/reviews`, config);

        dispatch({
            type: REVIEWS_LIST_MY_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: REVIEWS_LIST_MY_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}