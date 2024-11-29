import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './components/checkout';
import "../../assets/css/pay/pay.css"

const stripePromise = loadStripe("pk_test_51QPML9EbjmIVdlryyRluYg8rNv9j89jRlMRUyzgcWooxwLzKUoUWlsOaMeMMaB5FcySS1jtudQhPgza6fHextIiW00VpgqKgJ8"); 

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default PaymentPage;
