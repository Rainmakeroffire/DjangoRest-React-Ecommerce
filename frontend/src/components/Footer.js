import React, { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, Nav, Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import ChatWidget from './ChatWidget';
import { useDispatch, useSelector } from "react-redux";
import { initiateSubscribe } from '../actions/subscriptionActions';
import { SUBSCRIBE_INITIATE_RESET } from '../constants/subscriptionConstants';

function Footer() {
  const dispatch = useDispatch();
  const subscribeInitiate = useSelector((state) => state.subscribeInitiate);
  const { error: errorSubscribe, success: successSubscribe, message: messageSubscribe } = subscribeInitiate;

  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (successSubscribe) {
      setModalMessage(messageSubscribe);
      setShowModal(true);
      dispatch({ type: SUBSCRIBE_INITIATE_RESET });
    }

    if (errorSubscribe) {
      setModalMessage(errorSubscribe);
      setShowModal(true);
      dispatch({ type: SUBSCRIBE_INITIATE_RESET });
    }
    
  }, [successSubscribe, errorSubscribe, messageSubscribe]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    dispatch(initiateSubscribe(email))
  };

  function NotificationModal({ show, handleClose }) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Subscription</Modal.Title>
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

  function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <footer className="footer">
      <NotificationModal show={showModal} handleClose={handleCloseModal} />

      <Navbar bg="dark" variant="dark" expand="lg" className="footer-main">

        <Container className="footer-container">
          <div className="text-center footer-media">
            <div className="sm-icons">
              <div className="icon-wrapper">
                <a href="#">
                  <svg width="34px" height="34px" xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="facebook">
                    <path d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z"></path>
                  </svg>
                </a>
              </div>

              <div className="icon-wrapper">
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="twitter"><path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z"></path>
                  </svg>
                </a>
              </div>

              <div className="icon-wrapper">
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="linkedin"><g><path d="M32 31.293V19.46c0-6.34-3.384-9.29-7.896-9.29-3.641 0-5.273 2.003-6.182 3.409v-2.924h-6.86c.091 1.937 0 20.637 0 20.637h6.86V19.767c0-.615.044-1.232.226-1.672.495-1.233 1.624-2.509 3.518-2.509 2.483 0 3.475 1.892 3.475 4.666v11.042H32zM3.792 7.838h.043c2.391 0 3.882-1.586 3.882-3.567C7.673 2.247 6.227.707 3.881.707S0 2.246 0 4.271c0 1.981 1.489 3.567 3.792 3.567zM.406 10.655h6.859v20.637H.406z"></path></g>
                  </svg>
                </a>
              </div>

              <div className="icon-wrapper">
                <a href="#">
                  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="youtube"><path d="M23,9.71a8.5,8.5,0,0,0-.91-4.13,2.92,2.92,0,0,0-1.72-1A78.36,78.36,0,0,0,12,4.27a78.45,78.45,0,0,0-8.34.3,2.87,2.87,0,0,0-1.46.74c-.9.83-1,2.25-1.1,3.45a48.29,48.29,0,0,0,0,6.48,9.55,9.55,0,0,0,.3,2,3.14,3.14,0,0,0,.71,1.36,2.86,2.86,0,0,0,1.49.78,45.18,45.18,0,0,0,6.5.33c3.5.05,6.57,0,10.2-.28a2.88,2.88,0,0,0,1.53-.78,2.49,2.49,0,0,0,.61-1,10.58,10.58,0,0,0,.52-3.4C23,13.69,23,10.31,23,9.71ZM9.74,14.85V8.66l5.92,3.11C14,12.69,11.81,13.73,9.74,14.85Z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="text-center footer-content">
            <div className="f-contacts f-card">
              <h4>Contact Us</h4>
              <Nav>
                <div className="navbar-nav nav-link">
                  <a href="#map" className="nav-link">
                    <div className="img-wrapper">     
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="32" viewBox="0 0 20 32" id="location-pin">
                        <path d="M10 0c-5.531 0-10 4.469-10 10s5 13 10 22c5-9 10-16.469 10-22s-4.469-10-10-10zM10 14c-2.219 0-4-1.781-4-4s1.781-4 4-4 4 1.781 4 4-1.781 4-4 4z" fill="#fff">
                        </path>
                      </svg>
                    </div> Pražakova ulica 15
                  </a>
                </div>   

                <Nav.Link>
                  <Link to="" className="nav-link">
                    <div className="img-wrapper">
                      <svg height="200px" width="200px" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#fff" id="phone">
                        <g>
                          <path d="M478.047,400.316c-19.356-18.424-81.443-56.049-97.112-61.134c-15.659-5.096-36.341,8.668-43.342,27.382 c-7.012,18.715-16.85,16.022-16.85,16.022s-37.242-17.472-101.504-93.726s-75.167-115.92-75.167-115.92s-0.984-10.16,18.662-13.898 c19.615-3.729,36.693-21.769,34.321-38.071c-2.34-16.301-28.904-83.876-43.776-106.06C138.377-7.262,105.153,0.61,97.593,5.146 c-7.571,4.536-86.756,45.692-71.842,135.492c14.934,89.801,57.26,164.294,105.904,222.022 c48.644,57.726,114.884,112.087,200.863,142.018c85.958,29.93,139.956-41.136,145.704-47.826 C483.971,450.172,497.361,418.761,478.047,400.316z" fill="#fff" />
                        </g>
                      </svg>
                    </div> +386 070-386-304
                  </Link>
                </Nav.Link>

                <Nav.Link>
                  <Link to="" className="nav-link">
                    <div className="img-wrapper">
                    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="envelope">
                      <path d="M1.60175 4.20114C2.14997 3.47258 3.02158 3 4 3H20C20.9784 3 21.85 3.47258 22.3982 4.20113L12 11.7635L1.60175 4.20114Z" fill="#fff"/>
                      <path d="M1 6.2365V18C1 19.6523 2.34772 21 4 21H20C21.6523 21 23 19.6523 23 18V6.23649L13.1763 13.381C12.475 13.891 11.525 13.891 10.8237 13.381L1 6.2365Z" fill="#fff"/>
                    </svg>

                    </div> info@prodigital.com
                  </Link>
                </Nav.Link>
              </Nav>
            </div>

            <div className="f-navigation f-card">
              <h4>Navigation</h4>
              <Nav>
                <Nav.Link>
                  <Link to="" className="nav-link" onClick={() => scrollToSection('delivery-section')}>
                    delivery
                  </Link>
                </Nav.Link>

                <Nav.Link>
                  <Link to="" className="nav-link" onClick={() => scrollToSection('testimonials-section')}>
                    testimonials
                  </Link>
                </Nav.Link>

                <Nav.Link>
                  <Link to="" className="nav-link" onClick={() => scrollToSection('feedback-section')}>
                    feedback
                  </Link>
                </Nav.Link>
              </Nav>
            </div>
            
            <div className="f-newsletter f-card">
              <h4>newsletter</h4>
              <div className="f-newsletter-wrapper">
                <Form inline className="newsletter-form" onSubmit={handleSubscribe}>
                  <Form.Control 
                    type='email' 
                    placeholder="Enter your email" 
                    className="newsletter-textbar"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button type='submit' variant='outline-secondary' className='p-2'>Subscribe</Button>
                </Form>
              </div>
            </div>
          </div>
        </Container>
      </Navbar>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; ProDigital</Col>
        </Row>
      </Container>
      <ChatWidget />
    </footer>
  );
}

export default Footer;
