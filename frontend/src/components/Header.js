import React from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import SearchBox from './SearchBox';
import { logout } from '../actions/userActions';

function Header() {
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  };
  
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Link to="/" className="navbar-logo">
            <Navbar.Brand>ProDigital</Navbar.Brand>
          </Link>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="mr-auto">
              <Nav.Link>
                <Link to="/cart" className="nav-link" id="cart-block">
                  <i className="fas fa-shopping-cart"></i> Cart
                  {cartItems.length > 0 &&
                    <div class="cart-indicator">{cartItems.length}</div>
                  }                
                </Link>
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username' className="dd-menu">
                  <Nav.Link>
                    <Link className="nav-link">
                      <NavDropdown.Item onClick={() => navigate('/profile')}>Profile</NavDropdown.Item>
                    </Link>

                    <Link className="nav-link">
                      <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                    </Link>
                  </Nav.Link>
                </NavDropdown>
              ): (
                <Nav.Link>
                  <Link to="/login" className="nav-link">
                    <i className="fas fa-user"></i> Login
                  </Link>
                </Nav.Link>              
              )}

              {userInfo && userInfo.is_admin && (
                <NavDropdown title='Admin' id='adminmenu' className="dd-menu">
                  <Nav.Link>
                    <Link className="nav-link">
                      <NavDropdown.Item onClick={() => navigate('/admin/userlist')}>Users</NavDropdown.Item>
                    </Link>
                  </Nav.Link>

                  <Nav.Link>
                    <Link className="nav-link">
                      <NavDropdown.Item onClick={() => navigate('/admin/productlist')}>Products</NavDropdown.Item>
                    </Link>
                  </Nav.Link>

                  <Nav.Link>
                    <Link className="nav-link">
                      <NavDropdown.Item onClick={() => navigate('/admin/orderlist')}>Orders</NavDropdown.Item>
                    </Link>
                  </Nav.Link>
                </NavDropdown>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
