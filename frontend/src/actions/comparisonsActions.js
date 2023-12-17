import axios from "axios";
import {
    COMPARISONS_ADD_REQUEST,
    COMPARISONS_ADD_SUCCESS,
    COMPARISONS_ADD_FAIL,

    COMPARISONS_REMOVE_REQUEST,
    COMPARISONS_REMOVE_SUCCESS,
    COMPARISONS_REMOVE_FAIL,

    COMPARISONS_LIST_MY_REQUEST,
    COMPARISONS_LIST_MY_SUCCESS,
    COMPARISONS_LIST_MY_FAIL,
} from "../constants/comparisonsConstants";

export const addToComparisons = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMPARISONS_ADD_REQUEST
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

        const { data } = await axios.post(`/api/comparisons/add/${id}/`, id, config);

        dispatch({
            type: COMPARISONS_ADD_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: COMPARISONS_ADD_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const removeFromComparisons = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMPARISONS_REMOVE_REQUEST
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

        const { data } = await axios.delete(`/api/comparisons/remove/${id}/`, config);

        dispatch({
            type: COMPARISONS_REMOVE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: COMPARISONS_REMOVE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const listMyComparisons = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: COMPARISONS_LIST_MY_REQUEST
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

        const { data } = await axios.get(`/api/users/profile/comparisons`, config);

        dispatch({
            type: COMPARISONS_LIST_MY_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: COMPARISONS_LIST_MY_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}