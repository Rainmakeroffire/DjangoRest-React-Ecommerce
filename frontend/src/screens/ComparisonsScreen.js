import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Col, Table, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listMyComparisons, removeFromComparisons } from '../actions/comparisonsActions';

function ComparisonsScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const comparisonListMy = useSelector(state => state.comparisonListMy);
  const { loading: loadingComparisons, error: errorComparisons, comparisons } = comparisonListMy;

  useEffect(() => {
      if (!userInfo) {
          navigate('/login');
      } else {
          dispatch(listMyComparisons());
      }
  }, [dispatch, navigate, userInfo]);

  const removeFromComparisonsHandler = (id) => {
    dispatch(removeFromComparisons(id));
    dispatch(listMyComparisons());
  };

  function getCommonKeys(comparisons) {
    if (!comparisons || comparisons.length === 0) {
      return [];
    }
  
    const firstProductKeys = Object.keys(JSON.parse(comparisons[0]?.product.characteristics || '{}'));
    
    return firstProductKeys.filter((key) =>
      comparisons.every((comparison) => {
        const productCharacteristics = JSON.parse(comparison.product.characteristics || '{}');
        return productCharacteristics.hasOwnProperty(key);
      })
    );
  }
  
  const commonKeys = getCommonKeys(comparisons);
  
  const matchingCharacteristics = commonKeys.map((key) => (
    <tr key={key}>
      <td>{key}</td>
      {comparisons.map((comparison, index) => (
        <td key={index}>
          {JSON.parse(comparison.product.characteristics || '{}')[key] || 'N/A'}
        </td>
      ))}
    </tr>
  ));  

  return (
    <Col md={12}>
      <h2>My Comparisons</h2>
        {loadingComparisons ? (
          <Loader />
            ) : errorComparisons ? (
              <Message variant='danger'>{errorComparisons}</Message> 
            ) : comparisons.length === 0 ? (
              <Message variant="info">
                No items to compare
              </Message>
            ) : (
                <Table striped responsive className='table-sm'>
                    <thead>
                            <tr>
                                <th></th>
                                {comparisons.map((comparison) => (
                                    <th>
                                        <Link to={`/product/${comparison.product.id}`}>
                                          <Image src={comparison.product.image} alt={comparison.product.name} fluid rounded />
                                          <p 
                                            className='comparison-product-name' 
                                            style={{
                                              minHeight: `${comparisons.length === 4 ? 6 : comparisons.length === 3 ? 4 : comparisons.length === 2 ? 3 : 1}rem`
                                            }}
                                          > 
                                            {comparison.product.name.slice(0, 35)}
                                          </p>
                                        </Link>
                                        
                                        <Button
                                            type="button"
                                            onClick={() => removeFromComparisonsHandler(comparison.product.id)}
                                            >
                                            Remove
                                        </Button>
                                    </th>
                                ))}
                            </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Category</td>                  
                            {comparisons.map((comparison) => (
                                <td>{comparison.product.category.name}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>Brand</td>                  
                            {comparisons.map((comparison) => (
                                <td>{comparison.product.brand.name}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>Price</td>                  
                            {comparisons.map((comparison) => (
                                <td>${comparison.product.discounted_price}</td>
                            ))}
                        </tr>

                        <tr>
                            <td>Rating</td>                  
                            {comparisons.map((comparison) => (
                                <td>
                                    <Rating
                                        value={comparison.product.rating}
                                        color={"#f8e825"}
                                        size='0.8rem'
                                    />
                                </td>
                            ))}
                        </tr>

                        {matchingCharacteristics}
                    </tbody>
                </Table>
            )
        }
    </Col>
  )
}

export default ComparisonsScreen