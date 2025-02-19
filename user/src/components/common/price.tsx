type Props = {
  amount: any;
};

function Price({
  amount
}: Props) {
  let a = amount;
  if (typeof amount === 'string') parseFloat(amount);
  else if (!amount) a = 0;

  return <span>{`$${(a || 0).toFixed(2)}`}</span>;
}

export default Price;
