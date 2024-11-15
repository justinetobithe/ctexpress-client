"use client"
import React, { useState } from 'react';
import AppTerminalsTable from '@/components/AppTerminalsTable';
import { Button } from '@/components/ui/button';
import { Plus } from "lucide-react";
import AppTerminalForm from '@/components/AppTerminalForm';
import { useQueryClient } from '@tanstack/react-query';
 
const Page = () => {
    const queryClient = useQueryClient();
    const [isAddTerminalDialogOpen, setIsAddTerminalDialogOpen] = useState(false);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[2rem] font-bold">Terminal</h1>
                <Button className="ml-auto" onClick={() => { setIsAddTerminalDialogOpen(true) }}>
                    <Plus className="mr-2" />Add Terminal
                </Button>
            </div>
            <AppTerminalsTable />
            {
                isAddTerminalDialogOpen && (
                    <AppTerminalForm
                        onClose={() => setIsAddTerminalDialogOpen(false)}
                        isOpen={isAddTerminalDialogOpen}
                        queryClient={queryClient}
                    />
                )
            }
        </>
    );
};

export default Page;
