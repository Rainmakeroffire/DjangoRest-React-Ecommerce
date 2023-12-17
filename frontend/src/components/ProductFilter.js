import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, ListGroup, Row, Col } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function ProductFilter({ onFilter }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [hasDiscounts, setHasDiscounts] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);

  const brandIds = selectedBrands.join(',');

  useEffect(() => {
    if (!categoriesLoaded) {
      fetchCategories();
      setCategoriesLoaded(true);
    }

    if (category) {
      fetchBrandsByCategory(category);
    } else {
      setBrands([]);
    }

    setSelectedBrands([]);
}, [category]);

const fetchBrandsByCategory = async (category_id) => {
  try {
      const { data } = await axios.get(`/api/get-brands-by-category/${category_id}/`);
      setBrands(data);
  } catch (error) {
      console.log(error);
  }
};

const fetchCategories = async () => {
    try {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
    } catch (error) {
        console.log(error);
    }
};

  const handleFilter = () => {
    const filter = {
      name: name,
      category: category,
      brands: brandIds,
      has_discounts: hasDiscounts,
      in_stock: inStock,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      min_rating: minRating || undefined,
      max_rating: maxRating || undefined,
      sort_option: sortOption,
    };

    onFilter(filter);
  };

  const handleBrandChange = (brandId) => {
    const updatedSelectedBrands = [...selectedBrands];
    const brandIndex = updatedSelectedBrands.indexOf(brandId);
  
    if (brandIndex === -1) {
      updatedSelectedBrands.push(brandId);
    } else {
      updatedSelectedBrands.splice(brandIndex, 1);
    }
    setSelectedBrands(updatedSelectedBrands);
  };

  const handleClear = () => {
    setName('');
    setCategory('');
    setSelectedBrands([]);
    setHasDiscounts(false);
    setInStock(false);
    setMinPrice('');
    setMaxPrice('');
    setMinRating('');
    setMaxRating('');
    setSortOption('');
  };

  const validateNumericInput = (input, minValue, maxValue, decimalPlaces) => {
    if (input === '') {
      return input;
    }
  
    const numericValue = parseFloat(input.replace(/[^0-9.]/g, ''));
  
    if (!isNaN(numericValue)) {
      const roundedValue = parseFloat(numericValue.toFixed(decimalPlaces));
      const clampedValue = Math.min(maxValue, Math.max(minValue, roundedValue));
      return clampedValue.toString();
    } else {
      return '';
    }
  };
  
  return (
    <ListGroup.Item>
      <Form className='advanced-search-form'>
        <Row className='justify-content-md-center'>
          <Col md={6}>
            <Form.Control
              className='advanced-search-serachbar'
              type="text"
              placeholder="Enter product name, brand or description"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Button variant="primary" onClick={handleFilter} className='advanced-search-btn-main'>
              Search
            </Button>

            <Form.Check
              type="checkbox"
              label="Has Discounts"
              checked={hasDiscounts}
              onChange={(e) => setHasDiscounts(e.target.checked)}
              className='advanced-search-inline-checkbox'
            />

            <Form.Check
              type="checkbox"
              label="In Stock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className='advanced-search-inline-checkbox'
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Select Sorting Option</option>
              <option value="price_low_to_high">Price (Low to High)</option>
              <option value="price_high_to_low">Price (High to Low)</option>
              <option value="rating_low_to_high">Rating (Low to High)</option>
              <option value="rating_high_to_low">Rating (High to Low)</option>
            </Form.Control>
          </Col>

          <Col>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </Form.Control>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Label>Price Range</Form.Label>      
            <div className='advanced-search-min-max-group'>
              <Form.Control
                className='advanced-search-min-max-field'
                type="text"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(validateNumericInput(e.target.value, 0, 10000, 2))}
              />
              <Form.Control
                className='advanced-search-min-max-field'
                type="text"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(validateNumericInput(e.target.value, 0, 10000, 2))}
              />
            </div>
            
            <div className='advanced-search-min-max-group'>
              <Slider
                min={0}
                max={10000}
                step={100}
                value={minPrice === '' ? undefined : parseFloat(minPrice)}
                onChange={(value) => setMinPrice(value.toString())}     
              />
              
              <Slider
                min={0}
                max={10000}
                step={100}
                value={maxPrice === '' ? undefined : parseFloat(maxPrice)}
                onChange={(value) => setMaxPrice(value.toString())}     
              />
            </div>
          </Col>

          <Col>
            <Form.Label>Rating</Form.Label>
            <div className='advanced-search-min-max-group'>
              <Form.Control
                className='advanced-search-min-max-field'
                type="text"
                placeholder="Min Rating"
                value={minRating}
                onChange={(e) => setMinRating(validateNumericInput(e.target.value, 1, 5, 1))}
              />

              <Form.Control
                className='advanced-search-min-max-field'
                type="text"
                placeholder="Max Rating"
                value={maxRating}
                onChange={(e) => setMaxRating(validateNumericInput(e.target.value, 1, 5, 1))}
              />
            </div>

            <div className='advanced-search-min-max-group'>
              <Slider
                min={1}
                max={5}
                step={0.1}
                value={minRating === '' ? undefined : parseFloat(minRating)}
                onChange={(value) => setMinRating(value.toString())}     
              />

            <Slider
              min={1}
              max={5}
              step={0.1}
              value={maxRating === '' ? undefined : parseFloat(maxRating)}
              onChange={(value) => setMaxRating(value.toString())}     
            />
            </div>       
          </Col>
        </Row>

        <Row className='advanced-search-last-row'>
          <Col>
            <Button variant='outline-secondary' onClick={handleClear}>
              Clear
            </Button>
          </Col>

          <Col>
            <p>Brands:</p>
            {brands &&
              brands.map((brand) => (
                <Form.Check
                  type="checkbox"
                  label={brand.name}
                  key={brand.id}
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandChange(brand.id)}
                />
              ))}
          </Col>
        </Row>
      </Form>
    </ListGroup.Item>
  );
}

export default ProductFilter;
