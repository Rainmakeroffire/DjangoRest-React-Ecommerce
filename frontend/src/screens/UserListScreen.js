import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import { listUsers, deleteUser } from '../actions/userActions'

function UserListScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userList = useSelector(state => state.userList)
  const {loading, error, users, page, pages, pagination_range} = userList

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin;

  const userDelete = useSelector(state => state.userDelete)
  const { success: successDelete } = userDelete;

  let keyword = location.search;

  useEffect(() => {
    if (userInfo && userInfo.is_admin) {
        dispatch(listUsers(keyword));
    } else {
        navigate('/login');
    }
  }, [dispatch, navigate, successDelete, userInfo, keyword]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
        dispatch(deleteUser(id));
    }
  }

  return (
    <div>
        <h1>Users</h1>
        {loading
        ? <Loader />
        : error
            ? <Message variant='danger'>{error}</Message>
            : (
               <Table striped hover responsive className='table-sm'>
                   <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                   </thead>

                   <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.is_admin ? (
                                    <i className='fas fa-check' style={{ color: 'green'}}></i>
                                ) : (
                                    <i className='fas fa-times' style={{ color: 'red'}}></i>
                                )}</td>

                                <td>
                                    <LinkContainer to={`/admin/user/${user.id}/edit`}>
                                        <Button variant='light' className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>

                                    <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(user.id)}>
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                            </tr>
                        ))} 
                   </tbody>
               </Table> 
            )}
        <Paginate page={page} pages={pages} isAdmin={true} pagination_range={pagination_range} adminURL={'userlist'} />
    </div>
  )
}

export default UserListScreen