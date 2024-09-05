import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "XYZ", email: "xyz@gmail.com" });

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:8081")
      .then((response) => {
        if (response.data.Status === "Success") {
          setAuth(true);
          setUser({ name: response.data.name, email: response.data.email });
        } else {
          setAuth(false);
          setUser({});
          navigate("/signin");
        }
      })
      .catch((error) => console.log(error));
  }, [navigate]);

  return (
    <div className="bg-gray-400 h-full p-[2vh]">
      <div className="flex flex-col lg:flex-row h-full sm:h-full lg:h-[96vh] gap-4">
        <div className="border border-gray-600 rounded-xl p-4 w-full lg:w-1/6 flex flex-col justify-between text-gray-800 bg-gray-300">
          <Sidebar user={user} />
        </div>
        <div className="border border-gray-600 rounded-xl p-4 w-full lg:w-5/6 text-gray-300">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;
