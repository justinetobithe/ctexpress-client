import AuthOptions from '@/lib/AuthOptions';
import { getServerSession } from 'next-auth';
import React, { FC } from 'react';

const Layout: FC<{
  mother: React.ReactNode;
  ob: React.ReactNode;
}> = async ({ mother, ob }) => {
  const session = await getServerSession(AuthOptions);

  const renderContent = () => {
    switch (session?.user.role) {
      case 'ob_gyne':
        return ob;
      case 'mother':
        return mother;
      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
};

export default Layout;
