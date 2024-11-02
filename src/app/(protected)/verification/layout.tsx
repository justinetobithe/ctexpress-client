import React, { FC } from 'react';
import { checkDoctorVerificationStatus } from '@/lib/DoctorsAPI';

const Layout: FC<{
  confirmed: React.ReactNode;
  pending: React.ReactNode;
  request: React.ReactNode;
}> = async ({ confirmed, pending, request }) => {
  const data = await checkDoctorVerificationStatus();

  const renderContent = () => {
    if (data.success) {
      switch (data.status) {
        case 'confirmed':
          return confirmed;
        case 'pending':
          return pending;
        default:
          return request;
      }
    }

    return null;
  };

  return <>{renderContent()}</>;
};

export default Layout;
