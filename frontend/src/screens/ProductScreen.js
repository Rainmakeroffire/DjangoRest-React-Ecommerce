import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate} from "react-router-dom";
import { Row, Col, Image, ListGroup, Button, Card, Form, Table, Modal } from "react-bootstrap";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listProductDetails, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';
import { addToFavorites, removeFromFavorites } from "../actions/favoritesActions";
import { FAVORITES_ADD_RESET, FAVORITES_REMOVE_RESET } from "../constants/favoritesConstants";
import { addToComparisons, removeFromComparisons } from "../actions/comparisonsActions";
import { COMPARISONS_ADD_RESET, COMPARISONS_REMOVE_RESET } from "../constants/comparisonsConstants";

function ProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  
  const characteristics = JSON.parse(product.characteristics || '{}');
  const [showSpecs, setShowSpecs] = useState(false);

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const favoriteAdd = useSelector((state) => state.favoriteAdd);
  const { success: successFavoriteAdd } = favoriteAdd;

  const comparisonAdd = useSelector((state) => state.comparisonAdd);
  const { success: successComparisonAdd, error: errorComparisonAdd } = comparisonAdd;

  const favoriteRemove = useSelector((state) => state.favoriteRemove);
  const { success: successFavoriteRemove } = favoriteRemove;

  const comparisonRemove = useSelector((state) => state.comparisonRemove);
  const { success: successComparisonRemove } = comparisonRemove;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { 
    loading: loadingProductReview, 
    error: errorProductReview, 
    success: successProductReview 
  } = productReviewCreate;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (successFavoriteAdd) {
      dispatch(listProductDetails(id, userInfo));
      dispatch({ type: FAVORITES_ADD_RESET });
    }

    if (successFavoriteRemove) {
      dispatch(listProductDetails(id, userInfo));
      dispatch({ type: FAVORITES_REMOVE_RESET });
    }

    if (successComparisonAdd) {
      dispatch(listProductDetails(id, userInfo));
      dispatch({ type: COMPARISONS_ADD_RESET });
    } else if (errorComparisonAdd === "You cannot add more than 4 items for comparison.") {
      setModalMessage(errorComparisonAdd);
      setShowModal(true);
      dispatch({ type: COMPARISONS_ADD_RESET });
    }

    if (successComparisonRemove) {
      dispatch(listProductDetails(id, userInfo));
      dispatch({ type: COMPARISONS_REMOVE_RESET });
    }
    
    if (successProductReview) {
      setRating(0);
      setComment('');
      dispatch(listProductDetails(id, userInfo));
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

    if (!initialLoad) {
      dispatch(listProductDetails(id, userInfo));
      setInitialLoad(true);
    }
    
  }, [dispatch, id, product, userInfo, successProductReview, successFavoriteAdd, successComparisonAdd, errorComparisonAdd, successFavoriteRemove, successComparisonRemove]);

  const addToCartHandler = () => {
    if (!isInCart(product.id)) {
      navigate(`/cart/${id}?qty=${qty}`);
    } else {
      navigate(`/cart`);
    }  
  }

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(createProductReview(id, { rating, comment }));
  }

  const addToFavoritesHandler = () => {
    if (!product.isInFavorites) {
      dispatch(addToFavorites(id));
    } else {
      dispatch(removeFromFavorites(id));
    }
  };

  const addToComparisonsHandler = () => {
    if (!product.isInComparisons) {
      dispatch(addToComparisons(id))
    } else {
      dispatch(removeFromComparisons(id));
    }
  };

  function NotificationModal({ show, handleClose }) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Limit Reached</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{modalMessage}</p>
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
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product === productId);
  };

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>

      <NotificationModal show={showModal} handleClose={handleCloseModal} />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row>
            <Col md={6} className="product-image">
              <Image src={product.image} alt={product.name} fluid />   
            </Col>

            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                  <div className="fav-comp-wrapper">
                    {userInfo && (
                      <>
                        <Link to="">
                          <svg
                            id="comp-icon"
                            className={product.isInComparisons ? 'comp-icon-clicked' : 'comp-icon'}
                            onClick={addToComparisonsHandler}
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 139 139"
                          >
                            <title>{!product.isInComparisons ? 'Add To Comparisons' : 'Remove From Comparisons'}</title>
                            <rect
                              height="80"
                              id="XMLID_1_"
                              width="80"
                              x="19.3"
                              y="39.7"
                              style={{
                                fill: 'none',
                                strokeWidth: 8,
                                strokeMiterlimit: 10,
                              }}
                            />
                            <polyline
                              id="XMLID_7_"
                              points="104.7,99.3 119.7,99.3 119.7,19.3 39.7,19.3 39.7,34.3"
                              style={{
                                fill: 'none',
                                strokeWidth: 8,
                                strokeMiterlimit: 10,
                              }}
                            />
                          </svg>
                        </Link>

                        <Link to="">
                          <svg
                            width="800px"
                            height="800px"
                            viewBox="0 0 24 24"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-labelledby="favouriteIconTitle"
                            stroke="#000000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            fill="none"
                            color="#000000"
                            id="fav-icon"
                            className={product.isInFavorites ? 'fav-icon-clicked' : 'fav-icon'}
                            onClick={addToFavoritesHandler}
                          >
                            <title id="favouriteIconTitle">{!product.isInFavorites ? 'Add To Favorites' : 'Remove From Favorites'}</title>
                            <path d="M12,21 L10.55,19.7051771 C5.4,15.1242507 2,12.1029973 2,8.39509537 C2,5.37384196 4.42,3 7.5,3 C9.24,3 10.91,3.79455041 12,5.05013624 C13.09,3.79455041 14.76,3 16.5,3 C19.58,3 22,5.37384196 22,8.39509537 C22,12.1029973 18.6,15.1242507 13.45,19.7149864 L12,21 Z" />
                          </svg>
                        </Link>
                      </>
                    )}
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.num_reviews} review${product.num_reviews !== 1 ? 's' : ''}`}
                    color={"#f8e825"}
                  />
                </ListGroup.Item>

                <ListGroup.Item>Price: ${product.discounted_price && product.discounted_price.toFixed(2)}</ListGroup.Item>

                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.discounted_price && product.discounted_price.toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Incl. Discount:</Col>
                      <Col>
                        <strong>
                        {(product.applied_discount ? Math.round(product.applied_discount?.ratio * 100) : 0)}%
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.count_in_stock > 0 ? "In Stock" : "Out of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.count_in_stock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Quantity:</Col>
                        <Col xs='auto' className="my-1">
                          <Form.Control as="select" value={qty} onChange={(e) => setQty(e.target.value)} disabled={isInCart(product.id)}>
                          {
                            [...Array(product.count_in_stock).keys()].map((x) => (
                              <option key={x+1} value={x+1}>
                                {x + 1}
                              </option>
                            ))
                          }
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className="btn-block"
                      disabled={product.count_in_stock == 0}
                      type="button"
                    >
                      {isInCart(product.id) ? 'Go To Cart' : 'Add To Cart'}
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="reviews-block">
            <Col md={6}>
              <h4>Reviews</h4>
              {product.reviews.length === 0 && <Message variant='info'>No Reviews</Message>}

              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review.id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color='#f8e825' />
                    <p>{review.created_at.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h4>Write a review</h4>

                  {loadingProductReview && <Loader />}
                  {successProductReview && <Message variant='success'>Review Submitted</Message>}
                  {errorProductReview && <Message variant='danger'>{errorProductReview}</Message>}

                  {userInfo ? (
                    <Form onSubmit={reviewSubmitHandler}>
                      <Form.Group controlId='rating'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)}>
                          <option value=''>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Not So Good</option>
                          <option value='3'>3 - Fair</option>
                          <option value='4'>4 - Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>

                      <Form.Group controlId='comment'>
                        <Form.Label>Review</Form.Label>
                        <Form.Control as='textarea' row='5' value={comment} onChange={(e) => setComment(e.target.value)} style={{ resize: 'none' }}>
                          
                        </Form.Control>
                      </Form.Group>

                      <Button disabled={loadingProductReview} type='submit' variant='primary' className="btn-margin-top">Submit</Button>
                    </Form>
                  ) : (
                    <Message variant='info'>Please <Link to='/login'>log in</Link> to write a review</Message>
                  )}
                </ListGroup.Item>        
              </ListGroup>
            </Col>

            <Col md={6} className="specifications">
              <h4>Specifications</h4>
              <a onClick={() => {setShowSpecs(!showSpecs);}}>
              {showSpecs ? 'Hide' : 'Show'} <i className={showSpecs ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
              </a>
              {showSpecs &&
              <Table striped responsive>
                <tbody>
                  {Object.entries(characteristics).map(([key, value]) => (
                    <tr key={key}>
                      <td>{key}:</td>
                      <td>
                      {typeof value === 'boolean'
                        ? value === true
                          ? 'Yes'
                          : 'No'
                        : value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              }
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductScreen;
