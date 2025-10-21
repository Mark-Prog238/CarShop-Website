import { useState } from "react";
import { CustomInput } from "../components/CustumInput";
import { CustomButton } from "../components/CustomButton";
import { Translations } from "../components/Data";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bgColor">
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
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={setPassword}
            label="Your Password"
          />
          <CustomButton
            label="LOGIN"
            type="submit"
            className="w-full mt-4 h-9 font-bold text-gray-300/90 "
          />
        </form>
      </div>
    </div>
  );
};
