import React, { useState } from 'react';
import '../App.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        let tempErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.email) {
            tempErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = "Invalid email format";
        }
        if (!formData.subject) tempErrors.subject = "Subject is required";
        if (!formData.message) tempErrors.message = "Message is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log("Contact Form Submitted", formData);
            setSubmitted(true);
            // Here you would call the backend API
        }
    };

    return (
        <div className="container-fluid px-5 py-5">
            <h2 className="section-title mb-4">Contact Us</h2>
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="glass-card p-5">
                        {submitted ? (
                            <div className="text-center">
                                <h3 className="text-success mb-3">Message Sent!</h3>
                                <p className="text-muted">Thank you for reaching out. We'll get back to you shortly.</p>
                                <button className="btn btn-primary mt-3" onClick={() => setSubmitted(false)}>Send Another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                    {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-muted small text-uppercase fw-bold">Message</label>
                                    <textarea 
                                        name="message"
                                        rows="5"
                                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                                        value={formData.message}
                                        onChange={handleChange}
                                        style={{ color: 'var(--text-main)' }}
                                    ></textarea>
                                    {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold text-uppercase" style={{ background: 'var(--text-main)', color: 'var(--bg-primary)', border: 'none' }}>
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
