import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listMyFavorites, removeFromFavorites } from '../actions/favoritesActions';

function FavoritesScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const favoriteListMy = useSelector(state => state.favoriteListMy);
  const { loading: loadingFavorites, error: errorFavorites, favorites } = favoriteListMy;

  useEffect(() => {
      if (!userInfo) {
          navigate('/login');
      } else {
          dispatch(listMyFavorites());
      }
  }, [dispatch, navigate, userInfo]);

  const removeFromFavoritesHandler = (id) => {
    dispatch(removeFromFavorites(id));
    dispatch(listMyFavorites());
  };

  return (
    <Col md={12}>
      <h2>My Favorites</h2>
        {loadingFavorites ? (
          <Loader />
            ) : errorFavorites ? (
              <Message variant='danger'>{errorFavorites}</Message> 
            ) : favorites.length === 0 ? (
              <Message variant="info">
                You have no favorites
              </Message>
            ) : (
              <ListGroup variant='flush' className='favorites-list'>
                {favorites.map((favorite, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={2}>
                        <Link to={`/product/${favorite.product.id}`}>
                          <Image src={favorite.product.image} alt={favorite.product.name} fluid rounded />
                        </Link>
                      </Col>

                      <Col>
                        <Link to={`/product/${favorite.product.id}`}>{favorite.product.name}</Link>
                      </Col>

                      <Col md={2}>
                        ${favorite.product.discounted_price}
                      </Col>

                      <Col md={1}>
                        <Button
                          type="button"
                          variant="light"
                          onClick={() => removeFromFavoritesHandler(favorite.product.id)}
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
    </Col>
  )
}

export default FavoritesScreen