import { useState } from "react";
import { CustomInput } from "../components/CustumInput";
import { CustomButton } from "../components/CustomButton";
export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-bgColor">
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
        <CustomButton label="Login" type="submit" className="w-full mt-2" />
      </form>
    </div>
  );
};
