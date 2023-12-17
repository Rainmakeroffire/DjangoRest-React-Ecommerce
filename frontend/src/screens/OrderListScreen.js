import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { listOrders } from '../actions/orderActions'

function OrderListScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderList = useSelector(state => state.orderList)
  const {loading, error, orders, page, pages, pagination_range} = orderList

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin;

  let keyword = location.search;

  useEffect(() => {
    if (userInfo && userInfo.is_admin) {
        dispatch(listOrders(keyword));
    } else {
        navigate('/login');
    }
  }, [dispatch, navigate, userInfo, keyword]);

  return (
    <div>
        <h1>Orders</h1>
        {loading
        ? <Loader />
        : error
            ? <Message variant='danger'>{error}</Message>
            : (
               <Table striped hover responsive className='table-sm'>
                   <thead>
                        <tr>
                            <th>#</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                        </tr>
                   </thead>

                   <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{order.created_at.substring(0, 10)}</td>
                                <td>${order.total_price}</td>

                                <td>{order.is_paid ? (
                                   order.paid_at.substring(0, 10) 
                                ) : (
                                    <i className='fas fa-times' style={{ color: 'red'}}></i>
                                )}
                                </td>

                                <td>{order.is_delivered ? (
                                   order.delivered_at.substring(0, 10) 
                                ) : (
                                    <i className='fas fa-times' style={{ color: 'red'}}></i>
                                )}
                                </td>

                                <td>
                                    <LinkContainer to={`/order/${order.id}/`}>
                                        <Button className='btn-sm'>
                                            Details
                                        </Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))} 
                   </tbody>
               </Table> 
            )}
    <Paginate page={page} pages={pages} isAdmin={true} pagination_range={pagination_range} adminURL={'orderlist'} />
    </div>
  )
}

export default OrderListScreen