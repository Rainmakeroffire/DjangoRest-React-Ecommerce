import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductCarousel from '../components/ProductCarousel';
import DeliverySection from '../components/DeliverySection';
import Testimonials from '../components/Testimonials';
import FeedbackSection from '../components/FeedbackSection';
import { listLatestProducts } from "../actions/productActions";

function HomeScreen() {
  const dispatch = useDispatch();
  const productLatest = useSelector((state) => state.productLatest);
  const { error, loading, products } = productLatest;

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(listLatestProducts());
  }, [dispatch]);

  return (
    <div className="latest-products">
      <ProductCarousel />

      <ListGroup variant='flush'>
        <ListGroup.Item>
          <h1>Latest Products</h1>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <div>
              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              
            </div>
          )}
          <Link to='/catalogue' className="btn btn-light my-3 latest-products-link">
            View Full Catalogue
          </Link>
        </ListGroup.Item>
      
        <ListGroup.Item>
          <DeliverySection />
        </ListGroup.Item>
          
        <ListGroup.Item>
          <Testimonials />
        </ListGroup.Item>

        <ListGroup.Item>
          <FeedbackSection />
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default HomeScreen;
