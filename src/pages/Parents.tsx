import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import React, { useEffect, useState } from "react";
import ParentsList from "./ParentsList";
import StudentList from "./StudentList";

const Parent = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [isParentsSubmenuOpen, setIsParentsSubmenuOpen] = useState(false);
  const [isStudentsSubmenuOpen, setIsStudentsSubmenuOpen] = useState(false);

  const handleClick = (index) => {
    setSelectedItem(index);
    if (index === 0) {
      setIsParentsSubmenuOpen(!isParentsSubmenuOpen);
      setIsStudentsSubmenuOpen(false);
    } else if (index === 1) {
      setIsStudentsSubmenuOpen(!isStudentsSubmenuOpen);
      setIsParentsSubmenuOpen(false);
    } else {
      setIsParentsSubmenuOpen(false);
      setIsStudentsSubmenuOpen(false);
    }
  };

  const auth = useAuth();

  const [parents, setParents] = useState({ data: [] });
  const [students, setStudents] = useState({ data: [] });
  const [schools, setSchools] = useState({ data: [] });
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [address, setAddress] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

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

  const handleSubmitStudent = (e: any) => {
    e.preventDefault();
    createStudent();
  };

  const createStudent = () => {
    const studentData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: password,
      // image: image,
    };

    httpClient
      .post("/student", studentData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setShowAddStudentModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow w-full flex items-center p-6">
        <h1 className="text-3xl font-bold text-gray-500 mr-6">
          Veliler ve Öğrenciler Yönetim Modülü
        </h1>
      </header>
      <div className="flex w-full">
        <div className="flex flex-col w-1/6 h-screen bg-[#0758C5] p-4">
          <nav>
            <ul className="space-y-4">
              {["Veliler", "Öğrenciler"].map((item, index) => (
                <li
                  key={index}
                  className={`text-white cursor-pointer p-2 rounded-md ${
                    selectedItem === index ? "bg-[#044a8f] w-full" : ""
                  }`}
                  onClick={() => handleClick(index)}
                >
                  {item}
                  {item === "Veliler" && isParentsSubmenuOpen && (
                    <ul className="mt-2 space-y-2 pl-4">
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button onClick={() => setShowAddParentModal(true)}>
                          Yeni Veli Ekle
                        </button>
                      </li>
                    </ul>
                  )}
                  {item === "Öğrenciler" && isStudentsSubmenuOpen && (
                    <ul className="mt-2 space-y-2 pl-4">
                      <li className="text-white bg-[#0575d1] p-2 cursor-pointer rounded-md">
                        <button onClick={() => setShowAddStudentModal(true)}>
                          Yeni Öğrenci Ekle
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="flex w-full">
          {selectedItem === 0 && <ParentsList />}
          {selectedItem === 1 && <StudentList />}
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
                placeholder="Veli Öğrenci Ad Soyad"
                className="border rounded py-2 px-3 focus:outline-none"
                // value={lastName}
                // onChange={(e) => setLastName(e.target.value)}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Adresi 2"
                className="border rounded py-2 px-3 focus:outline-none"
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Veli Adresi Detay"
                className="border rounded py-2 px-3 focus:outline-none"
                // value={address}
                // onChange={(e) => setAddress(e.target.value)}
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
              <select
                className="border rounded py-2 px-3 focus:outline-none"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                <option value="">Bağlı Okul Seçin</option>
                {(schools?.data ?? []).map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
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
      {showAddStudentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="relative bg-white w-1/2 p-8 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Yeni Öğrenci Ekle</h3>
            <form
              onSubmit={handleSubmitStudent}
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
              <select
                className="border rounded py-2 px-3 focus:outline-none"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                <option value="">Bağlı Okul Seçin</option>
                {(schools?.data ?? []).map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                >
                  Ekle
                </button>
                <button
                  onClick={() => setShowAddStudentModal(false)}
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
