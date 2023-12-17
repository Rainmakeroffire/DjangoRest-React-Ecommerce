import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup } from "react-bootstrap";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import PaginateFiltered from "../components/PaginateFiltered";
import { listProducts } from "../actions/productActions";
import { useLocation } from 'react-router-dom';
import { advancedProductSearch } from '../actions/productActions';
import ProductFilter from '../components/ProductFilter';

function CatalogueScreen() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [showSearch, setShowSearch] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [query, setQuery] = useState(location.search || '');
  
  const productList = useSelector((state) => state.productList);
  const { error, loading, products, page, pages, pagination_range } = productList;

  let keyword = location.search;

  const productFiltered = useSelector((state) => state.productFiltered);
  const { error: errorFiltered, loading: loadingFiltered, products: productsFiltered, page: pageFiltered, pages: pagesFiltered, pagination_range: pagination_range_filtered } = productFiltered;

  const buildQuery = (filter) => {
    const searchParams = Object.entries(filter)
      .filter(([key, value]) => value !== '' && value !== false && value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${searchParams}`;
  };

  const handleFilter = (filter) => {
    const updatedQuery = buildQuery(filter);
    
    const isFilterEmpty =
      filter.name === "" &&
      filter.category === "" &&
      filter.brands === "" &&
      !filter.has_discounts &&
      !filter.in_stock &&
      filter.min_price === undefined &&
      filter.max_price === undefined &&
      filter.min_rating === undefined &&
      filter.max_rating === undefined &&
      filter.sort_option === "";

      if (isFilterEmpty) {
        setQuery('');
        setSearchFilter(filter);
      } else {
        setQuery(updatedQuery);
        setSearchFilter(filter);
        dispatch(advancedProductSearch(`?${updatedQuery}`));
        setIsFiltered(true);
      }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const updatedQuery = buildQuery(searchFilter);
    setQuery(updatedQuery);

    if (!isFiltered) {
      dispatch(listProducts(keyword));
    } else {
      dispatch(advancedProductSearch(`?${updatedQuery}${location.search && (location.search.match(/(?:\b|&)page=[^&]*/g) || []).pop() || ''}`));
    }
    
  }, [dispatch, query, location.search, keyword, isFiltered, searchFilter]);

  return (
    <div className="latest-products">
      <h1>Product catalogue</h1>

      <ListGroup variant='flush'>
        <a onClick={() => {setShowSearch(!showSearch);}} className="advanced-search-toggle">
          {showSearch ? 'Advanced Search' : 'Advanced Search'} <i className={showSearch ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
        </a>
        {showSearch && <ProductFilter onFilter={handleFilter} />}
        
        {loading || loadingFiltered ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : errorFiltered ? (
          <Message variant="danger">{errorFiltered}</Message>
        ) : !isFiltered ? (
          <div>
            {products.length === 0 ? (
              <Row className="justify-content-md-center nothing-found-message">
                <Col md={6}>
                  <Message variant="info">No items found. Update search parameters and try again</Message>
                </Col>
              </Row>
            ) : (
              <Row>
                {products.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            )}
            <Paginate page={page} pages={pages} keyword={keyword} pagination_range={pagination_range} baseURL={'catalogue'} />
          </div>
        ) : (
          <div>
            {productsFiltered.length === 0 ? (
              <Row className="justify-content-md-center nothing-found-message">
                <Col md={6}>
                  <Message variant="info">No items found. Update search parameters and try again</Message>
                </Col>
              </Row>
            ) : (
              <Row>
                {productsFiltered.map((product) => (
                  <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            )}
            <PaginateFiltered page={pageFiltered} pages={pagesFiltered} pagination_range={pagination_range_filtered} baseURL={'catalogue'} query={query}/>
          </div>
        )}
      </ListGroup>
    </div>
  );
}

export default CatalogueScreen;
