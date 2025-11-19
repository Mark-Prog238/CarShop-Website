import { RegisterForm } from "../components/RegisterForm";
import { NavbarSecond } from "../components/NavbarSecond";
export const RegisterPage = () => {
  return (
    <div className="w-screen h-screen bg-bgSecond">
      <NavbarSecond />
      <div className="w-screen h-screen flex items-center justify-center bg-bgSecond">
        <RegisterForm />
      </div>
    </div>
  );
};
