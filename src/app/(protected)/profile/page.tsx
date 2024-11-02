import React from 'react';
import User from '@/types/User';
import { api } from '@/lib/api';
import ProfileForm from './components/ProfileForm';

const page = async () => {
  const { data } = await api.get<User>('/api/me');
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Edit Profile</h1>
      <ProfileForm user={data} />
    </>
  );
};

export default page;
