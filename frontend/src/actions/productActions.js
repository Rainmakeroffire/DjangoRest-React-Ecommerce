import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,

  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,

  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,

  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,

  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,

  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,

  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,

  PRODUCT_LATEST_REQUEST,
  PRODUCT_LATEST_SUCCESS,
  PRODUCT_LATEST_FAIL,

  PRODUCT_ADVANCED_SEARCH_REQUEST,
  PRODUCT_ADVANCED_SEARCH_SUCCESS,
  PRODUCT_ADVANCED_SEARCH_FAIL,
} from "../constants/productConstants";

export const listProducts = (keyword='') => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST });
    const { data } = await axios.get(`/api/products${keyword}`);
    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listProductDetails = (id, userInfo) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const config = userInfo
      ? {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      : {};

    const { data } = await axios.get(`/api/products/${id}`, config);

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_DELETE_REQUEST
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

      const { data } = await axios.delete(`/api/products/delete/${id}/`, config);

      dispatch({
          type: PRODUCT_DELETE_SUCCESS,
      });

  } catch(error) {
      dispatch({
          type: PRODUCT_DELETE_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
}

export const createProduct = () => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_CREATE_REQUEST
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

      const { data } = await axios.post(`/api/products/create/`, {}, config);

      dispatch({
          type: PRODUCT_CREATE_SUCCESS,
          payload: data
      });

  } catch(error) {
      dispatch({
          type: PRODUCT_CREATE_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_UPDATE_REQUEST
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

      const { data } = await axios.put(`/api/products/update/${product.id}/`, product, config);

      dispatch({
          type: PRODUCT_UPDATE_SUCCESS,
          payload: data
      });

      dispatch({
        type: PRODUCT_DETAILS_SUCCESS,
        payload: data
    });

  } catch(error) {
      dispatch({
          type: PRODUCT_UPDATE_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
}

export const createProductReview = (id, review) => async (dispatch, getState) => {
  try {
      dispatch({
          type: PRODUCT_CREATE_REVIEW_REQUEST
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

      const { data } = await axios.post(`/api/products/${id}/reviews/`, review, config);

      dispatch({
          type: PRODUCT_CREATE_REVIEW_SUCCESS,
          payload: data
      });

  } catch(error) {
      dispatch({
          type: PRODUCT_CREATE_REVIEW_FAIL,
          payload:
            error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
}

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST });

    const { data } = await axios.get(`/api/products/top/`);

    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data,
    });

  } catch (error) {
    
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const listLatestProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_LATEST_REQUEST });

    const { data } = await axios.get(`/api/products/latest/`);

    dispatch({
      type: PRODUCT_LATEST_SUCCESS,
      payload: data,
    });

  } catch (error) {
    
    dispatch({
      type: PRODUCT_LATEST_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const advancedProductSearch = (filter) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_ADVANCED_SEARCH_REQUEST });

    const { data } = await axios.get(`/api/products/advanced-search/${filter}`);
    dispatch({
      type: PRODUCT_ADVANCED_SEARCH_SUCCESS,
      payload: data,
      page: data.page,
      pages: data.pages,
      pagination_range: data.pagination_range,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_ADVANCED_SEARCH_FAIL,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};