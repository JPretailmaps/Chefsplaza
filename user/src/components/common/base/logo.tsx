import { IUIConfig } from '@interfaces/ui-config';
import { checkDarkmode } from '@lib/string';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';

function Logo() {
  const { theme } = useTheme();
  const { darkmodeLogo, logo, siteName }: IUIConfig = useSelector((state: any) => state.ui);
  return (
    <Link href="/auth/login">
      {logo ? (
        <Image
          alt="logo"
          width={150}
          height={150}
          quality={70}
          priority
          sizes="(max-width: 768px) 50vw, (max-width: 2100px) 15vw"
          src={(checkDarkmode(theme) && darkmodeLogo) || logo}
        />
      ) : siteName}
    </Link>
  );
}

export default Logo;
