import { useAuth } from "@/hoc/AuthContext";
import React, { useState } from "react";

const Dashboard = () => {
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-red-500">Dashboard</h1>
        </div>
      </header>
      <div className="mt-[100px] w-full flex flex-col gap-4 justify-center items-center">
        <input placeholder="E-mail" type="text" onChange={(e) => setEmail(e.target.value)} className="border shadow-md rounded-lg p-2" />
        <input placeholder="Şifre" type="password" onChange={(e) => setPassword(e.target.value)} className="border shadow-md rounded-lg p-2" />
        <button
          type="button"
          onClick={() => {
            auth.login(email, password);
          }}
          className="bg-blue-500 px-6 py-2 rounded-lg shadow text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
