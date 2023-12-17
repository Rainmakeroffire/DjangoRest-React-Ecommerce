import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import Message from "./Message";
import { sendFeedback } from '../actions/feedbackActions';


function FeedbackSection() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [subjectsLoaded, setSubjectsLoaded] = useState(false);
    const [formErrors, setFormErrors] = useState([]);
    
    const dispatch = useDispatch();
    const feedbackSend = useSelector((state) => state.feedbackSend);
    const { loading, success, error, message } = feedbackSend;
  
    useEffect(() => {
        if (!subjectsLoaded) {
            fetchSubjects();
            setSubjectsLoaded(true);
        }

        if (success) {
            setName('');
            setEmail('');
            setSubject('');
            setUserMessage('');
        }
    }, [success])

    const validateForm = (arg) => {
        const errors = [];

        if (!name) {
            errors.push('Name');
        }

        if (!email) {
            errors.push('Email');
        }

        if (!arg) {
            errors.push('Subject');
        }

        if (!userMessage) {
            errors.push('Message');
        }

        setFormErrors(errors);
        const isValid = errors.length === 0;

        return { isValid, errors };
    };

    const submitHandler = (e) => {
      e.preventDefault();

      const selectedSubject = subjects.find((c) => c.id === parseInt(subject));
      const { isValid, errors } = validateForm(selectedSubject);

      if (!isValid) {
        console.error(`Form validation error. Missing fields: ${errors}`);
      } else {  
        dispatch(sendFeedback({
            name,
            email,
            subject: selectedSubject ? selectedSubject.id : null,
            userMessage,
        }));
      }
    };

    const fetchSubjects = async () => {
        try {
            const { data } = await axios.get('/api/subjects');
            setSubjects(data);
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='feedback-section' id='feedback-section'>
        <Row md={12}>
            <h1>Contact Us</h1>
        </Row>

        <Row md={12}>
            <Col md={6}>
                <div className='feedback-form-wrapper'>
                    {loading ? <Loader /> : (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type='text' placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)}>
                                </Form.Control>
                            </Form.Group>
                            
                            <Form.Group controlId='email'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='subject'>
                                <Form.Label>Subject</Form.Label>
                                <Form.Control as="select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId='userMessage'>
                                <Form.Label>Message</Form.Label>
                                <Form.Control as="textarea" rows={3} placeholder='Message' value={userMessage} onChange={(e) => setUserMessage(e.target.value)} style={{ resize: 'none' }} />
                            </Form.Group>

                            <Button type='submit' variant='primary' className='btn-margin-top'>Submit</Button>
                        </Form>
                    )}
                </div>
            </Col>  
                
            <Col md={6}>
                <div id="map">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2768.7305677875174!2d14.506452876306449!3d46.056472171089794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDbCsDAzJzIzLjMiTiAxNMKwMzAnMzIuNSJF!5e0!3m2!1sru!2s!4v1699206153237!5m2!1sru!2s" width="100%" height="100%" frameborder="0" allowfullscreen=""></iframe>
                </div>
            </Col>
        </Row>

        <Row>
            <Col md={6} className='feedback-form-message-slot'>
                {error && <Message variant='danger'>{error}</Message>}
                {success && <Message variant='success'>{message}</Message>}
                {formErrors.length > 0 && (
                        <Message variant='danger'>
                            Required fields are not filled in: {formErrors.join(', ')}
                        </Message>
                    )}
            </Col>
        </Row>
    </div>
  )
}

export default FeedbackSection