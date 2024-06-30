import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import UsersList from "./UsersList";
import SchoolsList from "./SchoolsList";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/Home.module.css";
import PhoneInput from "react-phone-number-input/input";

const Schools = () => {
  const auth = useAuth();

  const [schoolphoneNumber, setSchoolPhoneNumber] = useState("");
  const [userphoneNumber, setUserPhoneNumber] = useState("");

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setSchoolPhoneNumber(value);
    }
  };
  const handleUserChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setUserPhoneNumber(value);
    }
  };

  const [selectedItem, setSelectedItem] = useState(0);
  const [isSchoolsSubmenuOpen, setIsSchoolsSubmenuOpen] = useState(false);
  const [isUsersSubmenuOpen, setIsUsersSubmenuOpen] = useState(false);

  const handleClick = (index) => {
    setSelectedItem(index);
    if (index === 0) {
      setIsSchoolsSubmenuOpen(!isSchoolsSubmenuOpen);
      setIsUsersSubmenuOpen(false);
    } else if (index === 1) {
      setIsUsersSubmenuOpen(!isUsersSubmenuOpen);
      setIsSchoolsSubmenuOpen(false);
    } else {
      setIsSchoolsSubmenuOpen(false);
      setIsUsersSubmenuOpen(false);
    }
  };

  const [schools, setSchools] = useState({ data: [] });
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [users, setUsers] = useState({ data: [] });

  const fetchSchools = () => {
    httpClient
      .get("/school")
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
      fetchSchools();
    }
  }, [auth]);

  const createSchool = (schoolData) => {
    httpClient
      .post("/school", schoolData)
      .then((res) => {
        console.log("Okul başarıyla oluşturuldu:", res.data);
        setSchools((prevSchools) => ({
          data: [...prevSchools.data, res.data],
        }));
      })
      .catch((err) => {
        console.error("Okul oluşturulurken bir hata oluştu:", err);
        if (err.response && err.response.status === 401) {
          auth.refreshToken();
        }
      });
  };

  const handleCreateSchool = (e) => {
    e.preventDefault();
    const schoolData = { name: newSchoolName };
    createSchool(schoolData);
    setNewSchoolName("");
    setShowAddSchoolModal(false);
  };

  const createUser = (userData) => {
    httpClient
      .post("/admin", userData)
      .then((res) => {
        console.log("Kullanıcı başarıyla oluşturuldu:", res.data);
        setUsers((prevUsers) => ({
          data: [...prevUsers.data, res.data],
        }));
      })
      .catch((err) => {
        console.error("Kullanıcı oluşturulurken bir hata oluştu:", err);
        if (err.response && err.response.status === 401) {
          auth.refreshToken();
        }
      });
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    const userData = { name: newUserName };
    createUser(userData);
    setNewUserName("");
    setShowAddUserModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow w-full flex items-center p-6">
        <h1 className="text-3xl font-bold text-gray-500 mr-6">
          Okullar ve Kullanıcılar Yönetim Modülü
        </h1>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/6 bg-[#0758C5] p-4 h-screen">
          <nav>
            <ul className="space-y-4">
              {["Okullar", "Kullanıcılar"].map((item, index) => (
                <li
                  key={index}
                  className={`text-white cursor-pointer p-2 rounded-md ${
                    selectedItem === index ? "bg-[#044a8f] w-full" : ""
                  }`}
                  onClick={() => handleClick(index)}
                >
                  <span className="flex justify-between items-center">
                    {item === "Okullar" && (
                      <div className="flex flex-row items-center justify-between w-full">
                        <span className="flex">Okullar</span>
                        <i
                          onClick={() => setShowAddSchoolModal(true)}
                          className="fas fa-plus ml-2 flex"
                        ></i>
                      </div>
                    )}
                    {item === "Kullanıcılar" && (
                      <div className="flex flex-row items-center justify-between w-full">
                        <span className="flex">Kullanıcılar</span>
                        <i
                          onClick={() => setShowAddUserModal(true)}
                          className="fas fa-plus ml-2 flex"
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
          {selectedItem === 0 && <SchoolsList />}
          {selectedItem === 1 && <UsersList />}
        </div>
      </div>
      {showAddSchoolModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white modal-container w-11/12 h-screen p-8 rounded-lg flex-row">
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowAddSchoolModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="w-full flex flex-row gap-5">
              <div className="w-1/2 flex flex-col">
                <h3 className="text-lg font-medium mb-4">Yeni Okul Ekle</h3>
                <form
                  onSubmit={handleCreateSchool}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    value={newSchoolName}
                    onChange={(e) => setNewSchoolName(e.target.value)}
                    placeholder="Okul Adı"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Adres"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Yetkili Kişi"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    className="border rounded py-2 px-3 focus:outline-none"
                    type="text"
                    id="phone"
                    name="phone"
                    value={schoolphoneNumber}
                    onChange={handleSchoolChange}
                    placeholder="Telefon Numarası"
                    maxLength={11}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Mail Adresi"
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
                      onClick={() => setShowAddSchoolModal(false)}
                      className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                    >
                      İptal
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                <h3 className="text-lg font-medium mb-4">Okullar</h3>
                <div className="flex flex-col gap-2">
                  {(schools?.data ?? []).map((school, index) => (
                    <div
                      key={index}
                      className="bg-gray-200 p-1 rounded flex justify-between items-center"
                    >
                      <span className="flex p-1">{school.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddUserModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white modal-container w-11/12 h-screen p-8 rounded-lg flex-row">
            <button
              className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800"
              onClick={() => setShowAddUserModal(false)}
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="flex flex-row w-full">
              <div className="w-1/2 flex flex-col">
                <h3 className="text-lg font-medium mb-4">
                  Yeni Kullanıcı Ekle
                </h3>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={handleCreateUser}
                >
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Kullanıcak Kişi İsim"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Kullanıcak Kişi Soyisim"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Mail Adresi"
                    className="border rounded py-2 px-3 focus:outline-none"
                    required
                  />
                  <input
                    className="border rounded py-2 px-3 focus:outline-none"
                    type="text"
                    id="phone"
                    name="phone"
                    value={userphoneNumber}
                    onChange={handleUserChange}
                    placeholder="Telefon Numarası"
                    maxLength={11}
                  />
                  <input
                    type="text"
                    placeholder="Görsel"
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
                      onClick={() => setShowAddUserModal(false)}
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
    </div>
  );
};

export default Schools;
