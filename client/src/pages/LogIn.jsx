import React, { useEffect } from 'react'
import { Form, redirect, useNavigate } from "react-router";
import customFetch from '../utils/customFetch';
export const action = async({request}) =>{
  const formdata = await request.formData()
  const data = Object.fromEntries(formdata)
  try {
   const res = await customFetch.post('/login',data)
    return redirect(`/chat/${res.data.userId}`)
  } catch (error) {
    console.log(error);
    return error
  }
}
const LogIn = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await customFetch.get('/check'); 
        console.log(res);
        
        // backend checks JWT from cookie
        if (res?.data?.isLoggedIn) {
          navigate(`/chat/${res.data.user.id}`); // redirect if already logged in
        }
      } catch (err) {
         return navigate('/login')
        // console.log("No valid session:", err.message);
      }
    };

    checkSession();
  }, [navigate]);
  return (
    <>
    <div className='flex items-center mt-12  justify-center '>

      <Form method='post' className='bg-white flex flex-col  gap-7 w-[443px] h-[500px]  shadow-[4px_10px_15px_-5px] justify-center'>
        <div className='w-[384px] h-[70px] flex gap-2 flex-col mx-auto' >
          <h1 className=''>Email </h1>
        <input type="email" name="email" id="email" className='flex items-center w-[384px] px-2 outline-0 h-[42px] rounded-[8px] border justify-center border-[#D1D5DB] ' />
        </div>
        <div className='w-[384px] h-[70px] flex gap-2 flex-col mx-auto' >
        <h1>Password</h1>
        <input type="password"  name="password" id="password" className='flex items-center px-2 outline-0 w-[384px] h-[42px] justify-center border-[#D1D5DB] border rounded-[8px] '/>
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