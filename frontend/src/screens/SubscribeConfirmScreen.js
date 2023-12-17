import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { confirmSubscribe } from '../actions/subscriptionActions';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useParams } from 'react-router-dom';

const SubscribeConfirmScreen = () => {
  const dispatch = useDispatch();
  const { subscriber_id, token } = useParams();
  const subscribeConfirm = useSelector((state) => state.subscribeConfirm);
  const { loading, success, error, message } = subscribeConfirm;

  useEffect(() => {
    dispatch(confirmSubscribe(subscriber_id, token));
  }, [dispatch, subscriber_id, token]);

  return (
    <FormContainer>
        <h1>Subscription Confirmation</h1>
        {success && <Message variant="info">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
    </FormContainer>
  );
};

export default SubscribeConfirmScreen;
