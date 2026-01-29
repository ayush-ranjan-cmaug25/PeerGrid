import React, { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import { adminService } from '../../services/adminService';

const RatingsView = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const data = await adminService.getFeedbacks();
            const formattedRatings = data.map(f => {
                const isFromLearner = f.session && f.session.learnerId === f.fromUserId;
                const fromName = isFromLearner ? f.session.learner?.name : f.session.tutor?.name;
                const toName = isFromLearner ? f.session.tutor?.name : f.session.learner?.name;

                return {
                    id: f.id,
                    from: fromName || 'Unknown',
                    to: toName || 'Unknown',
                    rating: f.rating,
                    comment: f.comment,
                    date: f.session ? new Date(f.session.endTime).toLocaleDateString() : 'N/A',
                    session: f.session ? f.session.title : 'Unknown Session'
                };
            });
            setRatings(formattedRatings);
        } catch (error) {
            console.error("Error fetching feedbacks", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-5 text-center">Loading ratings...</div>;

    return (
        <div className="container-fluid p-0">


            <ScrollReveal>
                <div className="glass-card p-4">
                    {ratings.length === 0 ? (
                        <p className="text-muted">No ratings found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table custom-table align-middle">
                                <thead>
                                    <tr className="text-muted small text-uppercase">
                                        <th>From / To</th>
                                        <th>Session</th>
                                        <th>Rating</th>
                                        <th>Comment</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ratings.map(rating => (
                                        <tr key={rating.id}>
                                            <td>
                                                <div className="d-flex flex-column small">
                                                    <span><span className="text-muted">From:</span> {rating.from}</span>
                                                    <span><span className="text-muted">To:</span> {rating.to}</span>
                                                </div>
                                            </td>
                                            <td className="fw-bold">{rating.session}</td>
                                            <td>
                                                <div className="text-warning">
                                                    {[...Array(5)].map((_, i) => (
                                                        <i key={i} className={`bi ${i < rating.rating ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-muted fst-italic">"{rating.comment}"</td>
                                            <td className="small text-muted">{rating.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </ScrollReveal>
        </div>
    );
};

export default RatingsView;
