import Image from 'next/image';

export function renderCardIcon(brand: string) {
  const opts = {
    height: 30,
    width: 40,
    sizes: '20vw',
    style: { height: 25, width: 'auto' }
  };
  switch (brand?.toLowerCase()) {
    case 'visa':
      return (
        <Image
          src="/cards/visa-ico.png"
          alt="visa"
          {...opts}
        />
      );
    case 'mastercard':
      return (
        <Image
          src="/cards/mastercard-ico.png"
          alt="mastercard"
          {...opts}
        />
      );
    case 'discover':
      return (
        <Image
          src="/cards/discover-ico.png"
          alt="discover"
          {...opts}
        />
      );
    case 'amex':
      return (
        <Image
          src="/cards/american-express-ico.png"
          alt="american-express"
          {...opts}
        />
      );
    case 'hipercard':
      return (
        <Image
          src="/cards/hipercard-ico.png"
          alt="hipercard"
          {...opts}
        />
      );
    case 'elo':
      return (
        <Image
          src="/cards/elo-ico.png"
          alt="elo"
          {...opts}
        />
      );
    default:
      return <span>{brand}</span>;
  }
}
