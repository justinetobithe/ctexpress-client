import React from 'react';
import VerificationForm from './components/VerificationForm';
import { getDoctorVerificationRemarks } from '@/lib/DoctorsAPI';

const page = async () => {
  const data = await getDoctorVerificationRemarks();

  return (
    <div className='flex h-full max-w-5xl mx-auto items-center justify-center'>
      <div>
        {data && data.message ? (
          <div className='mb-5 text-center'>
            <h3 className='mb-5 text-4xl font-semibold'>
              Account verification was{' '}
              <span className='text-destructive'>rejected</span>!
            </h3>
            <p>
              <strong>Remarks:</strong> {data.message}. Please try again!
            </p>
          </div>
        ) : null}
        <VerificationForm />
      </div>
    </div>
  );
};

export default page;
