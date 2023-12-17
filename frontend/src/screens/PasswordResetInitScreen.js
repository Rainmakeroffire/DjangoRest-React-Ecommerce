import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { initPasswordReset } from '../actions/userActions';
import { PASSWORD_RESET_INIT_RESET } from '../constants/userConstants';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PasswordResetInitScreen = () => {
  const [email, setEmail] = useState('');
  const [buttonDisabled, setbuttonDisabled] = useState(false);
  const [message, setMessage] = useState('');
  const [successStatus, setSuccessStatus] = useState(false);
  const dispatch = useDispatch();

  const passwordResetInit = useSelector((state) => state.passwordResetInit);
  const { loading, success, error, message: messageSuccess } = passwordResetInit;

  useEffect(() => {
    if (success) {
      setSuccessStatus(true);
      setMessage(messageSuccess);
      setbuttonDisabled(true);
      dispatch({ type: PASSWORD_RESET_INIT_RESET });
    }
  }, [dispatch, success, messageSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(initPasswordReset(email));
  };

  return (
    <FormContainer>
        <h1>Reset Password</h1>
        {successStatus && <Message variant="success">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
            <Form.Group controlId="email">
                <Form.Label>Enter your email to reset password</Form.Label>
                <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
            </Form.Group>
            <Button type="submit" variant="primary" className="btn-margin-top" disabled={buttonDisabled}>
                Submit
            </Button>
        </Form>

        <Row className="py-3">
            <Col>
                <Link to="/login">Back to login page</Link>
            </Col>
        </Row>
    </FormContainer>
  );
};

export default PasswordResetInitScreen;
