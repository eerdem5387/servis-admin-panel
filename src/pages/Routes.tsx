import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import RoutesList from "./RoutesList";
import VehiclesList from "./VehicleList";
import DriversList from "./DriverList";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Home.module.css";
import Map from "@/components/Map";

const Routes = () => {
  const auth = useAuth();

  const [selectedItem, setSelectedItem] = useState(0);
  const [isRoutesSubmenuOpen, setIsRoutesSubmenuOpen] = useState(false);
  const [isVehiclesSubmenuOpen, setIsVehiclesSubmenuOpen] = useState(false);
  const [isDriversSubmenuOpen, setIsDriversSubmenuOpen] = useState(false);

  const handleClick = (index) => {
    setSelectedItem(index);
    setIsRoutesSubmenuOpen(index === 0 ? !isRoutesSubmenuOpen : false);
    setIsVehiclesSubmenuOpen(index === 1 ? !isVehiclesSubmenuOpen : false);
    setIsDriversSubmenuOpen(index === 2 ? !isDriversSubmenuOpen : false);
  };

  const [schools, setSchools] = useState({ data: [] });
  const [newRouteName, setNewRouteName] = useState("");
  const [newVehicleName, setNewVehicleName] = useState("");
  const [newDriverName, setNewDriverName] = useState("");
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);

  const fetchRoutes = () => {
    httpClient
      .get("/route")
      .then((res) => {
        setSchools(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          auth.refreshToken();
          console.log(err);
        }
      });
  };

  useEffect(() => {
    if (auth.authData.isAuth) {
      fetchRoutes();
    }
  }, [auth]);

  const createRoute = (routeData) => {
    httpClient
      .post("/route", routeData)
      .then((res) => {
        console.log("Rota başarıyla oluşturuldu:", res.data);
        setSchools((prevRoutes) => ({
          data: [...prevRoutes.data, res.data],
        }));
      })
      .catch((err) => {
        console.error("Rota oluşturulurken bir hata oluştu:", err);
        if (err.response && err.response.status === 401) {
          auth.refreshToken();
        }
      });
  };

  const handleCreateRoute = (e) => {
    e.preventDefault();
    const schoolData = { name: newRouteName };
    createRoute(schoolData);
    setNewRouteName("");
    setShowAddRouteModal(false);
  };

  const handleCreateVehicle = (e) => {
    e.preventDefault();
    setNewVehicleName("");
    setShowAddVehicleModal(false);
  };

  const handleCreateDriver = (e) => {
    e.preventDefault();
    setNewDriverName("");
    setShowAddDriverModal(false);
  };

  const closeModal = () => {
    setShowAddRouteModal(false);
    setShowAddVehicleModal(false);
    setShowAddDriverModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow w-full flex items-center p-6">
        <h1 className="text-3xl font-bold text-gray-500 mr-6">Rotalar</h1>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/6 bg-[#0758C5] p-4">
          <nav>
            <ul className="space-y-4">
              {["Rotalar", "Araçlar", "Sürücüler"].map((item, index) => (
                <li
                  key={index}
                  className={`text-white cursor-pointer p-2 rounded-md ${
                    selectedItem === index ? "bg-[#044a8f] w-full" : ""
                  }`}
                  onClick={() => handleClick(index)}
                >
                  <span className="flex justify-between items-center">
                    {item}
                    <i className="fas fa-plus ml-2"></i>
                  </span>
                  {index === 0 && (
                    <ul
                      className={`transition-height ${
                        isRoutesSubmenuOpen ? "open" : ""
                      } mt-2 space-y-2 pl-4`}
                    >
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button onClick={() => setShowAddRouteModal(true)}>
                          Yeni Rota Ekle
                        </button>
                      </li>
                    </ul>
                  )}
                  {index === 1 && (
                    <ul
                      className={`transition-height ${
                        isVehiclesSubmenuOpen ? "open" : ""
                      } mt-2 space-y-2 pl-4`}
                    >
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button onClick={() => setShowAddVehicleModal(true)}>
                          Yeni Araç Ekle
                        </button>
                      </li>
                    </ul>
                  )}
                  {index === 2 && (
                    <ul
                      className={`transition-height ${
                        isDriversSubmenuOpen ? "open" : ""
                      } mt-2 space-y-2 pl-4`}
                    >
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button onClick={() => setShowAddDriverModal(true)}>
                          Yeni Sürücü Ekle
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex w-full">
          {selectedItem === 0 && <RoutesList />}
          {selectedItem === 1 && <VehiclesList />}
          {selectedItem === 2 && <DriversList />}
        </div>
      </div>
      {showAddRouteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-11/12 h-screen p-8 rounded-lg">
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowAddRouteModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="w-full flex flex-row gap-10">
              <div className="w-1/2 flex flex-col">
                <h3 className="text-lg font-medium mb-4">Yeni Rota Ekle</h3>
                <form
                  onSubmit={handleCreateRoute}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    value={newRouteName}
                    onChange={(e) => setNewRouteName(e.target.value)}
                    placeholder="Rota Adı"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Rotanın Kullanılacağı Saat Aralığı"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Rotanın Kullanılacağı Günler"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Araç Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} */}
                  </select>
                  <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Okul Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} */}
                  </select>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    >
                      Ekle
                    </button>
                    <button
                      onClick={closeModal}
                      className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-1/2 flex flex-col">
                <div className="flex">
                  <Map />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddVehicleModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-11/12 h-screen p-8 rounded-lg">
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowAddVehicleModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="w-full flex flex-row">
              <div className="w-1/2 flex flex-col">
                <h3 className="text-lg font-medium mb-4">Yeni Araç Ekle</h3>
                <form
                  onSubmit={handleCreateVehicle}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    value={newVehicleName}
                    onChange={(e) => setNewVehicleName(e.target.value)}
                    placeholder="Araç Adı"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Araç Plakası"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Şoför Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} */}
                  </select>
                  <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Rota Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} */}
                  </select>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    >
                      Ekle
                    </button>
                    <button
                      onClick={closeModal}
                      className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-1/2 flex flex-col"></div>
            </div>
          </div>
        </div>
      )}
      {showAddDriverModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-11/12 h-screen p-8 rounded-lg">
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowAddDriverModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="w-full flex flex-row">
              <div className="w-full flex flex-col">
                <h3 className="text-lg font-medium mb-4">Yeni Sürücü Ekle</h3>
                <form
                  onSubmit={handleCreateDriver}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    value={newDriverName}
                    onChange={(e) => setNewDriverName(e.target.value)}
                    placeholder="Sürücü Adı"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sürücü Mail Adresi"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sürücü Telefon Numarası"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sürücü Kullanıcı Şifresi"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sürücü Görsel"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Veli Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} */}
                  </select>
                  <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Araç Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} */}
                  </select>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    >
                      Ekle
                    </button>
                    <button
                      onClick={closeModal}
                      className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-full flex flex-col"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Routes;
