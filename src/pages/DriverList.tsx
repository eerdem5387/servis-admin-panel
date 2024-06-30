import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import Map from "@/components/Map";

const DriversList = () => {
  const auth = useAuth();

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

  const [drivers, setDrivers] = useState({ data: [] });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);

  const fetchDrivers = () => {
    httpClient
      .get("/driver")
      .then((res) => {
        setDrivers(res.data);
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
      fetchDrivers();
    }
  }, [auth]);

  const handleDriverUpdate = (e: any) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = () => {
    const driverData = {
      // firstName: firstName,
      // lastName: lastName,
      // email: email,
      // phone: phone,
      // password: password,
      // address: address,
    };

    httpClient
      .put("/driver/" + uuid, driverData)
      .then((res) => {
        setShowEditDriverModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <div className="flex w-full">
        <div className="flex flex-col w-full p-4">
          {/* <h2 className="text-2xl font-semibold my-4">Kullanıcı Rolleri</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(auth.authData?.roles ?? []).map((role, index) => (
              <p key={index} className="bg-gray-200 p-2 rounded">
                {role}
              </p>
            ))}
          </div> */}
          <h2 className="text-2xl font-semibold my-4">Sürücüler</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-2">
            {(drivers?.data ?? []).map((driver, index) => (
              <div
                key={index}
                className="bg-gray-200 p-1 rounded flex justify-between items-center"
              >
                <span className="flex p-1">{drivers?.user?.firtName}</span>
                <div className="flex flex-row justify-end gap-7 px-2">
                  <button className="bg-[#0758C5] hover:bg-blue-700 text-white font-bold py-1 my-1 px-4 rounded">
                    Düzenle
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 my-1 px-4 rounded">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditDriverModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Sürücü Düzenle</h3>
            <form onSubmit={handleDriverUpdate} className="flex flex-col gap-4">
              <input
                type="text"
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

export default DriversList;
