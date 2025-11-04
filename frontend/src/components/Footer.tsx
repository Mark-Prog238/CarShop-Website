export const Footer = () => {
  return (
    <footer className="w-full bg-surfaceColor text-black">
      {/* Divider line */}
      <div className="my-2 w-full h-[2px] bg-linear-to-r from-primaryColor/10 via-primaryColor to-primaryColor/10" />

      {/* Main footer content */}
      <div className="w-full px-8 py-12 flex flex-col md:flex-row md:justify-between gap-8">
        {/* Container 1 */}
        <div className="flex flex-col space-y-1">
          <p className="font-semibold mb-2">Socials</p>
          <a href="">Instagram</a>
          <a href="">Facebook</a>
          <a href="">X</a>
          <a href="">Tiktok</a>
        </div>

        {/* Container 2 */}
        <div className="flex flex-col space-y-1">
          <p className="font-semibold mb-2">Account</p>
          <a href="">Profile</a>
          <a href="">Settings</a>
          <a href="">Logout</a>
        </div>

        {/* Container 3 */}
        <div className="flex flex-col space-y-1">
          <p className="font-semibold mb-2">TOS</p>
          <a href="">Privacy Policy</a>
          <a href="">Terms of Service</a>
          <a href="">Cookies</a>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-sm text-right pr-4 pb-4 text-black/70">
        Copyright @Mark
      </p>
    </footer>
  );
};
