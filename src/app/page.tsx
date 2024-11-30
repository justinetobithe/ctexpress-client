"use client";
import React, { useEffect, useState } from 'react';
import Logo from '@public/img/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { Trip } from '@/types/Trip';
import axios from 'axios';

// Define the baseURL from environment variables
const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance with baseURL
const api = axios.create({
  baseURL: baseURL,
});

const Page = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [vehiclesAvailable, setVehiclesAvailable] = useState<number>(0);
  const [ongoingVehicles, setOngoingVehicles] = useState<number>(0);
  const [nextDepartureTime, setNextDepartureTime] = useState<string>('');
  const [awaitingVehicles, setAwaitingVehicles] = useState<Trip[]>([]);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAvailableVehicles = async () => {
      try {
        const response = await api.get('/api/status-board/vehicles-available');
        if (response.data.status) {
          setVehiclesAvailable(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching available vehicles:", error);
      }
    };

    const fetchOngoingVehicles = async () => {
      try {
        const response = await api.get('/api/status-board/ongoing-vehicles');
        if (response.data.status) {
          setOngoingVehicles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching ongoing vehicles:", error);
      }
    };

    const fetchNextDeparture = async () => {
      try {
        const response = await api.get('/api/status-board/next-trip');
        if (response.data.status) {
          setNextDepartureTime(response.data.data?.start_time);
        }
      } catch (error) {
        console.error("Error fetching next departure time:", error);
      }
    };

    const fetchAwaitingVehicles = async () => {
      try {
        const response = await api.get('/api/status-board/awaiting-vehicles');
        if (response.data.status) {
          setAwaitingVehicles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching awaiting vehicles:", error);
      }
    };

    fetchAvailableVehicles();
    fetchOngoingVehicles();
    fetchNextDeparture();
    fetchAwaitingVehicles();
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
              <p className="text-7xl font-semibold text-green-600">{vehiclesAvailable}</p>
            </div>
            <div className='bg-white p-10 rounded-lg shadow-md'>
              <h2 className='text-4xl font-bold mb-4'>Vehicles On the Way</h2>
              <p className="text-7xl font-semibold text-yellow-600">{ongoingVehicles}</p>
            </div>
            <div className='bg-white p-10 rounded-lg shadow-md'>
              <h2 className='text-4xl font-bold mb-4'>Next Departure Time</h2>
              <p className="text-6xl font-semibold text-blue-600">{nextDepartureTime}</p>
            </div>
          </div>
        </section>
        <section className='vehicles-container w-full py-10'>
          <h2 className='text-5xl font-bold mb-8 text-center'>Vehicles Waiting for Passengers</h2>
          <div className='grid grid-cols-3 gap-6 px-10'>
            {awaitingVehicles.map((awaitingVehicle) => (
              <div key={awaitingVehicle.id} className="bg-white p-10 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold mb-4">
                  {awaitingVehicle.driver?.first_name} {awaitingVehicle.driver?.last_name} -
                  {awaitingVehicle.driver?.vehicle
                    ? `${awaitingVehicle.driver?.vehicle?.license_plate} ${awaitingVehicle.driver?.vehicle?.brand} ${awaitingVehicle.driver?.vehicle?.model}`
                    : "No vehicle assigned"}
                </h3>
                <p className="text-2xl">
                  Available Capacity: {awaitingVehicle.remaining_capacity}/{awaitingVehicle.driver?.vehicle?.capacity ?? "N/A"}
                </p>
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

export default Page;
