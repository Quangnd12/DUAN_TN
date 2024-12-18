import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Payment, addPayment } from 'services/payment';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from 'Admin/src/components/LoadingSpinner';
import { RenewPayment } from 'services/payment';
import { getPaymentByUser } from 'services/payment';


const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [payment, setPayments] = useState([]);
    const amount = 1;
    const { user } = useSelector((state) => state.auth);

    const getPayment = async () => {
        try {
            if (user) {
                const data = await getPaymentByUser();
                setPayments(data || []);
            }
        } catch (error) {
            console.error("Error fetching payment data", error);
            setPayments([]);
        }
    };

    useEffect(() => {
        if (user) {
            getPayment();
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        const cardElement = elements.getElement(CardElement);
        const bill = { email: user.email };

        try {
            if (paymentMethod === "visa") {
                const { clientSecret } = await Payment({ amount, bill });

                const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: bill,
                    },
                });

                if (error) {
                    console.log('Payment failed: ', error.message);
                    setPaymentSuccess(false);
                } else {
                    console.log('Payment intent:', paymentIntent);
                    if (paymentIntent.status === 'succeeded') {
                        if (payment.is_notified === 1) {
                            await RenewPayment();
                        }

                        await addPayment({ amount });
                        getPayment();
                        setPaymentSuccess(true);
                    } else {
                        console.log('Payment status:', paymentIntent.status);
                    }
                }
            }
        } catch (err) {
            console.error("Error processing payment:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (paymentSuccess) {
            const timer = setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 3000);
    
            return () => clearTimeout(timer);
        }
    }, [paymentSuccess, navigate]);    

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center">
                <img src="/images/success.gif" className="w-[300px]" />
                <p className="text-[24px] font-bold text-white">Successful payment</p>
            </div>
        )
    }

    return (
        <div className="checkout-container bg-white to-pink-500 text-white rounded-lg w-[600px]">
            <LoadingSpinner isLoading={loading} />
            <div className="payment-methods flex flex-col space-y-4 mb-6">
                <p>Please choose payment method</p>
                <label className="items-center space-x-4">
                    <input
                        type="radio"
                        checked={paymentMethod === 'visa'}
                        onChange={() => setPaymentMethod(paymentMethod === 'visa' ? null : 'visa')}
                        className="w-3 h-3"
                    />
                    <span className="text-black text-lg">Credit or debit card</span>
                    <div className='flex mt-2'>
                        <img src='/images/visa.webp' className='w-[55px]  border-2 border-gray-300 p-2 mr-2' />
                        <img src='/images/masterCard.png' className='w-[45px]  border-2 border-gray-300 p-2 mr-2' />
                        <img src='/images/american.png' className='w-[35px] mr-2' />
                        <img src='/images/jcb.png' className='w-[40px]' />
                    </div>

                </label>
            </div>
            {paymentMethod === 'visa' && (
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="stripe-card-element mb-6">
                        <CardElement className="p-4 border rounded-md bg-white" />
                    </div>
                    <button
                        type="submit"
                        disabled={!stripe}
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-green-700 transition"
                    >
                        Pay immediately
                    </button>
                </form>
            )}
            {paymentMethod === 'paypal' && (
                <div className="paypal-info mt-6 text-center">
                    <p className="text-sm text-gray-200">Redirect to paypal for payment</p>
                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                    >
                        Payment via Paypal
                    </button>
                </div>
            )}
        </div>
    );
};

export default CheckoutForm;
