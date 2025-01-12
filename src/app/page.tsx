"use client";

import React, { useEffect, useState } from "react";
import Logo from "@public/img/logo.png";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import moment from "moment";
import { Trip } from "@/types/Trip";

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
        setTrips(response.data.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();

    return () => clearInterval(timer);
  }, []);

  const getFormattedDate = (date: string) => moment(date).format("MMM DD, YYYY");
  const getFormattedTime = (time: string) => moment(time, "HH:mm:ss").format("h:mm A");
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-orange-500";
      case "completed":
        return "text-green-500";
      case "canceled":
        return "text-red-500";
      case "in_progress":
        return "text-blue-500";
      case "failed":
        return "text-gray-500";
      default:
        return "text-black";
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full bg-blue-900 py-4 shadow-md z-50">
        <div className="flex justify-between items-center px-10">
          <Link href="/">
            <div className="flex items-center">
              <Image src={Logo} alt="L300 Transit Logo" width={64} height={64} />
              <span className="ml-4 text-4xl font-bold text-white">CT Express Status Board</span>
            </div>
          </Link>
          <div className="text-white text-3xl">
            {currentTime ? (
              <>
                <div>
                  {getFormattedDate(currentTime.toISOString())} {currentTime.toLocaleTimeString()}
                </div>
              </>
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      </header>

      <div className="py-28 bg-gray-100">
        <div className="overflow-x-auto max-w-full px-6">
          <div className="max-h-[70vh] overflow-y-auto relative">
            <table className="bg-white rounded-lg shadow-lg table-auto w-full">
              <thead className="bg-blue-900 text-white sticky top-0 z-10">
                <tr>
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
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-xl">{getFormattedDate(trip.trip_date)}</td>
                    <td className="px-6 py-4 text-xl">{getFormattedTime(trip.start_time)}</td>
                    <td className="px-6 py-4 text-xl">{trip.terminal_from?.name}</td>
                    <td className="px-6 py-4 text-xl">{trip.terminal_to?.name}</td>
                    <td className="px-6 py-4 text-xl">
                      {trip.driver?.first_name} {trip.driver?.last_name}
                    </td>
                    <td className={`px-6 py-4 text-xl capitalize ${getStatusColor(trip.status)}`}>
                      {trip.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>


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
