import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { confirmPasswordReset } from '../actions/userActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const PasswordResetConfirmScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { uidb64, token } = useParams();

  const dispatch = useDispatch();
  
  const passwordResetConfirm = useSelector((state) => state.passwordResetConfirm);
  const { loading, success, error: errorConfirm, message } = passwordResetConfirm;

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
    } else {
        dispatch(confirmPasswordReset(password, uidb64, token));
    }
  };

  return (
    <FormContainer>
        <h1>Password Reset Confirmation</h1>
        {success && <Message variant="info">{message}</Message>}
        {!error && errorConfirm && <Message variant="danger">{errorConfirm}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form onSubmit={handleConfirmReset}>
            <Form.Group controlId="password">
                <Form.Label>Enter new password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm new password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </Form.Group>

            <Button type="submit" variant="primary" className="btn-margin-top" disabled={success}>
                Confirm
            </Button>
        </Form>

        {success &&
            <Row className="py-3">
                <Col>
                    <Link to="/login">Back to the login page</Link>
                </Col>
            </Row>
        }
    </FormContainer>
  );
};

export default PasswordResetConfirmScreen;
