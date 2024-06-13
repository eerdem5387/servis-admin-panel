import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const auth = useAuth();

  const [schools, setSchools] = useState({ data: [] });

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Servis 1",
      driverName: "Şoför 1",
      driverPhone: "1234567890",
      carPlate: "34 ABC 123",
      username: "user1",
      password: "pass1",
    },
    {
      id: 2,
      name: "Servis 2",
      driverName: "Şoför 2",
      driverPhone: "0987654321",
      carPlate: "34 XYZ 987",
      username: "user2",
      password: "pass2",
    },
    {
      id: 3,
      name: "Servis 3",
      driverName: "Şoför 3",
      driverPhone: "5555555555",
      carPlate: "34 DEF 456",
      username: "user3",
      password: "pass3",
    },
  ]);

  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [carPlate, setCarPlate] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const addNewService = () => {
    const newService = {
      id: services.length + 1,
      name: driverName + " - " + carPlate,
      driverName,
      driverPhone,
      carPlate,
      username,
      password,
    };
    setServices([...services, newService]);
    setShowAddServiceModal(false);
    setDriverName("");
    setDriverPhone("");
    setCarPlate("");
    setUsername("");
    setPassword("");
  };

  const editService = (service) => {
    setSelectedService(service);
    setDriverName(service.driverName);
    setDriverPhone(service.driverPhone);
    setCarPlate(service.carPlate);
    setUsername(service.username);
    setPassword(service.password);
    setShowEditServiceModal(true);
  };

  const updateService = () => {
    const updatedServices = services.map((service) =>
      service.id === selectedService.id
        ? {
            ...service,
            driverName,
            driverPhone,
            carPlate,
            username,
            password,
            name: driverName + " - " + carPlate,
          }
        : service
    );
    setServices(updatedServices);
    setShowEditServiceModal(false);
  };

  const deleteService = (id) => {
    const updatedServices = services.filter((service) => service.id !== id);
    setServices(updatedServices);
  };

  const fetchSchools = () => {
    httpClient
      .get("/school")
      .then((res) => {
        setSchools(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          auth.refreshToken();
        }
      });
  };

  useEffect(() => {
    if (auth.authData.isAuth) {
      fetchSchools();
    }
  }, [auth]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-red-500">Dashboard</h1>
        </div>
      </header>
      <main>
        <h2>Kullanıcı Rolleri</h2>
        <div className="w-full flex flex-col gap-4 min-h-10">
          {(auth.authData?.roles ?? []).map((role, index) => (
            <p key={index}>{role}</p>
          ))}
        </div>
        <h2>Okullar</h2>
        <div className="w-full flex flex-col gap-4 min-h-10">
          {(schools?.data ?? []).map((school, index) => (
            <p key={index}>{school.name}</p>
          ))}
        </div>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Mevcut Servisler</h2>
              <ul className="flex flex-col gap-2">
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center justify-between"
                  >
                    <span>{service.name}</span>
                    <div>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 mr-2 rounded"
                        onClick={() => editService(service)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => deleteService(service.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setShowAddServiceModal(true)}
            >
              Yeni Servis Ekle
            </button>
          </div>
        </div>
      </main>
      {showAddServiceModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Yeni Servis Ekle</h3>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Şoför Adı Soyadı"
                className="border rounded py-2 px-3 focus:outline-none"
              />
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="Şoför Telefon Numarası"
                className="border rounded py-2 px-3 focus:outline-none"
              />
              <input
                type="text"
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
                placeholder="Araç Plakası"
                className="border rounded py-2 px-3 focus:outline-none"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı Adı"
                className="border rounded py-2 px-3 focus:outline-none"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="border rounded py-2 px-3 focus:outline-none"
              />
              <div className="flex justify-end">
                <button
                  onClick={addNewService}
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddServiceModal(false)}
                  className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditServiceModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Servis Düzenle
                    </h3>
                    <div className="flex flex-col mt-2 gap-3">
                      <input
                        type="text"
                        value={driverName}
                        onChange={(e) => setDriverName(e.target.value)}
                        placeholder="Şoför Adı Soyadı"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <input
                        type="text"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        placeholder="Şoför Telefon Numarası"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <input
                        type="text"
                        value={carPlate}
                        onChange={(e) => setCarPlate(e.target.value)}
                        placeholder="Araç Plakası"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Kullanıcı Adı"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Şifre"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={updateService}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setShowEditServiceModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
