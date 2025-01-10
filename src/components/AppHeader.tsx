import React, { FC } from 'react';
import { getServerSession } from 'next-auth';
import AuthOptions from '@/lib/AuthOptions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
// import Logo from '@public/img/logo-secondary.svg';
import Logo from '@public/img/logo.png';
import Image from 'next/image';
import AppNavBurger from './AppNavBurger';

const AppHeader: FC = async () => {
  const session = await getServerSession(AuthOptions);

  return (
    <ul className='flex items-center justify-center bg-white px-5 py-3 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.25)]'>
      <li className='flex items-center'>
        <AppNavBurger />
        <Link href='/home' className='flex items-center space-x-2'>
          <Image src={Logo} width={48} height={48} alt='Logo' />
          <span className='text-[1.25rem] font-bold'>CT Express</span>
        </Link>
      </li>
      <li className='ml-auto inline-block'>
        <div className='flex items-center space-x-2'>
          <span className='sm:text-md hidden text-[0.8rem] font-bold sm:inline'>
            {session?.user.name}
          </span>
          <Avatar>
            <AvatarImage
              src={session?.user.image ?? undefined}
              alt='@shadcn'
              className='object-cover'
            />
            <AvatarFallback>
              {session?.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </li>
    </ul>
  );
};

export default AppHeader;
