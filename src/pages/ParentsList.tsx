import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import { useEffect, useState } from "react";

const ParentsList = () => {
  const auth = useAuth();

  const [parentphoneNumber, setParentPhoneNumber] = useState("");

  const handleParentChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,11}$/.test(value)) {
      setParentPhoneNumber(value);
    }
  };

  const [parents, setParents] = useState({ data: [] });
  const [students, setStudents] = useState({ data: [] });
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showEditParentModal, setShowEditParentModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

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

  const fetchStudents = () => {
    httpClient
      .get("/student")
      .then((res) => {
        console.log(res.data);
        setStudents(res.data);
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
      fetchStudents();
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
      address: address,
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
        <h2 className="text-2xl font-semibold my-4">Veliler</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-2">
          {(parents?.data ?? []).map((parent, index) => (
            <div
              key={index}
              className="bg-gray-200 p-1 rounded flex justify-between items-center"
            >
              <span className="flex p-1">{parent?.user?.firstName}</span>
              <div className="flex flex-row justify-end gap-7 px-2">
                <button
                  className="bg-[#0758C5] hover:bg-blue-700 text-white font-bold py-1 my-1 px-4 rounded"
                  onClick={() => setShowEditParentModal(true)}
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
                type="email"
                id="email"
                name="email"
                placeholder="Veli Mail Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border rounded py-2 px-3 focus:outline-none"
                type="text"
                id="phone"
                name="phone"
                value={parentphoneNumber}
                onChange={handleParentChange}
                placeholder="Veli Telefon Numarası"
                maxLength={11}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <select
                className="border rounded py-2 px-3 focus:outline-none"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Bağlı Öğrenci Seçin</option>
                {(students?.data ?? []).map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.user.firstName} {student.user.lastName}
                  </option>
                ))}
              </select>
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

export default ParentsList;
