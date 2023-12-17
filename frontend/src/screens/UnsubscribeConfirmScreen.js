import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { confirmUnsubscribe } from '../actions/subscriptionActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';

const UnsubscribeConfirmScreen = () => {
  const dispatch = useDispatch();
  const { subscriber_id, token } = useParams();
  const unsubscribeConfirm = useSelector((state) => state.unsubscribeConfirm);
  const { loading, success, error, message } = unsubscribeConfirm;

  useEffect(() => {
    dispatch(confirmUnsubscribe(subscriber_id, token));
  }, [dispatch, subscriber_id, token]);

  return (
    <FormContainer>
        <h1>Unsubscription Confirmation</h1>
        {success && <Message variant="info">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
    </FormContainer>
  );
};

export default UnsubscribeConfirmScreen;
