import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import Map from "@/components/Map";

const Routes = () => {
  const auth = useAuth();

  const [routes, setRoutes] = useState({ data: [] });
  const [newRouteName, setNewRouteName] = useState("");
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

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

  useEffect(() => {
    if (auth.authData.isAuth) {
      fetchRoutes();
    }
  }, [auth]);

  const handleCreateRoute = (e) => {
    e.preventDefault();
    const schoolData = { name: newRouteName };
    createRoute(schoolData);
    setNewRouteName("");
    setShowAddRouteModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow w-full flex items-center p-6">
        <h1 className="text-3xl font-bold text-red-500 mr-6">Rotalar</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAddRouteModal(true)}
        >
          Yeni Rota Ekle
        </button>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/5 bg-gray-800 p-4">
          <nav>
            <ul className="space-y-4">
              <li className="text-white">Rotanıza Araç Ekleyin</li>
              <li className="text-white">Aracınıza Şoför Ekleyin</li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col w-4/5 p-4">
          {/* <h2 className="text-2xl font-semibold my-4">Kullanıcı Rolleri</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(auth.authData?.roles ?? []).map((role, index) => (
              <p key={index} className="bg-gray-200 p-2 rounded">
                {role}
              </p>
            ))}
          </div> */}
          <h2 className="text-2xl font-semibold my-4">Rotalar</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(routes?.data ?? []).map((route, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded flex justify-between items-center"
              >
                <span>{route.name}</span>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Düzenle
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAddRouteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Yeni Rota Ekle</h3>
            <form onSubmit={handleCreateRoute} className="flex flex-col gap-4">
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

export default Routes;
