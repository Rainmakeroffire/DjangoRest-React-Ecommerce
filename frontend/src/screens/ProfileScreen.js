import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { listMyOrders } from '../actions/orderActions';
import ProfileTabs from "../components/ProfileTabs";

function ProfileScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userDetails = useSelector(state => state.userDetails);
    const { error, loading, user } = userDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateProfile = useSelector(state => state.userUpdateProfile);
    const { success: updateSuccess, error: updateError } = userUpdateProfile;

    const orderListMy = useSelector(state => state.orderListMy);
    const { loading: loadingOrders, error: errorOrders, orders, page, pages, pagination_range } = orderListMy;

    let keyword = location.search;

    useEffect(() => {
        console.log(`Passwords match: ${password === confirmPassword}, updateSuccess: ${updateSuccess}, updateError: ${updateError}, message: ${message}`);
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(listMyOrders(keyword));
            if (updateSuccess) {
                setModalMessage('Profile data updated successfully');
                setShowModal(true);
            } else if (updateError) {
                setModalMessage(updateError);
                dispatch({ type: USER_UPDATE_PROFILE_RESET});
                setShowModal(true);
            }
            
            if (!user || !user.name || updateSuccess || userInfo.id !== user.id) {
                dispatch({ type: USER_UPDATE_PROFILE_RESET});
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders(keyword));
            } else {
                setName(user.name);
                setEmail(user.email);
            }
        }
    }, [dispatch, navigate, userInfo, user, updateSuccess, updateError, keyword]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != confirmPassword) {
            setMessage('Passwords do not match');
            setShowModal(true);
        } else {
            dispatch(updateUserProfile({
                'id': user.id,
                'name': name,
                'email': email,
                'password': password,
                'currentPassword': currentPassword,
            }));
            setMessage('');
        }
    };

    function NotificationModal({ show, handleClose }) {
        return (
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Profile Update</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modalMessage &&
                    <p>{modalMessage}</p>
                }

                {message &&
                    <p>{message}</p>
                }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        );
      }  
    
      const handleCloseModal = () => {
        setShowModal(false);
        setMessage('');
        setModalMessage('');
      };

    return (
        <Row className='profile-screen-row'>
            <NotificationModal show={showModal} handleClose={handleCloseModal} />
            <Col md={3}>
                <h2>User Profile</h2>
                {error && <Message variant='danger'>{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='currentPassword'>
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter Current Password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                    </Form.Group>


                    <Form.Group controlId='password'>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter New Password' value={password} onChange={(e) => setPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='passwordConfirm'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' placeholder='Confirm New Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary' className='btn-margin-top'>Update</Button>
                </Form>
            </Col>

            <Col md={9}>
                <h2>My Orders</h2>
                {loadingOrders ? (
                    <Loader />
                ) : errorOrders ? (
                   <Message variant='danger'>{errorOrders}</Message> 
                ) : (
                   <div className='profile-table'> 
                        <Table striped responsive className='table-sm'>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Delivered</th>
                                <th></th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}> 
                                    <td>{order.id}</td>
                                    <td>{order.created_at.substring(0, 10)}</td>
                                    <td>${order.total_price}</td>
                                    <td>{order.is_paid ? order.paid_at.substring(0, 10) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                    <td>{order.is_delivered ? order.delivered_at.substring(0, 10) : (<i className='fas fa-times' style={{color: 'red'}}></i>)}</td>
                                    <td>
                                        <LinkContainer to={`/order/${order.id}`}>
                                            <Button className='btn-sm'>Details</Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </Table> 
                   </div>
                )}
                <Paginate page={page} pages={pages} isAdmin={userInfo ? userInfo.is_admin : false} pagination_range={pagination_range} baseURL={'profile'} />
            </Col>

            <Col md={3}>
            </Col>

            <Col md={9} className="d-flex justify-content-center align-items-center profile-tabs">
                <Col md={9} className='tabs-section'>
                    <ProfileTabs />
                </Col>
            </Col>
        </Row>
  )
}

export default ProfileScreen