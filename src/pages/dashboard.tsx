import React, { useEffect, useState } from "react";
import Map from "@/components/Map";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-gray-100 shadow w-full">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-500">Dashboard</h1>
        </div>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/6 h-screen bg-[#0758C5] p-4">
          <nav className="flex flex-col gap-5">
            <ul className="">
              <Link href="#" className="text-white">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                  Ana Menü
                </span>
              </Link>
            </ul>
            <ul className="">
              <Link href="/VehicleTrack" className="text-white">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                  Araç Takibi
                </span>
              </Link>
            </ul>
            <ul className="">
              <Link href="/Stats" className="text-white">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                  İstatistikler
                </span>
              </Link>
            </ul>
            <ul className="">
              <Link href="/Rapor" className="text-white">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium">
                  Raporlar
                </span>
              </Link>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col w-4/5 p-4">
          <Map />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
