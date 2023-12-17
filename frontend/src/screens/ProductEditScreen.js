import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import FormContainer from "../components/FormContainer";
import { listProductDetails, updateProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditScreen() {
    const { id } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [discounts, setDiscounts] = useState([]);

    const [uploading, setUploading] = useState(false);

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discountOptions, setDiscountOptions] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productDetails = useSelector(state => state.productDetails);
    const { error, loading, product } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate;

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || !userInfo.is_admin) {
            navigate('/login');
        } else {
            if (successUpdate) {
                dispatch({ type: PRODUCT_UPDATE_RESET });
                navigate('/admin/productlist');
            } else {
                if (!product.name || product.id !== Number(id)) {
                    dispatch(listProductDetails(id));
                } else {
                    setName(product.name);
                    setPrice(product.price);
                    setImage(product.image);
                    setBrand(product.brand ? product.brand : '');
                    setCategory(product.category ? product.category : '');
                    setCountInStock(product.count_in_stock);
                    setDescription(product.description);
                    setDiscounts(product.discounts.map(d => d.id));
                }
            }
        }

        fetchBrands();
        fetchCategories();
        fetchDiscountOptions();

    }, [dispatch, product, id, navigate, successUpdate, userInfo]);

    const fetchBrands = async () => {
        try {
            const { data } = await axios.get('/api/brands');
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

    const fetchDiscountOptions = async () => {
        try {
          const { data } = await axios.get('/api/discounts');
          setDiscountOptions(data);
        } catch (error) {
          console.log(error);
        }
      };

    const submitHandler = (e) => {
        e.preventDefault();

        const selectedBrand = brands.find((b) => b.id === parseInt(brand));
        const selectedCategory = categories.find((c) => c.id === parseInt(category));

        dispatch(updateProduct({
            id: product.id,
            name,
            price,
            image,
            brand: selectedBrand ? selectedBrand.id : null,
            category: selectedCategory ? selectedCategory.id : null,
            countInStock,
            description,
            discounts,
        }));
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();

        formData.append('image', file);
        formData.append('product_id', id);

        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                }
            };

            const { data } = await axios.post('/api/products/upload/', formData, config);

            setImage(data);
            setUploading(false);

        } catch (error) {
            setUploading(false);
        }
    }

    return (
        <div className='productedit-screen-row'>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type='name' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='brand'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control as="select" value={brand} onChange={(e) => setBrand(e.target.value)}>
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type='number' placeholder='Enter Price' value={price} onChange={(e) => setPrice(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control type='text' placeholder='Enter Image' value={image} onChange={(e) => setImage(e.target.value)}>
                            </Form.Control>

                            <Form.Control id='image-file' label='Choose File' type='file' custom onChange={uploadFileHandler}>

                            </Form.Control>
                            {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId='countinstock'>
                            <Form.Label>Stock</Form.Label>
                            <Form.Control type='number' placeholder='Enter Stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder='Enter Description' value={description} onChange={(e) => setDescription(e.target.value)} style={{ resize: 'none' }} />
                        </Form.Group>

                        <Form.Group controlId="discounts">
                            <Form.Label>Discounts</Form.Label>
                            {discountOptions.map((discount) => (
                                <Form.Check
                                key={discount.id}
                                type="checkbox"
                                label={discount.name}
                                value={discount.id}
                                checked={discounts.includes(discount.id)}
                                onChange={(e) => {
                                    const discountId = discount.id;
                                    setDiscounts((prevDiscounts) => {
                                    if (prevDiscounts.includes(discountId)) {
                                        return prevDiscounts.filter((id) => id !== discountId);
                                    } else {
                                        return [...prevDiscounts, discountId];
                                    }
                                    });
                                }}
                                />
                            ))}
                        </Form.Group>

                        <Button type='submit' variant='primary' className='btn-margin-top'>Save</Button>
                    </Form>
                )}

            </FormContainer>
        </div>
    )
}

export default ProductEditScreen;
