"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { api } from "@/lib/api";
import { Terminal } from "@/types/Terminal";
import { Trip } from "@/types/Trip";
import Gcash from '@public/img/gcash.png';
import Paymaya from '@public/img/paymaya.png';
import { getTerminals } from "@/lib/TerminalAPI";
import { toast } from '@/components/ui/use-toast';
import AppSpinner from "@/components/AppSpinner";
import { useCreateKiosk } from "@/lib/KioskAPI";
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import moment from "moment";
import Image from "next/image";
import { laravelEcho } from "@/utils/pusher";
import { Kiosk } from "@/types/Kiosk";

const tripSchema = z.object({
    name: z.string().nonempty("Passenger name is required."),
    email: z.string().nonempty("Passenger email is required."),
    phone: z.string().nonempty("Passenger phone is required."),
    trip_id: z.number().min(1, "Trip selection is required."),
    payment_method: z.string().nonempty("Payment method is required."),
    amount_to_pay: z.number().min(1, "Amount is required."),
});

type KioskForm = z.infer<typeof tripSchema>;

export default function Page() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [tripsLoading, setTripsLoading] = useState(false);
    const [terminals, setTerminals] = useState<Terminal[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [selectedFromTerminal, setSelectedFromTerminal] = useState<number | null>(null);
    const [selectedToTerminal, setSelectedToTerminal] = useState<number | null>(null);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [iframeURL, setIframeURL] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [showDialog, setShowDialog] = useState(false);
    const [kiosk, setKiosk] = useState<Kiosk | null>(null);

    const { mutate: createKiosk, isPending: isCreating } = useCreateKiosk();

    const form = useForm<KioskForm>({
        resolver: zodResolver(tripSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            trip_id: undefined,
            payment_method: "",
            amount_to_pay: 0,
        },
    });

    const { handleSubmit, control, watch, setValue } = form;

    useEffect(() => {
        const fetchTerminals = async () => {
            try {
                const terminalsData = await getTerminals();
                setTerminals(terminalsData.data);
            } catch (error) {
                console.error("Error fetching terminals:", error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to fetch terminals. Please try again later.',
                });
            }
        };
        fetchTerminals();
    }, []);

    useEffect(() => {
        const fetchTrips = async () => {
            if (selectedFromTerminal && selectedToTerminal) {
                setTripsLoading(true);
                try {
                    const response = await api.get("/api/trips/by-terminals", {
                        params: {
                            fromTerminal: selectedFromTerminal,
                            toTerminal: selectedToTerminal,
                        },
                    });
                    setTrips(response.data.data);
                } catch (error) {
                    console.error("Error fetching trips:", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to fetch trips. Please try again.",
                    });
                } finally {
                    setTripsLoading(false);
                }
            } else {
                setTrips([]);
            }
        };

        fetchTrips();
    }, [selectedFromTerminal, selectedToTerminal]);

    const onSubmit = async (formData: KioskForm) => {
        setLoading(true);
        try {
            await createKiosk(formData, {
                onSettled: (response) => {
                    if (response && response.data) {
                        const kioskData = response.data.data as Kiosk;
                        setKiosk(kioskData);

                        toast({
                            variant: 'success',
                            description: 'Kiosk created successfully!',
                        });
                        console.log("kiosk", kiosk)
                        setShowDialog(true)
                    }
                    setIframeURL(null);
                    setCurrentStep(1);
                    form.reset();
                    setSelectedFromTerminal(null);
                    setSelectedToTerminal(null);
                    setSelectedTrip(null);
                    queryClient.invalidateQueries({ queryKey: ['kiosks'] });
                },
            });
        } catch (error) {
            console.error("Error submitting form:");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => setCurrentStep(prev => prev - 1);

    useEffect(() => {
        laravelEcho('App.Events')
            .private('paymongo.paid')
            .listen('PaymongoPaidEvent', async (response: { data: { payment_intent_id: string } }) => {
                const { data } = response

                console.log("data checkout", data)

                if (data.payment_intent_id == paymentIntentId) {

                    const formData = {
                        ...form.getValues(),
                        payment_method: paymentMethod
                    }

                    await createKiosk(formData, {
                        onSettled: (response) => {
                            if (response && response.data) {
                                const kioskData = response.data.data as Kiosk;
                                setKiosk(kioskData);
                                toast({
                                    variant: 'success',
                                    description: 'Kiosk created successfully!',
                                });
                                console.log("kiosk", kiosk)
                                setShowDialog(true)
                            }
                            setIframeURL(null);
                            setCurrentStep(1);
                            form.reset();
                            setSelectedFromTerminal(null);
                            setSelectedToTerminal(null);
                            setSelectedTrip(null);
                            queryClient.invalidateQueries({ queryKey: ['kiosks'] });
                        },
                    });
                }
            })
    }, [paymentIntentId, createKiosk, form, paymentMethod, queryClient]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="max-w-md w-[700px] p-6 space-y-6 bg-white shadow-md rounded-lg">
                <div className="flex items-center justify-between">
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${currentStep >= 1 ? "bg-[#080E2C]" : "bg-gray-200"
                            }`}
                    >
                        1
                    </div>
                    <div className="flex-1 h-1 bg-gray-200 mx-2 relative">
                        <div
                            className={`absolute top-0 left-0 h-1 ${currentStep >= 2 ? "bg-[#080E2C] w-full" : "w-0"}`}
                            style={{ transition: "width 0.3s ease-in-out" }}
                        />
                    </div>
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${currentStep >= 2 ? "bg-[#080E2C]" : "bg-gray-200"
                            }`}
                    >
                        2
                    </div>
                </div>

                <Form {...form}>
                    {currentStep == 1 && (
                        <form>
                            <h2 className="text-lg font-bold mb-4 text-center">Step 1: Passenger and Trip</h2>

                            <FormField
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passenger Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter passenger name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passenger Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} placeholder="Enter passenger email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passenger Phone</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter passenger phone" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormItem className="mt-5">
                                <FormLabel>From Terminal</FormLabel>
                                <Select
                                    value={
                                        selectedFromTerminal
                                            ? {
                                                value: selectedFromTerminal,
                                                label: terminals.find((terminal) => terminal.id === selectedFromTerminal)?.name || "Unknown Terminal",
                                            }
                                            : null
                                    }
                                    options={terminals
                                        .filter((terminal) => terminal.id !== selectedToTerminal)
                                        .map((terminal) => ({
                                            value: terminal.id!,
                                            label: terminal.name,
                                        }))}
                                    onChange={(option) => {
                                        setSelectedFromTerminal(option?.value ?? null);
                                        if (option?.value === selectedToTerminal) {
                                            setSelectedToTerminal(null);
                                        }
                                    }}
                                    isClearable
                                />
                                <FormMessage />
                            </FormItem>

                            <FormItem className="mt-5 mb-5">
                                <FormLabel>To Terminal</FormLabel>
                                <Select
                                    value={
                                        selectedToTerminal
                                            ? {
                                                value: selectedToTerminal,
                                                label: terminals.find((terminal) => terminal.id === selectedToTerminal)?.name || "Unknown Terminal",
                                            }
                                            : null
                                    }
                                    options={terminals
                                        .filter((terminal) => terminal.id !== selectedFromTerminal)
                                        .map((terminal) => ({
                                            value: terminal.id!,
                                            label: terminal.name,
                                        }))}
                                    onChange={(option) => {
                                        setSelectedToTerminal(option?.value ?? null);
                                    }}
                                    isClearable
                                />
                                <FormMessage />
                            </FormItem>

                            {tripsLoading ? (
                                <div className="flex justify-center py-4">
                                    <AppSpinner />
                                </div>
                            ) : trips.length > 0 ? (
                                <FormField
                                    control={control}
                                    name="trip_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="font-bold">Available Trips</FormLabel>
                                            <div className="space-y-4">
                                                {trips.map((trip) => (
                                                    <div
                                                        key={trip.id}
                                                        onClick={() => {
                                                            setValue("trip_id", trip.id!);
                                                            setValue("amount_to_pay", parseFloat(trip.fare_amount));
                                                            setSelectedTrip(trip);
                                                        }}
                                                        className={`border p-4 rounded-lg cursor-pointer ${field.value === trip.id
                                                            ? "bg-blue-100 border-blue-500"
                                                            : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        <div className="font-bold">
                                                            {trip?.terminal_from?.name} - {trip?.terminal_to?.name}
                                                        </div>

                                                        <div className="text-gray-700">
                                                            {`${trip?.driver?.first_name} ${trip?.driver?.last_name} - ${trip?.driver?.vehicle?.brand} ${trip?.driver?.vehicle?.model} (${trip?.driver?.vehicle?.year})`}
                                                        </div>

                                                        <div className="text-gray-500">
                                                            {`Plate No.: ${trip?.driver?.vehicle?.license_plate}`}
                                                        </div>

                                                        <div className="flex justify-between text-gray-600 mt-2">
                                                            <span>{moment(trip?.start_time, 'HH:mm:ss').format('h:mm A')}</span>
                                                            <span>
                                                                Capacity: {trip?.total_occupancy}/{trip?.driver?.vehicle?.capacity}
                                                            </span>
                                                        </div>

                                                        <div className="text-sm text-gray-600">Fare: ₱{trip.fare_amount}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <div className="text-center text-gray-500">No available trips found.</div>
                            )}
                        </form>
                    )}

                    {currentStep === 2 && (
                        <form>
                            <h2 className="text-lg font-bold mb-4 text-center">Step 2: Payment Method</h2>
                            <FormField
                                control={control}
                                name="payment_method"
                                render={({ field }) => (
                                    <div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {["Cash", "gcash", "paymaya"].map((method) => (
                                                <Button
                                                    type="button"
                                                    key={method}
                                                    variant={field.value === method ? "default" : "outline"}
                                                    onClick={async () => {
                                                        field.onChange(method);
                                                        setPaymentMethod(method)
                                                        if (method === "gcash" || method === "paymaya") {
                                                            try {
                                                                const response = await api.post("/api/payment/checkout", {
                                                                    payment_method: method,
                                                                    description: `${selectedTrip?.terminal_from?.name} to ${selectedTrip?.terminal_to?.name}`,
                                                                    amount: parseFloat(selectedTrip?.fare_amount ?? '0'),
                                                                    name: watch("name"),
                                                                    email: watch("email"),
                                                                    phone: watch("phone"),
                                                                });
                                                                setIframeURL(response.data.url);
                                                                setPaymentIntentId(response.data.payment_intent_id)
                                                            } catch (error) {
                                                                console.error("Error fetching checkout URL:", error);
                                                                toast({
                                                                    variant: "destructive",
                                                                    title: "Error",
                                                                    description: "Failed to initialize payment. Please try again.",
                                                                });
                                                            }
                                                        } else {
                                                            setIframeURL(null);
                                                        }
                                                    }}
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    {method === "gcash" && (
                                                        <Image
                                                            src={Gcash.src}
                                                            alt="GCash"
                                                            width={60}
                                                            height={32}
                                                        />
                                                    )}
                                                    {method === "paymaya" && (
                                                        <Image
                                                            src={Paymaya.src}
                                                            alt="PayMaya"
                                                            width={60}
                                                            height={32}
                                                        />
                                                    )}
                                                    {method === "Cash" && method}
                                                </Button>
                                            ))}
                                        </div>
                                        {iframeURL && field.value !== "Cash" && (
                                            <div className="mt-4">
                                                <iframe
                                                    src={iframeURL}
                                                    className="w-full h-[800px] border rounded-lg"
                                                    title="Payment Gateway"
                                                    allowFullScreen
                                                />
                                            </div>
                                        )}

                                        {field.value === "Cash" && selectedTrip && (
                                            <div className="mt-4 text-lg font-semibold text-center">
                                                Total Amount to Pay: ₱{selectedTrip.fare_amount}
                                            </div>
                                        )}
                                    </div>
                                )}
                            />


                        </form>
                    )}


                    <div className="flex justify-between mt-6">
                        {currentStep > 1 && (
                            <Button type="button" variant="outline" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        {currentStep < 2 ? (
                            <Button type="button" onClick={handleNext} disabled={!watch("name") || !watch("email") || !watch("phone") || !watch("trip_id")}>
                                Next
                            </Button>
                        ) : (
                            watch('payment_method') == "Cash" && (
                                <Button type="button" onClick={handleSubmit(onSubmit)} disabled={isCreating} >
                                    {loading ? <AppSpinner /> : 'Confirm'}
                                </Button>
                            )
                        )}
                    </div>
                </Form>

                {
                    kiosk && (
                        <Dialog open={showDialog} onOpenChange={setShowDialog}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Booking Details</DialogTitle>
                                </DialogHeader>
                                <div>
                                    {kiosk && (
                                        <ul>
                                            <li>
                                                <strong>Name:</strong> {kiosk.name}
                                            </li>
                                            <li>
                                                <strong>Email:</strong> {kiosk.email}
                                            </li>
                                            <li>
                                                <strong>Phone:</strong> {kiosk.phone}
                                            </li>
                                            <li>
                                                <strong>Trip:</strong> {kiosk.trip?.terminal_from?.name} - {kiosk.trip?.terminal_to?.name}
                                            </li>
                                            <li>
                                                <strong>Date:</strong> {kiosk.trip?.trip_date}
                                            </li>
                                            <li>
                                                <strong>Time:</strong> {kiosk.trip?.start_time}
                                            </li>
                                            <li>
                                                <strong>Payment Method:</strong> {kiosk.payment_method}
                                            </li>
                                            <li>
                                                <strong>Status:</strong> {kiosk.paid == 0 ? "Pending" : "Paid"}
                                            </li>
                                        </ul>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setShowDialog(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )
                }

            </div >
        </div >
    );
}
