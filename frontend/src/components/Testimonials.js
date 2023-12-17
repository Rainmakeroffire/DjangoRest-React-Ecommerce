import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Carousel, Image, Row } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTestimonials } from '../actions/testimonialsActions';

function Testimonials() {
  const dispatch = useDispatch();

  const testimonialsList = useSelector(state => state.testimonialsList);
  const { error, loading, testimonials } = testimonialsList;
  
  useEffect(() => {
    dispatch(listTestimonials());
  }, [dispatch])

  return (
    <Row className='testimonials-section' id='testimonials-section'>
        <h1>Testimonials</h1>

        {loading ? <Loader /> :
        error ? <Message variant='danger'>{error}</Message> :
        (
            <Carousel interval={null} className='testimonials-slider'>
            {testimonials.map((testimonial) => (
                <Carousel.Item key={testimonial.id}>
                    <div className='box'>
                        <div className='img-box'>
                            <Image src={testimonial.image} alt='' fluid />
                        </div>

                        <div className='detail-box'>
                            <div className='client-info'>
                                <div className='client-name'>
                                    <h4>{testimonial.name}</h4>
                                    <h6>{testimonial.role}</h6>
                                </div>
                                
                                <i class="fa fa-quote-left" aria-hidden="true" style={{'font-size': '1.5rem'}}></i>
                            </div>

                            <p>{testimonial.text}</p>
                        </div> 
                    </div>
                </Carousel.Item>
            ))} 
            </Carousel>
        )}
    </Row>
  )
}

export default Testimonials