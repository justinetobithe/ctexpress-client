"use client";
import React, { useEffect, useState } from "react";
import Logo from "@public/img/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types/Trip";
import { api } from "@/lib/api";
import moment from "moment";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const fetchTrips = async () => {
      try {
        const response = await api.get("/api/trips");
        console.log("response", response);
        setTrips(response.data.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();

    return () => clearInterval(timer);
  }, []);

  const getFormattedDate = (date: string) => {
    return moment(date).format("MMM DD, YYYY"); // Formats like Jan 11, 2025
  };

  const getFormattedTime = (time: string) => {
    return moment(time, "HH:mm:ss").format("h:mm A"); // Formats like 3:59 PM
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'completed':
        return 'green';
      case 'canceled':
        return 'red';
      case 'in_progress':
        return 'blue';
      case 'failed':
        return 'gray';
      default:
        return 'black';
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-blue-900 py-4 shadow-md z-50">
        <div className="flex justify-between items-center px-10">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src={Logo}
                alt="L300 Transit Logo"
                width={64}
                height={64}
              />
              <span className="ml-4 text-4xl font-bold text-white">
                CT Express Status Board
              </span>
            </div>
          </Link>
          <div className="text-white text-3xl">
            {currentTime ? (
              <>
                <div>
                  {getFormattedDate(currentTime.toISOString())}{" "}
                  {currentTime.toLocaleTimeString()}
                </div>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </header>
      <main className="py-28 bg-gray-100">
        <div className="overflow-x-auto max-w-full px-6">
          <table className="min-w-full bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="px-6 py-3 text-left font-medium text-xl">Date</th>
                <th className="px-6 py-3 text-left font-medium text-xl">Time</th>
                <th className="px-6 py-3 text-left font-medium text-xl">Terminal From</th>
                <th className="px-6 py-3 text-left font-medium text-xl">Terminal To</th>
                <th className="px-6 py-3 text-left font-medium text-xl">Driver</th>
                <th className="px-6 py-3 text-left font-medium text-xl">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-xl">
                    {getFormattedDate(trip.trip_date)}
                  </td>
                  <td className="px-6 py-4 text-xl">
                    {getFormattedTime(trip.start_time)}
                  </td>
                  <td className="px-6 py-4 text-xl">
                    {trip.terminal_from?.name}
                  </td>
                  <td className="px-6 py-4 text-xl">
                    {trip.terminal_to?.name}
                  </td>
                  <td className="px-6 py-4 text-xl">
                    {trip.driver?.first_name} {trip.driver?.last_name}
                  </td>
                  <td
                    className="px-6 py-4 text-xl capitalize"
                    style={{
                      color: getStatusColor(trip.status),
                    }}
                  >
                    {trip.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="py-8 bg-blue-900 text-center text-white">
        <div className="text-2xl">
          <p>© {new Date().getFullYear()} CT Express. All Rights Reserved.</p>
          <p>Contact us at +000000 or visit our terminals for more information.</p>
        </div>
      </footer>
    </>
  );
};

export default Page;
