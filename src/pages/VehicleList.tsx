import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import Map from "@/components/Map";

const VehiclesList = () => {
  const auth = useAuth();

  const [vehicles, setVehicles] = useState({ data: [] });
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // const fetchVehicles = () => {
  //   httpClient
  //     .get("/vehicle")
  //     .then((res) => {
  //       setVehicles(res.data);
  //     })
  //     .catch((err) => {
  //       if (err.response.status === 401) {
  //         auth.refreshToken();
  //         console.log(err);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   if (auth.authData.isAuth) {
  //     fetchVehicles();
  //   }
  // }, [auth]);

  const handleVehicleUpdate = (e: any) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = () => {
    const vehicleData = {
      // firstName: firstName,
      // lastName: lastName,
      // email: email,
      // phone: phone,
      // password: password,
      // address: address,
    };

    httpClient
      .put("/vehicle/" + uuid, vehicleData)
      .then((res) => {
        setShowEditVehicleModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <div className="flex w-full">
        <div className="flex flex-col w-4/5 p-4">
          {/* <h2 className="text-2xl font-semibold my-4">Kullanıcı Rolleri</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(auth.authData?.roles ?? []).map((role, index) => (
              <p key={index} className="bg-gray-200 p-2 rounded">
                {role}
              </p>
            ))}
          </div> */}
          <h2 className="text-2xl font-semibold my-4">Araçlar</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(vehicles?.data ?? []).map((vehicle, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded flex justify-between items-center"
              >
                <span>{vehicle.name}</span>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Düzenle
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditVehicleModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Yeni Rota Ekle</h3>
            <form
              onSubmit={handleVehicleUpdate}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Rota Adı"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="text"
                // value={newSchoolName}
                // onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="Rotanın Kullanılacağı Saat Aralığı"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="text"
                // value={newSchoolName}
                // onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="Rotanın Kullanılacağı Günler"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Ekle
                </button>
                <button
                  // onClick={() => setShowAddSchoolModal(false)}
                  className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesList;
