import React, { useState } from 'react';
import { AnimatePresence,motion } from 'framer-motion';

const lawsData = {
  doctor: "Doctors must comply with the Clinical Establishments Act, maintain patient confidentiality under HIPAA-equivalent laws, and follow ethical practices outlined by the Medical Council of India.",
  lawyer: "Lawyers must adhere to the Advocates Act, maintain client confidentiality, and follow professional ethics regulated by the Bar Council of India.",
  engineer: "Engineers must follow safety regulations, building codes, and ethical standards relevant to their discipline.",
  teacher: "Teachers must comply with the Right to Education Act, maintain classroom ethics, and follow board-level guidelines.",
  others: "Different professions follow varied laws. It’s recommended to consult professional bodies or labor laws applicable to your field."
};

export default function Survey() {
  const [click, setClick] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    customProfession: '',
    experience: '',
    privilege: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const getLaws = (profession) => {
    const key = profession.toLowerCase();
    return lawsData[key] || `For ${profession}, please consult local labor or professional regulations.`;
  };

  const btnClick = () => {
    setClick(true);
    setSubmitted(false); // reset form view
  };

  const finalProfession = formData.profession === 'others' ? formData.customProfession : formData.profession;

  return (
    <div className="min-h-screen p-6">

      <div className='flex justify-around items-center gap-x-5 mb-30'>
      <div className='flex flex-col justify-end gap-y-3 ml-10'>
        <h2 className="text-4xl font-bold mb-8 text-gray-800 drop-shadow-sm">Understand your legal right</h2>
        <p className='text-sm font-light max-w-[40%]'>
          Our AI-powered survey helps you identify potential legal issues and provides personalized guidance on protecting your rights.
        </p>
        <button
          className='bg-blue-500 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 hover:scale-105 transition-all duration-300 text-white px-5 py-2 max-w-25'
          onClick={btnClick}
        >
          <span className='transition-all ease-in duration-75'>
          Start!
          </span>
        </button>
      </div>
      <img src="https://plus.unsplash.com/premium_vector-1683141046588-e7d469b8d507?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="helper image" className='max-w-[40%] mt-10 h-[40%] rounded-2xl' />
    </div>
    <AnimatePresence>
      
      {click && (
        <div className="my-10 flex justify-center ">
          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-blue-100/20 border-l-4 border-blue-500 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl"
            >
            <form
              onSubmit={handleSubmit}
              className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-xl w-full max-w-xl space-y-6 transition-all duration-300"
            >
              {[
                {
                  label: 'Your Name',
                  type: 'text',
                  name: 'name',
                  placeholder: 'Enter your full name',
                  value: formData.name
                },
                {
                  label: 'Years of Experience',
                  type: 'number',
                  name: 'experience',
                  placeholder: 'e.g. 5',
                  value: formData.experience
                }
              ].map(({ label, ...rest }, idx) => (
                <div key={idx}>
                  <label className="block font-medium mb-1 text-gray-700">{label}</label>
                  <input
                    {...rest}
                    required
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              ))}

              <div>
                <label className="block font-medium mb-1 text-gray-700">Profession</label>
                <select
                  name="profession"
                  required
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select your profession</option>
                  <option value="doctor">Doctor</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="engineer">Engineer</option>
                  <option value="teacher">Teacher</option>
                  <option value="others">Other</option>
                </select>
              </div>

              {formData.profession === 'others' && (
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Custom Profession</label>
                  <input
                    type="text"
                    name="customProfession"
                    required
                    placeholder="Enter your profession"
                    value={formData.customProfession}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-medium mb-1 text-gray-700">
                  Do you receive any privileges in your profession?
                </label>
                <select
                  name="privilege"
                  required
                  value={formData.privilege}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="not_sure">Not Sure</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 shadow-md hover:shadow-lg hover:scale-103 transition-all duration-300"
              >
                Submit
              </button>
            </form>
            </motion.div>
          ) 
          : (
            <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl w-full max-w-xl space-y-4">
              <h3 className="text-2xl font-bold text-indigo-700 mb-2">Hello, {formData.name} 👋</h3>
              <p className="text-gray-700">
                <strong>Profession:</strong> {finalProfession}
              </p>
              <p className="text-gray-700">
                <strong>Experience:</strong> {formData.experience} year(s)
              </p>
              <p className="text-gray-700">
                <strong>Privileges Received:</strong> {formData.privilege}
              </p>
              <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded text-gray-800">
                <strong>Legal Guidelines:</strong><br />
                {getLaws(finalProfession)}
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl shadow"
              >
                Fill Again
              </button>
            </div>
          )}
        </div>
      )}</AnimatePresence>
      <div className='flex justify-around items-center gap-x-5 mx-10 my-5'>
      <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl">
        <h4 className="text-xl font-semibold mb-2 text-red-600">Identified Legal Issues</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Possible lack of awareness about professional legal obligations.</li>
          <li>Unclear understanding of confidentiality and ethical compliance.</li>
          <li>Risk of non-compliance with sector-specific regulations.</li>
          <li>Vulnerability to legal consequences due to privilege misuse or ignorance.</li>
        </ul>
      </div>
      <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-2xl shadow-md text-gray-800 max-w-xl">
        <h4 className="text-xl font-semibold mb-2 text-green-700">Recommended Actions</h4>
        <ul className="list-disc list-inside space-y-1">
          <li>Review your profession’s code of ethics and compliance guidelines.</li>
          <li>Attend legal awareness workshops or online courses.</li>
          <li>Consult your sector's regulatory body for up-to-date rules.</li>
          <li>Document privileges and ensure fair, lawful usage.</li>
          <li>Stay updated on labor laws and digital rights (especially for tech roles).</li>
        </ul>
      </div>
</div>

    </div>
  );
}
