import axios from 'axios';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,

    USER_LOGOUT,

    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,

    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    USER_DETAILS_RESET,

    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,

    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,

    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,

    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,

    PASSWORD_RESET_INIT_REQUEST,
    PASSWORD_RESET_INIT_SUCCESS,
    PASSWORD_RESET_INIT_FAIL,

    PASSWORD_RESET_CONFIRM_REQUEST,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
} from '../constants/userConstants';
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        });

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        const { data } = await axios.post('/api/users/login/', { 'username': email, 'password': password }, config);

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch(error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    dispatch({ type: ORDER_LIST_MY_RESET });
    dispatch({ type: USER_LIST_RESET });
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        });

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };

        const { data } = await axios.post('/api/users/register/', { 'name': name, 'email': email, 'password': password }, config);

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch(error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const getUserDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DETAILS_REQUEST
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

        const { data } = await axios.get(`/api/users/${id}/`, config);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
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

        const { data } = await axios.put(`/api/users/profile/update/`, user, config);

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        });

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

    } catch(error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const listUsers = (keyword='') => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST
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

        const { data } = await axios.get(`/api/users${keyword}`, config);

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
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

        const { data } = await axios.delete(`/api/users/delete/${id}`, config);

        dispatch({
            type: USER_DELETE_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const udpateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
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

        const { data } = await axios.put(`/api/users/update/${user.id}/`, user, config);

        dispatch({
            type: USER_UPDATE_SUCCESS,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));

        if (user.id === userInfo.id) {
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: data
            });
        }

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data
        });

    } catch(error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload:
              error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        });
    }
}

export const initPasswordReset = (email) => async (dispatch) => {
    try {
      dispatch({ 
        type: PASSWORD_RESET_INIT_REQUEST 
    });
  
      const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    const { data } = await axios.post('/api/password_reset/', { email: email }, config);
  
      dispatch({
        type: PASSWORD_RESET_INIT_SUCCESS,
        payload: data.message,
      });
    } catch (error) {
      dispatch({
        type: PASSWORD_RESET_INIT_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

  export const confirmPasswordReset = (password, uidb64, token) => async (dispatch) => {
    try {
      dispatch({ 
        type: PASSWORD_RESET_CONFIRM_REQUEST 
    });
  
      const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };

    const { data } = await axios.post(`/api/reset/${uidb64}/${token}/`, { password, uidb64, token }, config);
  
      dispatch({
        type: PASSWORD_RESET_CONFIRM_SUCCESS,
        payload: data.message,
      });
    } catch (error) {
      dispatch({
        type: PASSWORD_RESET_CONFIRM_FAIL,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };
