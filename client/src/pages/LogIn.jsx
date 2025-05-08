import React from 'react'
import { Form } from "react-router";
const LogIn = () => {
  return (
    <>
    <div className='flex items-center mt-12  justify-center '>

      <Form className='bg-white flex flex-col  gap-7 w-[443px] h-[500px]  shadow-2xl justify-center'>
        <div className='w-[384px] h-[70px] flex gap-2 flex-col mx-auto' >
          <h1 className=''>Email </h1>
        <input type="email" name="email" id="" className='flex items-center w-[384px] h-[42px] rounded-[8px] border justify-center border-[#D1D5DB] ' />
        </div>
        <div className='w-[384px] h-[70px] flex gap-2 flex-col mx-auto' >
        <h1>Password</h1>
        <input type="password"  name="password" id="" className='flex items-center w-[384px] h-[42px] justify-center border-[#D1D5DB] border rounded-[8px] '/>
        </div>
        <div className='flex justify-center items-center' >
        <button type="submit" className='bg-[#1E3A8A] mt-4  rounded-[8px] py-2 w-[384px] text-white '>login</button>
        </div>
        <div className='mt-4 flex justify-center gap-1 items-center ' >
          <img src="/lock.png" alt="#" className='w-[14px] h-[16px]' />
          <h1 className='font-normal text-[14px] leading-[100%] text-[#6B7280]  ' >Your information is encrypted and secure</h1>
        </div>
      </Form>
    </div>
    </>
  )
}

export default LogIn