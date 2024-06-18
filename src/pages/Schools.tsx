import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import UsersList from "./UsersList";
import SchoolsList from "./SchoolsList";

const Schools = () => {
  const auth = useAuth();

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
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow w-full flex items-center p-6">
        <h1 className="text-3xl font-bold text-gray-500 mr-6">
          Okullar ve Kullanıcılar Yönetim Modülü
        </h1>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/6 bg-[#0758C5] p-4">
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
                  {item}
                  {item === "Okullar" && isSchoolsSubmenuOpen && (
                    <ul className="mt-2 space-y-2 pl-4">
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button onClick={() => setShowAddSchoolModal(true)}>
                          Yeni Okul Ekle
                        </button>
                      </li>
                    </ul>
                  )}
                  {item === "Kullanıcılar" && isUsersSubmenuOpen && (
                    <ul className="mt-2 space-y-2 pl-4">
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button>Yeni Kullanıcı Ekle</button>
                      </li>
                    </ul>
                  )}
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
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Yeni Okul Ekle</h3>
            <form onSubmit={handleCreateSchool} className="flex flex-col gap-4">
              <input
                type="text"
                value={newSchoolName}
                onChange={(e) => setNewSchoolName(e.target.value)}
                placeholder="Okul Adı"
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

export default Schools;
