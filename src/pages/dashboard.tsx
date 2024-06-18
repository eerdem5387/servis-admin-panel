import React, { useEffect, useState } from "react";
import Map from "@/components/Map";

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
          <nav>
            <ul className="space-y-4">
              <li className="text-white">Raporlar</li>
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
