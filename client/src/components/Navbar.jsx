import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import customFetch from "../utils/customFetch";

// import { GoLaw } from "react-icons/go";

const Profile = ({ click, useClick, user }) => {
  // const [isOpen, setIsOpen] = useState(false);
  console.log(user);
  return (
    <>
      <AnimatePresence>
        {/* {isOpen && ( */}
        <>
          {/* Overlay background */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => useClick(false)}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-[90%] max-w-md bg-white rounded-xl shadow-lg p-6 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 ml-[36%]">
                User Profile
              </h2>
              <button
                onClick={() => useClick(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col space-y-3 justify-center items-center text-sm text-gray-700 font-mono">
              <p>
                <span>
                  <img src={user.picture} alt="user Profile photo" />
                </span>
              </p>
              <p>
                <span className="text-blue text-sm">
                  Verified:{user.verifed}
                </span>
              </p>
              <p>
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          </motion.div>
        </>
        {/* )} */}
      </AnimatePresence>
    </>
  );
};

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const user = "isko change kario"; // Placeholder for real auth user

  const [date, setDate] = useState(new Date().toLocaleTimeString());
  const day = new Date().getDay();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const navigate = useNavigate();

  const handleback = async () => {
    try {
      const res = await customFetch.get("/check");
      console.log(res);

      // backend checks JWT from cookie
      if (res?.data?.isLoggedIn) {
        navigate(`/chat/${res.data.user.id}`); // redirect if already logged in
      }
    } catch (err) {
      return navigate("/");
      // console.log("No valid session:", err.message);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
  {/* Top Time Bar */}
  <div className="flex justify-between items-center w-full h-5 bg-black/80 font-light text-sm">
    <div className="flex gap-1">
      <div className="px-5 text-white">{date}</div>
      <div className="px-5 text-white">{days[day]}</div>
    </div>
  </div>

  {/* Login/Signup Special Header */}
  {pathname === "/login" || pathname === "/signup" ? (
    <div className="flex mt-7 justify-between items-center px-5">
      {/* Left Side Logo */}
      <div className="flex items-center gap-4">
        <img src="/Frame.png" alt="#" className="w-[37.5px] h-[30px]" />
        <h1 className="text-xl font-serif font-light">
          <Link
            to="/"
            className="family font-bold text-[24px] leading-[24px]"
          >
            Nyay Mitra
          </Link>
        </h1>
      </div>

      {/* Switch Login/Signup */}
      <div className="flex items-center gap-2">
        <h1 className="text-[14px] leading-[14px] font-normal text-[#4B5563] family">
          {pathname === "/login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </h1>
        <Link
          to={pathname === "/login" ? "/signup" : "/login"}
          className="text-[#4F46E5] text-[16px] leading-[16px] font-medium"
        >
          {pathname === "/login" ? "Sign Up" : "Login"}
        </Link>
      </div>
    </div>
  ) : (
    // Main Header for all other pages
    <div className="flex justify-between items-center w-full px-5 py-4 bg-gray-200 rounded-b-lg">
      {/* Left Side: Logo */}
      <div className="flex items-center gap-4">
        <img src="/Frame.png" alt="#" className="w-[37.5px] h-[30px]" />
        <h1 className="text-xl font-serif font-light">
          <Link
            to="/"
            className="family font-bold text-[24px] leading-[24px]"
          >
            Nyay Mitra
          </Link>
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-5">
        {/* Go Back (Not on home page) */}
        {pathname !== "/" && (
          <button
            onClick={handleback}
            type="button"
            className="px-4 py-2 bg-red-400 shadow-2xl cursor-pointer text-white rounded-[8px] border-none"
          >
            Go Back
          </button>
        )}

        {/* Login/Sign Up (Only on home route) */}
        {pathname === "/" && (
          <>
            {user && (
              <img
                src="https://plus.unsplash.com/premium_vector-1719858611039-66c134efa74d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D"
                alt={`Profile of ${user}`}
                className="w-7 h-7 rounded-full hover:scale-110 transition-transform duration-200 cursor-pointer"
              />
            )}
            <Link
              to="/signup"
              className="p-2 px-3 bg-blue-400 font-light rounded-xl hover:bg-blue-500 hover:scale-105 transition text-white"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="p-2 px-3 bg-blue-400 font-light rounded-xl hover:bg-blue-500 hover:scale-105 transition text-white"
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </div>
  )}
</>

  );
}
