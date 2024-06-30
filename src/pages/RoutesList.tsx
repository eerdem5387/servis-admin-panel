import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
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

const RoutesList = () => {
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

  const [routes, setRoutes] = useState({ data: [] });
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showEditRouteModal, setShowEditRouteModal] = useState(false);

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

  const handleRouteUpdate = (e: any) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = () => {
    const routeData = {
      // firstName: firstName,
      // lastName: lastName,
      // email: email,
      // phone: phone,
      // password: password,
      // address: address,
    };

    httpClient
      .put("/route/" + uuid, routeData)
      .then((res) => {
        setShowEditRouteModal(false);
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
          <h2 className="text-2xl font-semibold my-4">Rotalar</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-2">
            {(routes?.data ?? []).map((route, index) => (
              <div
                key={index}
                className="bg-gray-200 p-1 rounded flex justify-between items-center"
              >
                <span className="flex p-1">{route.name}</span>
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
      {showEditRouteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Rota Düzenle</h3>
            <form onSubmit={handleRouteUpdate} className="flex flex-col gap-4">
              <input
                type="text"
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
                  Kaydet
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

export default RoutesList;
