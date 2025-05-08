import React from "react";
import { Form } from "react-router";

const SignUp = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center mt-12 ">
        <h1 className="font-bold leading-[30px] text-[30px] text-[#1F2937] ">
          Begin your journey to justice
        </h1>
        <div className="bg-[#4F46E5] w-[665px] h-[32px] border-none mt-4 rounded-4xl "></div>
        <Form className="mt-4 w-[672px] rounded-[12px]  shadow-2xl h-[848px] ">
         
          <div className="flex flex-col gap-4 mt-7 px-8">
            <h1 className="text-[20px] leading-[20px] font-semibold  ">
              Basic Information
            </h1>
            <div className="flex mt-4 justify-between">
              <div className="flex flex-col">
                <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
                  First Name
                </h1>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className="w-[292px] h-[42px] mt-2 rounded-[8px] border border-[#D1D5DB] "
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
                  Last Name
                </h1>
                <input
                  type="text"
                  name="LastName"
                  id="LastName"
                  className="w-[292px] h-[42px] rounded-[8px] mt-2 border border-[#D1D5DB] "
                />
              </div>
            </div>
            <div className="mt-4">
              <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
                Mobile Number
              </h1>
              <input
                type="number"
                name="number"
                id="number"
                className="mt-2 w-[608px] h-[42px] rounded-[8px] border border-[#D1D5DB]  "
              />
            </div>
            <div className="mt-4">
              <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
               Email Address
              </h1>
              <input
                type="email"
                name="email"
                id="email"
                className="mt-2 w-[608px] h-[42px] rounded-[8px] border border-[#D1D5DB]  "
              />
            </div>
            <div className="mt-4">
              <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
               Create Password
              </h1>
              <input
                type="password"
                name="password"
                id="password"
                className="mt-2 w-[608px] h-[42px] rounded-[8px] border border-[#D1D5DB]  "
              />
            </div>
            <div className="mt-4">
              <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
               Confirm Password
              </h1>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="mt-2 w-[608px] h-[42px] rounded-[8px] border border-[#D1D5DB]  "
              />
            </div>
            <div className="mt-4">
              <h1 className="font-medium text-[14px] leading-[100%] text-[#374151] ">
              Date of Birth
              </h1>
              <input
                type="date"
                name="date"
                id="date"
                className="mt-2 w-[608px] h-[42px] rounded-[8px] px-2 border border-[#D1D5DB]  "
              />
            </div>
            <div className="w-[608px] h-[72px] flex flex-col mt-6 px-4 rounded-[8px] bg-[#F9FAFB]  " >
<h1 className="font-medium text-[16px] leading-[16px] mt-2 text-[#1F2937]">Your Data is secure</h1>
<h1 className="font-normal text-[14px] leading-[14px] mt-2 text-[#4B5563] ">We use industry-standard encryption to protect your personal information</h1>
            </div>
            <button type="submit" className="bg-[#4F46E5] w-[608px] h-[42px] rounded-[8px] cursor-pointer text-white mt-4" >Continue</button>
          </div>
        </Form>
      </div>
      <div className="mt-12 flex flex-col justify-center items-center text-[#4B5563] gap-4 pb-8" >
<h1 className="font-normal text-[14px] leading-[14px]" >© 2025 Nyay Mitra. All rights reserved.</h1>
<div className="flex gap-2 font-normal text-[14px] leading-[14px] " >
<h1>Terms of Service</h1>
<h1>Contact</h1>
<h1>Privacy Policy</h1>
</div>
      </div>
    </>
  );
};

export default SignUp;
