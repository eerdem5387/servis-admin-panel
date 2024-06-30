import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import RoutesList from "./RoutesList";
import VehiclesList from "./VehicleList";
import DriversList from "./DriverList";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Home.module.css";
import Map from "@/components/Map";

const daysOfWeek = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const Routes = () => {
  const auth = useAuth();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  const [selectedDays, setSelectedDays] = useState([]);

  const handleDayChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedDays([...selectedDays, value]);
    } else {
      setSelectedDays(selectedDays.filter((day) => day !== value));
    }
  };

  const [driverphoneNumber, setDriverPhoneNumber] = useState("");

  const handleDriverChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setDriverPhoneNumber(value);
    }
  };

  const [selectedDriverImage, setDriverSelectedImage] = useState(null);

  const handleDriverImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDriverSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const [routes, setRoutes] = useState({ data: [] });
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
        setRoutes(res.data);
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
        setRoutes((prevRoutes) => ({
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
    const routeData = { name: newRouteName };
    createRoute(routeData);
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
                    {item === "Rotalar" && (
                      <div className="flex flex-row items-center justify-between w-full">
                        <span className="flex">Rotalar</span>
                        <i
                          onClick={() => setShowAddRouteModal(true)}
                          className="fas fa-plus ml-2"
                        ></i>
                      </div>
                    )}
                    {item === "Araçlar" && (
                      <div className="flex flex-row items-center justify-between w-full">
                        <span className="flex">Araçlar</span>
                        <i
                          onClick={() => setShowAddVehicleModal(true)}
                          className="fas fa-plus ml-2"
                        ></i>
                      </div>
                    )}
                    {item === "Sürücüler" && (
                      <div className="flex flex-row items-center justify-between w-full">
                        <span className="flex">Sürücüler</span>
                        <i
                          onClick={() => setShowAddDriverModal(true)}
                          className="fas fa-plus ml-2"
                        ></i>
                      </div>
                    )}
                  </span>
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
                  <div className="flex flex-row gap-2">
                    <label htmlFor="startTime">Başlangıç Saati:</label>
                    <input
                      type="time"
                      id="startTime"
                      value={startTime}
                      onChange={handleStartTimeChange}
                    />

                    <label htmlFor="endTime">Bitiş Saati:</label>
                    <input
                      type="time"
                      id="endTime"
                      value={endTime}
                      onChange={handleEndTimeChange}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2>Rotanın Kullanılacağı Günler</h2>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row gap-1">
                        {daysOfWeek.map((day) => (
                          <div className="flex flex-row gap-1" key={day}>
                            <label className="flex flex-row gap-1">
                              <input
                                type="checkbox"
                                value={day}
                                checked={selectedDays.includes(day)}
                                onChange={handleDayChange}
                              />
                              {day}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div>
                        <h3>Seçili Günler</h3>
                        <ul className="flex flex-row gap-1">
                          {selectedDays.map((day) => (
                            <li key={day}>{day}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  {/* <select
                    className="border rounded py-2 px-3 focus:outline-none"
                    // value={selectedStudent}
                    // onChange={(e) => setSelectedStudent(e.target.value)}
                  >
                    <option value="">Bağlı Araç Seçin</option>
                    {/* {(students?.data ?? []).map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName}
                      </option>
                    ))} 
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
                    ))} 
                  </select> */}
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
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Sürücü Mail Adresi"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    className="border rounded py-2 px-3 focus:outline-none"
                    type="text"
                    id="phone"
                    name="phone"
                    value={driverphoneNumber}
                    onChange={handleDriverChange}
                    placeholder="Telefon Numarası"
                    maxLength={11}
                  />
                  <input
                    type="text"
                    placeholder="Sürücü Kullanıcı Şifresi"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <div className="flex flex-row gap-1 items-center">
                    <label htmlFor="imageUpload" className="text-sm">
                      Görsel Yükle:
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleDriverImageChange}
                    />
                  </div>
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
