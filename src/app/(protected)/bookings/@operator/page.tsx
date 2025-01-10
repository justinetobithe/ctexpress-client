import AppBookingsTable from '@/components/AppBookingsTable';
import React from 'react';

const page = () => {
    return (
        <>
            <h1 className='text-[2rem] font-bold'>Bookings</h1>
            <AppBookingsTable />
        </>
    );
};

export default page;
