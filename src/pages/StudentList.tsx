import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import { useEffect, useState } from "react";

const StudentsList = () => {
  const auth = useAuth();

  const [parents, setParents] = useState({ data: [] });
  const [students, setStudents] = useState({ data: [] });
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [selectedParent, setSelectedParent] = useState("");

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

  const handleStudentUpdate = (e: any) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleUpdate = () => {
    const studentData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
      address: address,
    };

    httpClient
      .put("/student/" + uuid, studentData)
      .then((res) => {
        setShowEditStudentModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-full w-full">
      <div className="flex flex-col w-4/5 p-4">
        {/* <h2 className="text-2xl font-semibold my-4">Kullanıcı Rolleri</h2>
          <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
            {(auth.authData?.roles ?? []).map((role, index) => (
              <p key={index} className="bg-gray-200 p-2 rounded">
                {role}
              </p>
            ))}
          </div> */}
        <h2 className="text-2xl font-semibold my-4">Öğrenciler</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
          {(students?.data ?? []).map((students, index) => (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded flex justify-between items-center"
            >
              <span>{students?.user?.firstName}</span>
              <div className="flex flex-row justify-end gap-10">
                <button
                  className="bg-[#0758C5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => setShowEditStudentModal(true)}
                >
                  Düzenle
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {showEditStudentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Öğrenciyi Düzenle</h3>
            <form
              onSubmit={handleStudentUpdate}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Öğrenci Adı"
                className="border rounded py-2 px-3 focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Öğrenci Soyadı"
                className="border rounded py-2 px-3 focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Öğrenci Mail Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="Öğrenci Telefon Numarası"
                className="border rounded py-2 px-3 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="Öğrenci Kullanıcı Şifresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="text"
                placeholder="Öğrenci Görsel"
                className="border rounded py-2 px-3 focus:outline-none"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <input
                type="text"
                placeholder="Öğrenci Adresi"
                className="border rounded py-2 px-3 focus:outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <select
                className="border rounded py-2 px-3 focus:outline-none"
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
              >
                <option value="">Bağlı Veli Seçin</option>
                {(parents?.data ?? []).map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.user.firstName} {parent.user.lastName}
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
                  onClick={() => setShowEditStudentModal(false)}
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

export default StudentsList;
