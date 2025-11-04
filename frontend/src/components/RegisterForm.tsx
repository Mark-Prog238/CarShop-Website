import { CustomInput } from "./CustomInput.tsx";
import { CustomButton } from "../components/CustomButton";
import { Translations } from "../components/Data";
import React, { useState } from "react";
import EyeHidden from "../assets/icons/eye-slash-solid-full.svg";
import EyeShow from "../assets/icons/eye-solid-full.svg";
import API from "./api.ts";
import { Link } from "react-router";
export const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password || !fullName) {
      window.alert("Please fill in all the fields");
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      window.alert("Passwords don`t match");
      return;
    }

    try {
      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });
      const data = await response.json();
      console.log("response from server: ", data);
      if (data.success) {
      }
    } catch (error) {
      console.error("error during login: ", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-form-style w-100 h-120">
      <h1 className="font-bold text-white pb-15 text-[4vh]">
        {Translations.EN.register}
      </h1>
      <form className="flex flex-col gap-3" onSubmit={handleLogin}>
        <CustomInput
          type="text"
          name="fullName"
          id="fullName"
          value={fullName}
          onChange={setFullName}
          label="Your full name:"
          className="text-white/80 pl-3"
        />
        <CustomInput
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={setEmail}
          label="Your Email: "
          className="text-white/80 pl-3"
        />
        <CustomInput
          type={showPassword ? "text" : "password"}
          label="Your Password: "
          value={password}
          onChange={setPassword}
          className="text-white/80 pl-3"
          icon={showPassword ? EyeShow : EyeHidden}
          iconEvent={() => setShowPassword(!showPassword)}
        />
        <CustomInput
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm password: "
          value={confirmPassword}
          onChange={setConfirmPassword}
          className="text-white/80 pl-3"
          icon={showConfirmPassword ? EyeShow : EyeHidden}
          iconEvent={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <CustomButton
          label={isLoading ? "LOADING" : "REGISTER"}
          type="submit"
          className="w-full mt-4 h-9 font-bold text-gray-300/90 "
        />
        <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent my-4"></div>
      </form>
      <Link to="/login" className="text-gray-500/70 text-sm font-inter">
        Have an account? Login Here
      </Link>
    </div>
  );
};
