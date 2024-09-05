import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import signupValidation from "./ValSignup";
import axios from "axios";

export default function SignUp() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState({});

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(signupValidation(values));
    if (error.name === "" && error.email === "" && error.password === "") {
      const data = axios
        .post("http://localhost:8081/signup", values)
        .then((res) => {
          console.log(res);
          navigate("/signin");
        })
        .catch((err) => console.log("err"));
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen w-full bg-gray-700">
        <div className="p-5 w-2/6 rounded-lg bg-gray-800">
          <div className="text-4xl flex justify-center py-4 font-bold text-gray-300 text-left">
            Create Account
          </div>
          <form action="" onSubmit={handleSubmit} className="">
            <div>
              <label
                htmlFor="name"
                className="text-lg font-medium text-gray-300"
              >
                User name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  // required
                  onChange={handleInput}
                  className="w-full rounded-lg py-1.5 px-2 text-gray-900 placeholder:text-gray-400 bg-gray-400"
                />
                {error.name && (
                  <span className="text-red-700"> {error.name}</span>
                )}
              </div>
            </div>
            <div className="mt-3">
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
                className="w-1/5  rounded-md p-2 bg-green-500 hover:bg-green-600 text-black font-semibold transition-all duration-300"
              >
                Sign up
              </button>
              <div className="flex flex-row gap-2">
                <p className="text-base text-gray-400">Have Account?</p>
                <Link
                  to="/signin"
                  className="font-semibold leading-6 text-gray-300 hover:text-gray-400 transition-all duration-300"
                >
                  sign in
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
