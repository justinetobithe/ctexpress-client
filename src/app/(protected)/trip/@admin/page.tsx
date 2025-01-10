"use client"
import React, { useState } from 'react';
import AppTripTable from '@/components/AppTripTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppTripForm from '@/components/AppTripForm';
import { useQueryClient } from '@tanstack/react-query';



const Page = () => {
    const queryClient = useQueryClient();
    const [isAddTripDialogOpen, setIsAddTripDialogOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Trip</h1>
                <Button className="ml-auto" onClick={() => { setIsAddTripDialogOpen(true) }}>
                    <Plus className="mr-2" />Add Trip
                </Button>
            </div>
            <AppTripTable />
            {
                isAddTripDialogOpen && (
                    <AppTripForm
                        onClose={() => setIsAddTripDialogOpen(false)}
                        isOpen={isAddTripDialogOpen}
                        queryClient={queryClient}
                    />
                )
            }
        </>
    );
};

export default Page;
