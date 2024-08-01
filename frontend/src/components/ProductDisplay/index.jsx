import {API_URL} from '../../config/index'
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51OxblLHXdx6cDJJLGuByYwy3sLXxaiYxLY1mKwoqFYXbG1kHjsMqM8l85ZWRwJfR4BWsxvj6GTadZ1QItlerIMAN00BQEoQJMN');

export default function ProductDisplay({numberNights, price, startDate,endDate,appUserId}) {

  const handleSubmit = async (event) => {
    event.preventDefault();

    const stripe = await stripePromise;

    const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numberNights,
        startDate,
        endDate,
        appUserId,
      }),
    });

    const session = await response.json();

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div>
    <div className="product">
      <div className="description">
      <h5>{numberNights} Nights • ${price}</h5>
      </div>
    </div>
    <form onSubmit={handleSubmit}>
      <button type="submit" className="btn btn-primary my-3">
        Checkout
      </button>
    </form>
  </div>
  );
}