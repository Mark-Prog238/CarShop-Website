import { CustomInput } from "./CustomInput.tsx";
import { CustomButton } from "../components/CustomButton";
import { Translations } from "../components/Data";
import React, { useState } from "react";
import API from "./api.ts";
import { Link } from "react-router";
import EyeHidden from "../assets/icons/eye-slash-solid-full.svg";
import EyeShow from "../assets/icons/eye-solid-full.svg";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    try {
      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("response from server: ", data);
    } catch (error) {
      console.error("error during login: ", error);
    }
  };

  return (
    <div className="login-form-style w-100 h-100">
      <h1 className="font-bold text-white pb-15 text-[4vh]">
        {Translations.EN.login}
      </h1>
      <form className="flex flex-col gap-3" onSubmit={handleLogin}>
        <CustomInput
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={setEmail}
          label="Your Email"
          className=" text-white/80 pl-3"
        />
        <CustomInput
          type={showPassword ? "text" : "password"}
          label="Password"
          value={password}
          onChange={setPassword}
          className=" text-white/80 pl-3"
          icon={showPassword ? EyeShow : EyeHidden}
          iconStyle="fill-white"
          iconEvent={() => setShowPassword(!showPassword)}
        />
        <svg
          className="absolute right-2 top-3 size-5 cursor-pointer fill-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z" />
        </svg>
        <CustomButton
          label="LOGIN"
          type="submit"
          className="w-full mt-4 h-9 font-bold text-gray-300/90 "
        />
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-4"></div>
      </form>

      <Link to="/register" className="text-gray-500/70 text-sm font-inter">
        Don`t have an account? Register Here
      </Link>
    </div>
  );
};
