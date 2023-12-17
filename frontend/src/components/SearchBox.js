import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function SearchBox() {
  const [keyword, setKeyword] = useState('');
  let navigate = useNavigate();
  const location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
        navigate(`/catalogue/?keyword=${keyword}&page=1`);
    } else {
        navigate(location.pathname);
    }
  }

  return (
    <Form onSubmit={submitHandler} inline className='searchform'>
        <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} className='mr-sm-2 ml-sm-5 searchbar'>

        </Form.Control>

        <Button type='submit' variant='outline-success' className='p-2'>Search</Button>
    </Form>
  )
}

export default SearchBox