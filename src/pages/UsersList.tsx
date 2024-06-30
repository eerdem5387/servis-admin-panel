import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import { useEffect, useState } from "react";

const UsersList = () => {
  const [users, setUsers] = useState({ data: [] });
  const auth = useAuth();

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [userphoneNumber, setUserPhoneNumber] = useState("");

  const handleUserChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setUserPhoneNumber(value);
    }
  };

  const fetchUsers = () => {
    httpClient
      .get("/user")
      .then((res) => {
        setUsers(res.data);
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
      fetchUsers();
    }
  }, [auth]);

  return (
    <div className="flex flex-full w-full">
      <div className="flex flex-col w-full p-4">
        {/* <h2 className="text-2xl font-semibold my-4">Kullanıcı Rolleri</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(auth.authData?.roles ?? []).map((role, index) => (
              <p key={index} className="bg-gray-200 p-2 rounded">
                {role}
              </p>
            ))}
          </div> */}
        <h2 className="text-2xl font-semibold my-4">Kullanıcılar</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-2">
          {(users?.data ?? []).map((user, index) => (
            <div
              key={index}
              className="bg-gray-200 p-1 rounded flex justify-between items-center"
            >
              <span className="flex p-1">{user.name}</span>
              <div className="flex flex-row justify-end gap-7 px-2">
                <button
                  onClick={() => setShowAddUserModal(true)}
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
                  // onSubmit={handleCreateUser}
                >
                  <input
                    type="text"
                    // value={newUserName}
                    // onChange={(e) => setNewUserName(e.target.value)}
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

export default UsersList;
