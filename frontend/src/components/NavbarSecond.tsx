import { Navigate } from "react-router";
export const NavbarSecond = () => {
  return (
    <div className="">
      <nav className="bg-surfaceColor flex items-center justify-center space-x-10 font-bold text-xl text-white/80 py-4 pt-4 px-4">
        <ul className="nav-row-second">
          <a href="/sell">SELL</a>
        </ul>
        <ul className="nav-row-second">MESSAGES</ul>
        <ul className="nav-row-second">NOTIFICATIONS</ul>
        <ul className="nav-row-second">GARAGE</ul>
        <ul className="nav-row-second">
          <a href="/login">LOGIN</a>
        </ul>
      </nav>
    </div>
  );
};
