"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api';

const Page = () => {   

  const [passengers, setPassengers] = useState<number>(0);
  const [vehicles, setVehicles] = useState<number>(0);
  const [drivers, setDrivers] = useState<number>(0);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const response = await api.get('/api/dashboard/passengers');
        if (response.data.data) {
          setPassengers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching available vehicles:", error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await api.get('/api/dashboard/drivers');
        if (response.data.data) {
          setDrivers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching ongoing vehicles:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await api.get('/api/dashboard/vehicles');
        if (response.data.data) {
          setVehicles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching next departure time:", error);
      }
    };

    fetchPassengers();
    fetchDrivers();
    fetchVehicles();
  }, []);

  return (
    <div className='flex space-x-5'>
      <div className='w-1/3'>
        <Card className='relative h-[17.8rem] rounded-[24px] border-[6px] border-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
          <CardContent className='flex h-full items-center justify-center p-6 text-center'>
            <div className='space-y-5'>
              <h4 className='text-[2rem] font-semibold'>Number of Passengers</h4>
              <p className='text-5xl font-bold'>{passengers}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='w-1/3'>
        <Card className='relative h-[17.8rem] rounded-[24px] border-[6px] border-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
          <CardContent className='flex h-full items-center justify-center p-6 text-center'>
            <div className='space-y-5'>
              <h4 className='text-[2rem] font-semibold'>Number of Drivers</h4>
              <p className='text-5xl font-bold'>{drivers}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='w-1/3'>
        <Card className='relative h-[17.8rem] rounded-[24px] border-[6px] border-primary shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]'>
          <CardContent className='flex h-full items-center justify-center p-6 text-center'>
            <div className='space-y-5'>
              <h4 className='text-[2rem] font-semibold'>Number of Vehicles</h4>
              <p className='text-5xl font-bold'>{vehicles}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;  
