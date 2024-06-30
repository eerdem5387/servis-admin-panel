import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import { useEffect, useState } from "react";

const SchoolsList = () => {
  const [schools, setSchools] = useState({ data: [] });
  const auth = useAuth();

  const [schoolphoneNumber, setSchoolPhoneNumber] = useState("");
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  const handleSchoolChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setSchoolPhoneNumber(value);
    }
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
          console.log(err);
        }
      });
  };

  useEffect(() => {
    if (auth.authData.isAuth) {
      fetchSchools();
    }
  }, [auth]);

  return (
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
        <h2 className="text-2xl font-semibold my-4">Okullar</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-2">
          {(schools?.data ?? []).map((school, index) => (
            <div
              key={index}
              className="bg-gray-200 p-1 rounded flex justify-between items-center"
            >
              <span className="flex p-1">{school.name}</span>
              <div className="flex flex-row justify-end gap-7 px-2">
                <button
                  onClick={() => setShowAddSchoolModal(true)}
                  className="bg-[#0758C5] hover:bg-blue-700 text-white font-bold py-1 my-1 px-4 rounded"
                >
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
                <h3 className="text-lg font-medium mb-4">Okul Düzenle</h3>
                <form
                  // onSubmit={handleCreateSchool}
                  className="flex flex-col gap-4"
                >
                  <input
                    type="text"
                    // value={newSchoolName}
                    // onChange={(e) => setNewSchoolName(e.target.value)}
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
    </div>
  );
};

export default SchoolsList;
