import { CustomInput } from "../components/CustumInput";
import { CustomButton } from "../components/CustomButton";
import { Translations } from "../components/Data";
import { useState } from "react";
import Lock from "../assets/icons/lock.svg";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className="flex-col flex items-center justify-center w-100 h-100 rounded-2xl
      border-1 border-black
        shadow-2xl shadow-secondaryColor/30
      bg-thirdColor"
    >
      <h1 className="font-bold text-white pb-15 text-[4vh]">
        {Translations.login}
      </h1>
      <form className="flex flex-col gap-3" action="login">
        <CustomInput
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={setEmail}
          label="Your Email"
        />
        <CustomInput
          type={showPassword ? "text" : "password"}
          label="Password"
          value={password}
          onChange={setPassword}
          icon={showPassword ? Lock : Lock}
          iconEvent={() => setShowPassword(!showPassword)}
        />

        <CustomButton
          label="LOGIN"
          type="submit"
          className="w-full mt-4 h-9 font-bold text-gray-300/90 "
        />
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>
      </form>
      <a href="" className="text-gray-500/70 text-sm font-inter">
        Forgot Your Password?
      </a>
    </div>
  );
};
