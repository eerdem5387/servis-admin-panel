import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";

const Parent = () => {
  const auth = useAuth();

  const [parents, setParents] = useState({ data: [] });
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showEditParentModal, setShowEditParentModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [adress, setAdress] = useState("");

  const fetchParents = () => {
    httpClient
      .get("/parent")
      .then((res) => {
        console.log(res.data);
        setParents(res.data);
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
      fetchParents();
    }
  }, [auth]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createParent();
  };

  const createParent = () => {
    const parentData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
      // image: image,
    };

    httpClient
      .post("/parent", parentData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setShowAddParentModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleParentUpdate = (e: any) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = () => {
    const parentData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
      adress: adress,
    };

    httpClient
      .put("/parent/" + uuid, parentData)
      .then((res) => {
        setShowEditParentModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow w-full flex items-center p-6">
        <h1 className="text-3xl font-bold text-red-500 mr-6">Veliler</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAddParentModal(true)}
        >
          Yeni Veli Ekle
        </button>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/5 bg-gray-800 p-4">
          <nav>
            <ul className="space-y-4">
              <li className="text-white">Velinize Öğrenci Ekleyin</li>
            </ul>
          </nav>
        </div>
        <div className="flex flex-col w-4/5 p-4">
          <h2 className="text-2xl font-semibold my-4">Veliler</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(parents?.data ?? []).map((parent, index) => (
              <div
                key={index}
                className="bg-gray-200 p-4 rounded flex justify-between items-center"
              >
                <span>{parent?.user?.firstName}</span>
                <div className="flex flex-row justify-end gap-10">
                  <button
                    onClick={() => setShowEditParentModal(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Düzenle
                  </button>
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAddParentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Yeni Veli Ekle</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Veli Adı"
                className="border rounded py-2 px-3 focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Soyadı"
                className="border rounded py-2 px-3 focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Mail Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Telefon Numarası"
                className="border rounded py-2 px-3 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Kullanıcı Şifresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Görsel"
                className="border rounded py-2 px-3 focus:outline-none"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddParentModal(false)}
                  className="ml-2 bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditParentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Veliyi Düzenle</h3>
            <form onSubmit={handleParentUpdate} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Veli Adı"
                className="border rounded py-2 px-3 focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Soyadı"
                className="border rounded py-2 px-3 focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Mail Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Telefon Numarası"
                className="border rounded py-2 px-3 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Kullanıcı Şifresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Görsel"
                className="border rounded py-2 px-3 focus:outline-none"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={adress}
                onChange={(e) => setAdress(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Güncelle
                </button>
                <button
                  onClick={() => setShowEditParentModal(false)}
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

export default Parent;
