import React from 'react';
import { API_BASE_URL } from '../config';
import toast from 'react-hot-toast';

const PaymentButton = ({ amount, onSuccess }) => {
    const handlePayment = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("Please login to buy points");
            return;
        }

        try {
            // 1. Create Order
            const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount })
            });

            if (!orderRes.ok) {
                const err = await orderRes.json(); // Expecting JSON error from backend usually, or text
                throw new Error(err.message || "Failed to create order");
            }

            const { orderId, keyId } = await orderRes.json();

            // 2. Open Razorpay
            const options = {
                key: keyId,
                amount: amount * 100,
                currency: "INR",
                name: "PeerGrid",
                description: "Purchase Grid Points",
                order_id: orderId,
                handler: async function (response) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch(`${API_BASE_URL}/payments/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                amount: amount
                            })
                        });

                        if (verifyRes.ok) {
                            const data = await verifyRes.json();
                            toast.success(`Success! Added ${data.pointsAdded} GP.`);
                            if (onSuccess) onSuccess();
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error("Error verifying payment");
                    }
                },
                prefill: {
                    name: "PeerGrid User",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (err) {
            console.error(err);
            toast.error(err.message || "Payment failed");
        }
    };

    return (
        <button onClick={handlePayment} className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" style={{ background: 'var(--accent-primary)', border: 'none' }}>
            Buy {amount * 10} GP for ₹{amount}
        </button>
    );
};

export default PaymentButton;
