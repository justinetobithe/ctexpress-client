"use client";
import React, { useEffect, useState } from 'react';
import Logo from '@public/img/logo.png';
import Image from 'next/image';
import Link from 'next/link';

const page = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const vehicles = [
    { id: 1, name: 'L300 A', capacity: '16/40' },
    { id: 2, name: 'L300 B', capacity: '20/40' },
    { id: 3, name: 'L300 C', capacity: '18/40' },
  ];

  const getFormattedDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString(undefined, options);
  };


  return (
    <>
      <header className='fixed top-0 w-full bg-blue-900 py-4'>
        <div className='flex justify-between items-center px-10'>
          <Link href='/'>
            <div className='flex items-center'>
              <Image src={Logo} alt='L300 Transit Logo' width={64} height={64} />
              <span className='ml-4 text-4xl font-bold text-white'>
                CT Express Status Board
              </span>
            </div>
          </Link>
          <div className='text-white text-3xl'>
            {currentTime ? (
              <>
                <div>{getFormattedDate(currentTime)} {currentTime.toLocaleTimeString()}</div>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </header>
      <main className='py-28 bg-gray-100'>
        <section className='status-board w-full py-10 text-center'>
          <h1 className='text-6xl font-bold mb-10'>Bankerohan to Calinan Transit</h1>
          <div className='grid grid-cols-3 gap-6 px-10'>
            <div className='bg-white p-10 rounded-lg shadow-md'>
              <h2 className='text-4xl font-bold mb-4'>Vehicles Available</h2>
              <p className='text-7xl font-semibold text-green-600'>12</p>
            </div>
            <div className='bg-white p-10 rounded-lg shadow-md'>
              <h2 className='text-4xl font-bold mb-4'>Vehicles On the Way</h2>
              <p className='text-7xl font-semibold text-yellow-600'>8</p>
            </div>
            <div className='bg-white p-10 rounded-lg shadow-md'>
              <h2 className='text-4xl font-bold mb-4'>Next Departure Time</h2>
              <p className='text-6xl font-semibold text-blue-600'>10:30 AM</p>
            </div>
          </div>
        </section>
        <section className='vehicles-container w-full py-10'>
          <h2 className='text-5xl font-bold mb-8 text-center'>Vehicles Waiting for Passengers</h2>
          <div className='grid grid-cols-3 gap-6 px-10'>
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className='bg-white p-10 rounded-lg shadow-md'>
                <h3 className='text-3xl font-bold mb-4'>{vehicle.name}</h3>
                <p className='text-2xl'>Capacity: {vehicle.capacity}</p>
              </div>
            ))}
          </div>
        </section>
        <section className='ads-container w-full mt-10'>
          <h2 className='text-5xl font-bold mb-8 text-center'>Advertisements</h2>
          <div
            className='flex justify-center items-center border-4 border-dashed border-gray-500 h-64 mx-10'
            style={{ borderRadius: '8px' }}
          >
            <p className='text-3xl font-semibold'>Your Ad Here</p>
          </div>
        </section>
      </main>
      <footer className='py-8 bg-blue-900 text-center text-white'>
        <div className='text-2xl'>
          <p>© {new Date().getFullYear()} CT Express. All Rights Reserved.</p>
          <p>Contact us at +000000 or visit our terminals for more information.</p>
        </div>
      </footer>
    </>
  );
};

export default page;
