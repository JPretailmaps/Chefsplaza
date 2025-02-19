import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { IUIConfig } from 'src/interfaces';

function Logo() {
  const { theme } = useTheme();
  const { darkmodeLogo, logo, siteName }: IUIConfig = useSelector((state: any) => state.ui);

  return (
    <Link href="/">
      {logo ? (
        <Image
          alt="logo"
          width={150}
          height={150}
          quality={70}
          priority
          sizes="(max-width: 768px) 50vw, (max-width: 2100px) 15vw"
          src={(theme === 'dark' && darkmodeLogo) || logo}
        />
      ) : siteName}
    </Link>
  );
}

export default Logo;
