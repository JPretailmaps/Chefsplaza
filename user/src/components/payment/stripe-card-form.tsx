import {
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import {
  Button,
  message
} from 'antd';
import { useTheme } from 'next-themes';

interface IProps {
  submit: Function;
  submiting: boolean;
}

export function StripeCardForm({
  submit, submiting
}: IProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || submiting) {
      return;
    }

    if (!elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);
    // Use your card Element with other Stripe.js APIs
    const { error, source } = await stripe.createSource(cardElement, {
      type: 'card',
      redirect: {
        return_url: `${window.location.href}`
      }
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.log('[error]', error);
      message.error(error?.message || 'Invalid card information, please check then try again');
      return;
    }
    submit({
      ...source.card,
      token: source.id,
      year: source.card.exp_year.toString(),
      month: source.card.exp_month.toString(),
      holderName: source.card.name,
      last4Digits: source.card.last4,
      paymentGateway: 'stripe'
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <img src="/payment-cards.png" width="100%" alt="stripe-ico" />
      <div className="stripe-card-form" style={{ padding: '25px 0' }}>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '16px',
                color: theme === 'dark' ? '#fff' : '#424770',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#9e2146'
              }
            }
          }}
        />
      </div>
      <Button className="primary" htmlType="submit" disabled={submiting} block>
        ADD CARD
      </Button>
    </form>
  );
}
