import { LoginForm } from "../components/LoginForm";
import { NavbarSecond } from "../components/NavbarSecond";
export const LoginPage = () => {
  return (
    <div className="w-screen h-screen bg-bgColor">
      <NavbarSecond />
      <div className="w-screen h-screen flex items-center justify-center bg-bgColor">
        <LoginForm />
      </div>
    </div>
  );
};
