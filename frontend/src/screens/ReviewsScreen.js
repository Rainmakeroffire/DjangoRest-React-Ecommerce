import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listMyReviews, removeFromReviews } from '../actions/reviewsActions';

function ReviewsScreen() {
  const [showModal, setShowModal] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState(null);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const reviewListMy = useSelector(state => state.reviewListMy);
  const { loading: loadingReviews, error: errorReviews, reviews } = reviewListMy;

  useEffect(() => {
      if (!userInfo) {
          navigate('/login');
      } else {
          dispatch(listMyReviews());
      }
  }, [dispatch, navigate, userInfo]);

  const showDeleteModal = (id) => {
    setReviewIdToDelete(id);
    setShowModal(true);
  };

  const hideDeleteModal = () => {
    setReviewIdToDelete(null);
    setShowModal(false);
  };

  const removeFromReviewsHandler = (id) => {
    dispatch(removeFromReviews(id));
    hideDeleteModal();
    dispatch(listMyReviews());
  };

  function ConfirmationModal({ show, handleClose, handleDelete }) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  } 

  return (
    <Col md={12}>
      <h2>My Reviews</h2>
        {loadingReviews ? (
          <Loader />
            ) : errorReviews ? (
              <Message variant='danger'>{errorReviews}</Message> 
            ) : reviews.length === 0 ? (
              <Message variant="info">
                You have no reviews
              </Message>
            ) : (
              <ListGroup variant='flush' className='reviews-list'>
                {reviews.map((review, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={2}>
                        <Link to={`/product/${review.product.id}`}>
                          <Image src={review.product.image} alt={review.product.name} fluid rounded />
                        </Link>
                      </Col>

                      <Col>
                        {review.comment}
                      </Col>

                      <Col md={2}>
                        <Rating
                          value={review.rating}
                          color={"#f8e825"}
                          size='0.8rem'
                        />
                      </Col>

                      <Col md={1}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => showDeleteModal(review.product.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))} 
              </ListGroup>
            )
        }
      <ConfirmationModal show={showModal} handleClose={hideDeleteModal} handleDelete={() => removeFromReviewsHandler(reviewIdToDelete)} />
    </Col>
  )
}

export default ReviewsScreen