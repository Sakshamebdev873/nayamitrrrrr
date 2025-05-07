import React, { useState,useEffect } from 'react';
import { Awareness } from './cyberPageComponent/Awareness';

import { PiBookOpenFill } from "react-icons/pi";
import { TiDocumentText } from "react-icons/ti";
import { ImHammer2 } from "react-icons/im";
import { CiSearch } from "react-icons/ci";
import { PiDetectiveFill } from "react-icons/pi";
import { FaCircle } from "react-icons/fa";
import { FaHandPointRight } from "react-icons/fa";
import { MdOutlineComputer } from "react-icons/md";
import { VscLaw } from "react-icons/vsc";
import { MdOutlineMan4 } from "react-icons/md";
import { FaSchool } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import { Loader } from './Loader';
import { motion } from 'framer-motion'; // Import motion


function ListCard({ icon,title, items }) {

  const [loading,setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;
    return (
      <div className="bg-white shadow-md rounded-xl max-w-md w-full flex flex-col items-start">
        <div className='flex gap-6 justify-start items-center mb-3 font-mono bg-blue-300 w-full p-5 rounded-b-md'>
            <div className='text-lg text-blue-700'>
            {icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
    <ul className="list-arrow list-inside text-gray-700 space-y-2 font-light p-5">
      {items.map((item, index) => (
          <div className='flex items-start gap-x-2'>
            <span className='mt-1 font-lg text-green-600'><IoIosArrowForward/></span>
            <li key={index}>{item}</li>
            </div>
            
          ))}
        </ul>
      </div>
    );
  }
  

export function Home() {
  const smallCards = [
    {
    icon:<CiSearch/>,
    heading:'Case Search',
    para:'Search and track case status',
  },
    {
    icon:<PiBookOpenFill/>,
    heading:'Law Library',
    para:'Acess legal documents',
  },
    {
    icon:<TiDocumentText/>,
    heading:'E-Filling',
    para:'Submit court documents online',
  },
    {
    icon:<ImHammer2/>,
    heading:'Recent Judgement',
    para:'Latest court Decision',
  },]
  const smallCards1 = [
  {
  icon:<PiDetectiveFill/>,
  heading:'Anonymous Reporting',
  icon2:<FaCircle/>,
  para:'Secure Channel Active',
  btn:'File Anonymous Report'
}]


  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.8 } },
  };

  return (
    <>
      <div className='flex flex-col w-full '>
        {/* // heading */}
        <div className='flex justify-center w-full pt-30'>
          <h1 className='block text-4xl font-medium font-mono text-center'>
            <span className='font-bold'>THE PATH TO JUSTICE</span> <br />Guiding Every Citizen Through
            <br />India's Legal System
          </h1>
        </div>
        {/* 2nd */}
        <div className='w-full mt-15 px-10 md:px-40 flex justify-center text-center font-light'>
          <p>"True democracy thrives when justice is accessible to every citizen — regardless of means, language, or literacy. Today's technology bridges these gaps, making equality under law not just an ideal, but a reality."
          </p>
        </div>
        {/* 3rd - Animated Button */}
        <motion.div
          className='flex justify-center my-5'
          initial="initial"
          animate="animate"
          variants={buttonVariants}
        >
          <button className='bg-blue-500 font-medium rounded-lg font- text-white px-8 py-2 shadow-md hover:bg-blue-600 transition-colors duration-300'>Explore More</button>
        </motion.div>

        {/* numbers */}
        <div className='bg-gray-200'>
        <div className='flex justify-around mx-5 md:mx-10 my-5'>
          <div className=' flex flex-col justify-center rounded-lg p-5 px-8 w-full md:w-[14rem] '>
            <h1 className='text-2xl font-bold text-center mb-3 text-violet-700'>15,000+</h1>
            <p className='font-serif text-center text-sm'>Citizens Helped Daily</p>
          </div>
          <div className=' flex flex-col justify-center rounded-lg p-5 px-8 w-full md:w-[14rem] '>
            <h1 className='text-2xl text-violet-700 font-bold text-center mb-3'>15+</h1>
            <p className='font-serif text-center text-sm'>Regional Languages</p>
          </div>
          <div className='flex flex-col justify-center rounded-lg p-5 px-8 w-full md:w-[14rem] '>
            <h1 className='text-2xl text-violet-700 font-bold text-center mb-3'>24/7</h1>
            <p className='font-serif text-center text-sm'>Support Available </p>
          </div>
        </div>

        {/* small-cards */}
        <div className='flex justify-start gap-3 ml-3 mt-5 overflow-x-auto p-4'>
          {smallCards.map((card) => (
            <div key={card.heading} className='flex flex-col justify-start bg-gray-100 rounded-lg py-3 w-[14rem] px-5 shadow-sm'>
              <div className='text-2xl text-blue-700'>{card.icon}</div>
              <div className='font-extralight '>
                <h1 className='font-serif text-lg mb-1'>{card.heading}</h1>
              </div>
              <div className='flex items-start'>
                <p className='font-extralight text-sm text-black/60'>{card.para}</p>
              </div>
            </div>
          ))}
          {/* anonymous reporting */}
          <div className='flex flex-col justify-start bg-gray-100 rounded-lg py-3 w-[17rem] px-5 shadow-sm'>
            <div className=' flex justify-start gap-x-3 items-center text-lg font-serif'>
              <div className='text-lg font-bold text-green-600'>{smallCards1[0].icon}</div>
              {smallCards1[0].heading}
            </div>
            <div className='font-extralight '>
              <span className='flex justify-start mx-2 text-md font-light items-center gap-x-4 text-black/60 mb-2'>
                <div className='text-green-500'>{smallCards1[0].icon2}</div>
                {smallCards1[0].para}
              </span>
            </div>
            <div className='flex'>
              <button className='bg-black font-mono text-white rounded-lg hover:text-black hover:bg-white text-sm px-3 py-1 transition-colors duration-300'>{smallCards1[0].btn}</button>
            </div>
          </div>
        </div>
        
        {/* end of cards */}

        {/* strip making */}
        <div className='flex justify-around bg-blue-700/80 text-white overflow-x-auto gap-x-4 p-2 my-5 shadow-md'>
          <div className='font-bold text-md font-serif'>Updates :</div>
          <div className='flex justify-center items-center gap-4'>
            <Link to='/' className='text-sm font-light font-serif hover:underline'>Supreme Court: Important verdict on fundamental rights</Link>
            <div className="h-4 border-l border-gray-100 "></div>
          </div>
          <div className='flex justify-center items-center gap-4'>
            <Link to='/' className='text-sm font-light font-serif hover:underline'>New guidelines for online dispute resolution</Link>
            <div className="h-4 border-l border-gray-100 "></div>
          </div>
          <div className='flex justify-center items-center gap-4'>
            <Link to='/' className='text-sm font-light font-serif hover:underline'>Government launches digital literacy program for legal aid</Link>
            <div className="h-4 border-l border-gray-100 "></div>
          </div>
        </div>
        </div>
        {/* card */}
        <div className='flex justify-around gap-10 mt-5 p-4 mx-5'>
          <div className="bg-gray-100 rounded-2xl p-6 py-8 shadow-sm">
            <h2 className="text-xl font-semibold font-serif text-gray-800 mb-2">Constitutional Value of the Week</h2>
            <div className='flex items-center gap-2 mb-4'>
              <FaHandPointRight className='text-xl text-blue-500' />
              <span className='text-xl font-extralight'>Justice</span>
            </div>
            <p className=" font-extralight text-sm text-gray-700">Equal rights and opportunities for all citizens, ensuring social, economic, and political justice as enshrined in the Constitution of India.</p>
          </div>
          <div className="bg-gray-100 rounded-2xl p-6 py-8 shadow-sm">
            <h2 className="text-xl font-semibold font-serif text-gray-800 mb-2">Words of Wisdom</h2>
            <div className='flex items-center gap-2 mb-4'>
              <span className='text-sm font-extralight text-blue-500'>"Law and order are the medicine of the body politic and when the body politic gets sick, medicine must be administered."</span>
            </div>
            <p className="text-gray-600 font-bold text-sm">- Dr. B.R. Ambedkar</p>
          </div>
        </div>
        <hr className='w-full text-gray-300 border-1 my-10' />
        {/* card */}
      <div>
        <div className='flex flex-col justify-center items-center m-5'>
          <h1 className='font-serif font-light text-3xl mb-5 '>Frequently asked questions</h1>
          <p className='text-sm font-extralight text-black/80 mb-3'>Find answers to common questions about our legal services and portal</p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 m-5'>
          <ListCard
            icon={<ImHammer2 />}
            title="Process FAQs"
            items={[
              "What are the steps in filing a civil case?",
              "How long does it typically take for a case to be decided?",
              "What happens during the first hearing?",
              "How can I get a certified copy of a judgment?",
              "What is the procedure for filing an appeal?"
            ]}
          />
          <ListCard
            icon={<MdOutlineComputer />}
            title="Technology FAQs"
            items={[
              "What browsers are supported by the e-filing system?",
              "How do I digitally sign my documents?",
              "What file formats are accepted for evidence submission?",
              "How secure is the information I submit through this portal?",
              "Can I access the portal on mobile devices?"
            ]}
          />
          <ListCard
            icon={<VscLaw />}
            title="Legal Interpretation"
            items={[
              "How do I understand the citations in a judgment?",
              "What is the difference between a decree and an order?",
              "How do I know which court has jurisdiction for my case?",
              "What does it mean when a judgment is 'reserved'?",
              "How can I find cases similar to my situation?"
            ]}
          />
          
            <ListCard
            icon={<FaSchool />}
            title="Administrative"
            items={[
              "What are the court working hours?",
              "How do I make a complaint about court staff?",
              "What are the upcoming court holidays?",
              "How do I address communication to a judge?",
              "Where can I find contact information for courts?"
            ]}
            />
            
        </div>
        <div className='mx-auto my-10 '>
        <Awareness/>
        </div>
        {/* contact */}
        <div className='m-15 '>
          <section className="mt-10">
                    <div className="bg-blue-100 p-6 rounded-lg text-center">
                      <h3 className="text-xl font-semibold mb-2 text-blue-800">Have Questions?</h3>
                      <p className="mb-4">Explore our Help Center or reach out to our legal experts for personalized assistance.</p>
                      <Link to="/contact" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                        Contact Us
                      </Link>
                    </div>
                  </section>
        </div>
      </div>  
    </div>
    </>
  );
}