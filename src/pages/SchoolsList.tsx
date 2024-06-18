import { useAuth } from "@/hoc/AuthContext";
import httpClient from "@/httpClient";
import { useEffect, useState } from "react";

const SchoolsList = () => {
  const [schools, setSchools] = useState({ data: [] });
  const auth = useAuth();

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
        <h2 className="text-2xl font-semibold my-4">Okullar</h2>
        <div className="w-full flex flex-col gap-4 min-h-10 bg-white shadow rounded p-4">
          {(schools?.data ?? []).map((school, index) => (
            <div
              key={index}
              className="bg-gray-200 p-4 rounded flex justify-between items-center"
            >
              <span>{school.name}</span>
              <button className="bg-[#0758C5] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Düzenle
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SchoolsList;
