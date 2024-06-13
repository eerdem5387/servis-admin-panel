import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const auth = useAuth();

  const [schools, setSchools] = useState({ data: [] });
  const [newSchoolName, setNewSchoolName] = useState("");
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showEditSchoolModal, setShowEditSchoolModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

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

  const updateSchool = (id, updatedData) => {
    httpClient
      .put(`/school/${id}`, updatedData)
      .then((res) => {
        console.log("Okul başarıyla güncellendi:", res.data);
        fetchSchools(); // Okulları yeniden getirerek güncel listeyi göster
        setShowEditSchoolModal(false);
      })
      .catch((err) => {
        console.error("Okul güncellenirken bir hata oluştu:", err);
        if (err.response && err.response.status === 401) {
          auth.refreshToken();
        }
      });
  };

  useEffect(() => {
    if (auth.authData.isAuth) {
      fetchSchools();
    }
  }, [auth]);

  const handleCreateSchool = (e) => {
    e.preventDefault();
    const schoolData = { name: newSchoolName };
    createSchool(schoolData);
    setNewSchoolName("");
    setShowAddSchoolModal(false);
  };

  const handleEditClick = (school) => {
    setSelectedSchool(school);
    setShowEditSchoolModal(true);
  };

  const handleUpdateSchool = (e) => {
    e.preventDefault();
    if (!selectedSchool || !selectedSchool.location) {
      console.error("Selected school or its location is undefined.");
      return;
    }
    const updatedSchool = {
      _id: selectedSchool._id,
      name: e.target.name.value,
      image: e.target.image.value,
      location: {
        longitude: parseFloat(e.target.longitude.value),
        latitude: parseFloat(e.target.latitude.value),
      },
      address: e.target.address.value,
      contact: e.target.contact.value,
      status: e.target.status.value,
    };
    updateSchool(selectedSchool._id, updatedSchool);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-red-500">Dashboard</h1>
        </div>
      </header>
      <main>
        <h2 className="text-2xl font-semibold my-4">Kullanıcı Rolleri</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
          {(auth.authData?.roles ?? []).map((role, index) => (
            <p key={index} className="bg-gray-200 p-2 rounded">
              {role}
            </p>
          ))}
        </div>
        <h2 className="text-2xl font-semibold my-4">Okullar</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
          {(schools?.data ?? []).map((school, index) => (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded flex justify-between items-center"
            >
              <span>{school.name}</span>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleEditClick(school)}
              >
                Düzenle
              </button>
            </div>
          ))}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4"
          onClick={() => setShowAddSchoolModal(true)}
        >
          Yeni Okul Ekle
        </button>
      </main>
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
                placeholder="Yeni okul adı"
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
        </div>
      )}
      {showEditSchoolModal && selectedSchool && selectedSchool.location && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Okul Düzenle</h3>
            <form onSubmit={handleUpdateSchool} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                defaultValue={selectedSchool.name}
                placeholder="Okul adı"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="text"
                name="image"
                defaultValue={selectedSchool.image}
                placeholder="Okul resmi URL"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="number"
                name="longitude"
                defaultValue={selectedSchool.location.longitude}
                placeholder="Boylam"
                step="any"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="number"
                name="latitude"
                defaultValue={selectedSchool.location.latitude}
                placeholder="Enlem"
                step="any"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="text"
                name="address"
                defaultValue={selectedSchool.address}
                placeholder="Adres"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <input
                type="text"
                name="contact"
                defaultValue={selectedSchool.contact}
                placeholder="İletişim"
                className="border rounded py-2 px-3 focus:outline-none"
                required
              />
              <select
                name="status"
                defaultValue={selectedSchool.status}
                className="border rounded py-2 px-3 focus:outline-none"
                required
              >
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setShowEditSchoolModal(false)}
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

export default Dashboard;
