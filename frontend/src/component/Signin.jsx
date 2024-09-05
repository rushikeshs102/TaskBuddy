import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signinValidation from "./ValSignin";
import axios from "axios";

export default function SignIn() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(signinValidation(values));
    if (error.email === "" && error.password === "") {
      axios
        .post("http://localhost:8081/signin", values)
        .then((res) => {
          // console.log(res.data);
          if (res.data.Status === "Success") {
            localStorage.setItem("token", res.data.token);
            navigate("/");
          } else {
            alert("No record exit or password incorrect");
          }
        })
        .catch((err) => console.log("err"));
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-gray-700">
      <div className="p-5 w-2/6 rounded-lg bg-gray-800">
        <div className="text-4xl flex justify-center py-4 font-bold text-gray-300 text-left">
          Sign in
        </div>
        <form action="" onSubmit={handleSubmit} className="">
          <div>
            <label
              htmlFor="email"
              className="text-lg font-medium text-gray-300"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                // required
                // autoComplete="email"
                onChange={handleInput}
                className="w-full rounded-lg py-1.5 px-2 text-gray-900 placeholder:text-gray-400 bg-gray-400"
              />
              {error.email && (
                <span className="text-red-700"> {error.email}</span>
              )}
            </div>
          </div>

          <div>
            <div className="mt-3">
              <label
                htmlFor="password"
                className="text-lg font-medium text-gray-300"
              >
                Password
              </label>
            </div>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                // required
                // autoComplete="current-password"
                onChange={handleInput}
                className="w-full rounded-lg py-1.5 px-2 text-gray-900 placeholder:text-gray-400 bg-gray-400"
              />
              {error.password && (
                <span className="text-red-700"> {error.password}</span>
              )}
            </div>
          </div>

          <div className="py-4 flex flex-row gap-5 items-center">
            <button
              type="submit"
              className="w-1/5 rounded-md p-2 bg-green-500 hover:bg-green-600 text-black font-semibold transition-all duration-300"
            >
              Sign in
            </button>
            <div className="flex flex-row gap-2">
              <p className="text-base text-gray-400">New Account?</p>
              <Link
                to="/signup"
                className="font-semibold leading-6 text-gray-300 hover:text-gray-400 transition-all duration-300"
              >
                sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
