import React, { useState, useRef } from "react";
import jsPDF from 'jspdf';
import { Form, useActionData, useNavigation } from "react-router-dom";
import customFetch from '../utils/customFetch';

// The action function remains the same, handling the backend logic.
export const action = async ({ request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    const res = await customFetch.post('/docs', data);
    return res.data.draft;
  } catch (error) {
    return { error: error.response?.data?.message || 'Document generation failed.' };
  }
};

// Markdown to HTML converter
const basicMarkdownToHtml = (markdown = "") => {
    let html = markdown.replace(/\n/g, '<br />');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
};


const LegalAssistant = () => {
  const [type, setDocumentType] = useState("");
  const [language, setLanguage] = useState("");
  const generatedData = useActionData();
  const navigation = useNavigation();
  const previewRef = useRef(null);

  // --- STATE WITH ALL ORIGINAL FIELDS RESTORED ---
  const [formData, setFormData] = useState({
    description: "", policeStation: "", name: "", address: "", contact: "",
    occupation: "", accusedName: "", accusedAddress: "", relationshipToComplainant: "",
    incidentDate: "", incidentTime: "", incidentPlace: "", natureOfOffense: "",
    witnesses: "", evidence: "", actionRequest: "", fullName: "", fatherOrHusbandName: "",
    rtiAddress: "", pinCode: "", officePhone: "", residencePhone: "", mobile: "",
    isBPL: "", infoRequired: "", preferredFormat: "", place: "", date: "",
    feeDetails: {
      paymentMode: "", refNumber: "", paymentDate: "", issuingAuthority: "", amount: ""
    },
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // --- HANDLER FOR NESTED FEE DETAILS RESTORED ---
  const handleFeeDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      feeDetails: { ...prev.feeDetails, [name]: value }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!type) newErrors.type = "Document type is required.";
    if (!language) newErrors.language = "Language is required.";
    // Add more specific validation as needed...
    if (type === 'FIR' && !formData.name) newErrors.name = "Complainant's name is required.";
    if (type === 'RTI' && !formData.fullName) newErrors.fullName = "Full name is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
  };

  const handleDownload = () => {
    if (previewRef.current) {
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      doc.html(previewRef.current, {
        callback: (doc) => doc.save(`${type}_document.pdf`),
        x: 10, y: 10, width: 190, windowWidth: previewRef.current.scrollWidth
      });
    }
  };
  
  const cardData = [
    // ... your cardData array remains the same
  ];
  
  const isSubmitting = navigation.state === 'submitting';

  // --- FIELD DEFINITIONS FOR CLEANER JSX (ALL FIELDS RESTORED) ---
  const firFields = [
    { name: "description", label: "Description of Incident*", type: "textarea" }, { name: "policeStation", label: "Police Station*" },
    { name: "name", label: "Your Name*" }, { name: "address", label: "Your Address*", type: "textarea" },
    { name: "contact", label: "Contact Number*", type: "tel" }, { name: "occupation", label: "Occupation" },
    { name: "accusedName", label: "Accused Person's Name" }, { name: "accusedAddress", label: "Accused Person's Address", type: "textarea" },
    { name: "relationshipToComplainant", label: "Relationship to Complainant" }, { name: "incidentDate", label: "Incident Date*", type: "date" },
    { name: "incidentTime", label: "Incident Time", type: "time" }, { name: "incidentPlace", label: "Place of Incident*" },
    { name: "natureOfOffense", label: "Nature of Offense" }, { name: "witnesses", label: "Witnesses (if any)", type: "textarea" },
    { name: "evidence", label: "Evidence (if any)", type: "textarea" }, { name: "actionRequest", label: "Action Requested", type: "textarea" },
  ];

  const rtiApplicantFields = [
    { name: "fullName", label: "Full Name*" }, { name: "fatherOrHusbandName", label: "Father/Husband's Name" },
    { name: "rtiAddress", label: "Address*", type: "textarea" }, { name: "pinCode", label: "PIN Code*" },
    { name: "officePhone", label: "Office Phone", type: "tel" }, { name: "residencePhone", label: "Residence Phone", type: "tel" },
    { name: "mobile", label: "Mobile Number*", type: "tel" }, { name: "isBPL", label: "Are you Below Poverty Line? (Yes/No)" },
  ];
  
  const rtiFeeFields = [
    { name: "paymentMode", label: "Payment Mode*", type: "select", options: ["", "Demand Draft", "Banker's Cheque", "Cash", "Online Payment"] },
    { name: "refNumber", label: "Reference Number*" }, { name: "paymentDate", label: "Payment Date*", type: "date" },
    { name: "issuingAuthority", label: "Issuing Authority*" }, { name: "amount", label: "Amount*", type: "number" },
  ];

  const rtiOtherFields = [
    { name: "infoRequired", label: "Information Required*", type: "textarea" }, { name: "preferredFormat", label: "Preferred Format of Information" },
    { name: "place", label: "Place*" }, { name: "date", label: "Date*", type: "date" },
  ];

  return (
    <>
      {/* ... Card section remains the same ... */}
      <div className="p-6 max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Create Legal Document</h1>
        <p className="text-sm text-gray-500 mb-8">⚠️ All fields marked with * are compulsory.</p>

        <Form method="post" onSubmit={handleSubmit} className="space-y-6 w-full" noValidate>
          {/* Document Type and Language Selection */}
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Select Document Type *</label>
              <select name="type" id="type" value={type} onChange={(e) => setDocumentType(e.target.value)} className={`mt-1 block w-full p-2 border rounded-md shadow-sm transition-colors ${errors.type ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select...</option>
                <option value="FIR">FIR (First Information Report)</option>
                <option value="RTI">RTI (Right to Information)</option>
              </select>
              {errors.type && <p className="text-red-600 text-xs mt-1">{errors.type}</p>}
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">Select Language *</label>
              <select name="language" id="language" value={language} onChange={(e) => setLanguage(e.target.value)} className={`mt-1 block w-full p-2 border rounded-md shadow-sm transition-colors ${errors.language ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select...</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
              {errors.language && <p className="text-red-600 text-xs mt-1">{errors.language}</p>}
            </div>
          </fieldset>

          {/* --- ANIMATED FIR SECTION --- */}
          <div className={`transition-all duration-700 ease-in-out grid ${type === 'FIR' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <fieldset className="space-y-4 p-4 border rounded-md bg-gray-50/50">
                <legend className="text-lg font-semibold text-gray-800 px-2">FIR Details</legend>
                {firFields.map(({ name, label, type = "text" }) => (
                  <div key={name}>
                    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                    {type === "textarea" ? <textarea id={name} name={name} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300" /> : <input id={name} name={name} type={type} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300" />}
                  </div>
                ))}
              </fieldset>
            </div>
          </div>

          {/* --- ANIMATED RTI SECTION --- */}
          <div className={`transition-all duration-700 ease-in-out grid ${type === 'RTI' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden space-y-6">
                <fieldset className="space-y-4 p-4 border rounded-md bg-gray-50/50">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Applicant Details</legend>
                  {rtiApplicantFields.map(({ name, label, type = "text" }) => ( <div key={name}><label htmlFor={name}>{label}</label><input id={name} name={name} type={type} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300"/></div> ))}
                </fieldset>
                <fieldset className="space-y-4 p-4 border rounded-md bg-gray-50/50">
                  <legend className="text-lg font-semibold text-gray-800 px-2">Fee Details</legend>
                  {rtiFeeFields.map(({ name, label, type = "text", options }) => (
                    <div key={name}><label htmlFor={name}>{label}</label>
                      {type === "select" ? (<select id={name} name={name} onChange={handleFeeDetailsChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300">{options.map(opt => <option key={opt} value={opt}>{opt || 'Select...'}</option>)}</select>
                      ) : (<input id={name} name={name} type={type} onChange={handleFeeDetailsChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300"/>)}
                    </div>
                  ))}
                </fieldset>
                <fieldset className="space-y-4 p-4 border rounded-md bg-gray-50/50">
                   <legend className="text-lg font-semibold text-gray-800 px-2">Information Details</legend>
                  {rtiOtherFields.map(({ name, label, type = "text" }) => ( <div key={name}><label htmlFor={name}>{label}</label>{ type === 'textarea' ? <textarea id={name} name={name} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300"/> : <input id={name} name={name} type={type} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm border-gray-300"/>}</div> ))}
                </fieldset>
            </div>
          </div>

          <div className="flex justify-center items-center pt-4">
            <button type="submit" disabled={isSubmitting || !type} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-3">
              {isSubmitting && (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>)}
              {isSubmitting ? "Generating..." : "Generate Document"}
            </button>
          </div>
        </Form>
        
        {generatedData && !generatedData.error && (
            <div className="mt-12 w-full border bg-white shadow-2xl rounded-lg animate-fade-in-scale">
              <div className="flex justify-between items-center bg-gray-100 p-4 border-b rounded-t-lg"><h2 className="text-xl font-bold text-gray-800">Document Preview</h2></div>
              <div ref={previewRef} className="p-8"><div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(generatedData) }}/></div>
              <div className="p-4 bg-gray-50 border-t rounded-b-lg text-right"><button onClick={handleDownload} className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">Download as PDF</button></div>
            </div>
        )}

        {generatedData?.error && (<div className="mt-8 p-4 w-full bg-red-100 border border-red-400 text-red-700 rounded-md"><p><strong className="font-bold">Error:</strong> {generatedData.error}</p></div>)}
      </div>
    </>
  );
};

export default LegalAssistant;