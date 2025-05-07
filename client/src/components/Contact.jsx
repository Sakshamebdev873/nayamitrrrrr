import React, { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    caseType: '',
    caseDescription: '',
    urgency: 'Normal',
    consent: false,
  });

  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please accept the consent to proceed.");
      return;
    }

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submissionData.append(key, value);
    });

    files.forEach((file, index) => {
      submissionData.append("attachments", file);
    });

    console.log("Submitted FormData:");
    for (let pair of submissionData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    alert("Your case and attachments have been submitted.");
    // Here you would send `submissionData` to your backend (POST to Express/MongoDB for example)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 md:px-20">
      <h1 className="text-4xl font-bold text-center mb-10">Submit a Legal Concern</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white shadow-lg p-8 rounded-xl space-y-6" encType="multipart/form-data">
        
        {/* Personal Info */}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
            className="w-full border p-2 rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full border p-2 rounded-md" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
              className="w-full border p-2 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange}
            className="w-full border p-2 rounded-md" />
        </div>

        {/* Case Info */}
        <div>
          <label className="block mb-1 font-medium">Case Type</label>
          <select name="caseType" value={formData.caseType} onChange={handleChange} required
            className="w-full border p-2 rounded-md">
            <option value="">-- Select Case Type --</option>
            <option value="Criminal">Criminal</option>
            <option value="Civil">Civil</option>
            <option value="Family">Family</option>
            <option value="Property">Property</option>
            <option value="Cybercrime">Cybercrime</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Case Description</label>
          <textarea name="caseDescription" rows="4" value={formData.caseDescription} onChange={handleChange} required
            className="w-full border p-2 rounded-md"
            placeholder="Describe your problem in detail..."></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Urgency Level</label>
          <select name="urgency" value={formData.urgency} onChange={handleChange}
            className="w-full border p-2 rounded-md">
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Immediate">Immediate</option>
          </select>
        </div>

        {/* Attachments */}
        <div>
          <label className="block mb-1 font-medium">Attach Supporting Documents</label>
          <input
            type="file"
            name="attachments"
            accept=".pdf,.doc,.docx,.jpg,.png"
            multiple
            onChange={handleFileChange}
            className="w-full border p-2 rounded-md"
          />
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3">
          <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} className="mt-1" />
          <label className="text-sm">
            I understand and agree that the information provided will be reviewed and may be used for legal assistance purposes. I consent to being contacted regarding this matter.
          </label>
        </div>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
          Submit Case
        </button>
      </form>
    </div>
  );
}
