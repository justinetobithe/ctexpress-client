"use client"
import React, { useState } from 'react';
import AppWalkinsTable from '@/components/AppWalkinsTable';

const Page = () => {

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Walk ins</h1>
            </div>
            <AppWalkinsTable />
        </>
    );
};

export default Page;
