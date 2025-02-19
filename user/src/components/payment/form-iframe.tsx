import style from './form-iframe.module.scss';

interface IProps {
  redirectUrl: string;
}

function PaymentIframeForm({ redirectUrl }: IProps) {
  return (
    <div className={style['payment-iframe-form']}>
      <iframe title="Payment check out" src={redirectUrl} />
    </div>
  );
}

export default PaymentIframeForm;
