import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

// import { GoLaw } from "react-icons/go";

export function Navbar() {
  // const { user , loginWithRedirect ,isAuthenticated , logout , isLoading } = useAuth0();
  // console.log('current user', user);
  const location = useLocation();
  const pathname = location.pathname;
  console.log(pathname);

  // let name = '';
  // if(isLoading) return<div className='text-light font-lg '>Loading...</div>

  // if(isAuthenticated){
  //   name = user.name
  //   if(name.length>10){
  //     name = name.slice(0, 10).toUpperCase() + '...';
  //   }
  // }

  return (
    <>
      {pathname === '/chat' ? <></> : pathname === "/login" || pathname === "/signup" ? (
        <>
          <div className="flex mt-7  justify-between ml-5 ">
            <div className="flex items-center gap-7 ml-5">
              <img src="/Frame.png" alt="#" className="w-[37.5px] h-[30px]" />
              <h1 className="text-xl font-serif font-light">
                <Link
                  to="/"
                  className="family font-bold text-[24px] leading-[24px]"
                >
                  Naya Mitra
                </Link>
              </h1>
            </div>
            {pathname === "/login" ? (
              <>
                {" "}
                <div className="flex justify-center mr-4 items-center gap-2">
                  <h1 className="text-[14px] leading-[14px] font-normal text-[#4B5563] family  ">
                    Don't have a account?
                  </h1>
                  <Link
                    to={"/signup"}
                    className="text-[#4F46E5] text-[16px] leading-[16px] font-medium  "
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center mr-4 items-center gap-2">
                  <h1 className="text-[14px] leading-[14px] font-normal text-[#4B5563] family  ">
                    Already have a account?
                  </h1>
                  <Link
                    to={"/login"}
                    className="text-[#4F46E5] text-[16px] leading-[16px] font-medium  "
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="flex justify-between bg-gray-200 items-center p-4 pt-4 rounded-b-lg">
          <div className="flex justify-between ml-5 ">
            <div className="flex items-center gap-7 ml-5">
              <img src="/Frame.png" alt="#" className="w-[37.5px] h-[30px]" />
              <h1 className="text-xl font-serif font-light">
                <Link
                  to="/"
                  className="family font-bold text-[24px] leading-[24px]"
                >
                  Naya Mitra
                </Link>
              </h1>
            </div>
          </div>

          <div className="flex items-center text-md font-extralight justify-end-safe w-[45%] gap-x-10  ">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${
                  isActive ? "font-bold" : "font-light"
                } transition-all duration-200 ease-in-out transform hover:text-blue-700`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/lawforstate"
              className={({ isActive }) =>
                `${
                  isActive ? "font-bold" : "font-light"
                } transition-all duration-200 ease-in-out transform hover:text-blue-700 `
              }
            >
              Laws
            </NavLink>
            <NavLink
              to="/cybersection"
              className={({ isActive }) =>
                `${
                  isActive ? "font-bold" : "font-light"
                } transition-all duration-200 ease-in-out transform hover:text-blue-700`
              }
            >
              Cyber
            </NavLink>
            <NavLink
              to="/legalAssistance"
              className={({ isActive }) =>
                `${
                  isActive ? "font-bold" : "font-light"
                } transition-all duration-200 ease-in-out transform hover:text-blue-700`
              }
            >
              Assistance
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${
                  isActive ? "font-bold" : "font-light"
                } transition-all duration-200 ease-in-out transform hover:text-blue-700`
              }
            >
              Dashboard
            </NavLink>
          </div>

          <div className="flex items-center gap-5 mr-5">
            <div className="flex flex-col"></div>
            <img
              src="https://plus.unsplash.com/premium_vector-1719858611039-66c134efa74d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8fDA%3D"
              alt="image"
              className="w-7 h-7 rounded-full "
            />

            {/* {isAuthenticated && 
      <h2 className='font-extralight text-md '>
      
        Welcome {user.name}
      </h2>}
      
      {isAuthenticated ? <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} className='p-2 bg-blue-400 px-3 rounded-xl font-light hover:bg-blue-500 hover:scale-105 transition text-white'>
        Log out
        </button> : <button onClick={(e)=>loginWithRedirect()} className='p-2 px-3 bg-blue-400 font-light rounded-xl hover:bg-blue-500 hover:scale-105 transition text-white'>Log In
        </button> } */}
            <Link
              to={"signup"}
              className="p-2 px-3 bg-blue-400 font-light rounded-xl hover:bg-blue-500 hover:scale-105 transition text-white"
            >
              Sign Up
            </Link>
            <Link
              to={"/login"}
              className="p-2 px-3 bg-blue-400 font-light rounded-xl hover:bg-blue-500 hover:scale-105 transition text-white"
            >
              Log In
            </Link>
          </div>
        </div>
      ) }
    </>
  );
}
