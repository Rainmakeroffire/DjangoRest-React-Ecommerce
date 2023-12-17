import axios from "axios";
import {
    FAVORITES_ADD_REQUEST,
    FAVORITES_ADD_SUCCESS,
    FAVORITES_ADD_FAIL,

    FAVORITES_REMOVE_REQUEST,
    FAVORITES_REMOVE_SUCCESS,
    FAVORITES_REMOVE_FAIL,

    FAVORITES_LIST_MY_REQUEST,
    FAVORITES_LIST_MY_SUCCESS,
    FAVORITES_LIST_MY_FAIL,
} from "../constants/favoritesConstants";

export const addToFavorites = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: FAVORITES_ADD_REQUEST
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

        const { data } = await axios.post(`/api/favorites/add/${id}/`, id, config);

        dispatch({
            type: FAVORITES_ADD_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: FAVORITES_ADD_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const removeFromFavorites = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: FAVORITES_REMOVE_REQUEST
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

        const { data } = await axios.delete(`/api/favorites/remove/${id}/`, config);

        dispatch({
            type: FAVORITES_REMOVE_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: FAVORITES_REMOVE_FAIL,
            payload:
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message,
        });
    }
};

export const listMyFavorites = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: FAVORITES_LIST_MY_REQUEST
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

        const { data } = await axios.get(`/api/users/profile/favorites`, config);

        dispatch({
            type: FAVORITES_LIST_MY_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: FAVORITES_LIST_MY_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}