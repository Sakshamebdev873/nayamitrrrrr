// import React, { useState } from 'react';
// import { BsFillXCircleFill } from "react-icons/bs";

// import { jsPDF } from 'jspdf';
// import { Link } from 'react-router-dom';

// // React component file updated to group legal document cards by category with a selector
// // Card wrapper
// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl ${className}`}>
//     {children}
//   </div>
// );

// // Card content component
// const CardContent = ({ title, icon, description, footer, className = '' }) => (
//   <div className={`p-6 ${className} `}>
//     {icon && <div className="text-3xl text-blue-500 mb-4">{icon}</div>}
//     {title && <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>}
//     {description && <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>}
//     {footer && <div className="pt-2 text-xs text-gray-500">{footer}</div>}
//   </div>
// );

// // Reusable Button
// const Button = ({ children, onClick, type = 'button', className = '' }) => (
//   <button
//     type={type}
//     onClick={onClick}
//     className={`bg-blue-500 rounded-full hover:bg-blue-600 text-white font-semibold py-2 px-4 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${className}`}
//   >
//     {children}
//   </button>
// );

// // Reusable Input
// const Input = ({ label, id, type = 'text', placeholder, value, onChange, required = false }) => (
//   <div className="mb-4">
//     {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
//     <input
//       id={id}
//       type={type}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//     />
//   </div>
// );

// // Reusable Textarea
// const Textarea = ({ label, id, placeholder, value, onChange, rows = 4, required = false }) => (
//   <div className="mb-4">
//     {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
//     <textarea
//       id={id}
//       rows={rows}
//       placeholder={placeholder}
//       value={value}
//       onChange={onChange}
//       required={required}
//       className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
//     ></textarea>
//   </div>
// );

// // --- MAIN PAGE WITH SELECTOR ---

// export const LegalAssistant = () => {
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [activeForm, setActiveForm] = useState(null);

//   const categories = {
//     "Property": ["Rental Agreement", "Power of Attorney"],
//     "Personal": ["Affidavit"],
//     "Family": ["Petition for Divorce", "Child Custody Agreement", "Child Support Worksheet"]
//   };

//   const forms = {
//     "Affidavit": () => <AffidavitForm onClose={() => setActiveForm(null)} />,
//     "Rental Agreement": () => <RentalAgreementForm onClose={() => setActiveForm(null)} />,
//     "Power of Attorney": () => <PowerOfAttorneyForm onClose={() => setActiveForm(null)} />,
//     "Petition for Divorce": () => <PetitionForDivorceForm onClose={() => setActiveForm(null)} />,
//     "Child Custody Agreement": () => <ChildCustodyAgreementForm onClose={() => setActiveForm(null)} />,
//     "Child Support Worksheet": () => <ChildSupportWorksheetForm onClose={() => setActiveForm(null)} />
//   };

//   const filteredCards = Object.entries(categories)
//     .filter(([category]) => selectedCategory === 'All' || selectedCategory === category)
//     .flatMap(([_, docs]) => docs);

//     const [selectedDoc, setSelectedDoc] = useState(null);

//   const handleCreateClick = (docId) => {
//     setSelectedDoc(docId);
//   };

//   const handleCloseForm = () => {
//     setSelectedDoc(null);
//   };

//   const legalDocuments = [
//     {
//       id: 'affidavit',
//       title: 'Affidavit',
//       description: 'A written statement confirmed by oath or affirmation, for use as evidence in court.',
//       link: 'https://www.legalzoom.com/articles/sample-affidavit-template'
//     },
//     {
//       id: 'rental',
//       title: 'Rental Agreement',
//       description: 'Legal agreement between landlord and tenant outlining rental terms.',
//       link: 'https://www.nolo.com/legal-encyclopedia/free-books/renters-rights-book/chapter5-2.html'
//     },
//     {
//       id: 'powerOfAttorney',
//       title: 'Power of Attorney',
//       description: 'Legal document giving someone authority to act on your behalf.',
//       link: 'https://www.investopedia.com/terms/p/powerofattorney.asp'
//     },
//     {
//       id: 'divorce',
//       title: 'Petition for Divorce',
//       description: 'Initiates the legal process of divorce.',
//       link: '#',
//     },
//     {
//       id: 'custody',
//       title: 'Child Custody Agreement',
//       description: 'Outlines terms for child custody and visitation.',
//       link: '#',
//     },
//     {
//       id: 'support',
//       title: 'Child Support Worksheet',
//       description: 'Calculates child support obligations.',
//       link: '#',
//     },
//     {
//       id: 'claim',
//       title: 'Statement of Claim',
//       description: 'Initiates a small claims lawsuit.',
//       link: '#',
//     },
//     {
//       id: 'hearing',
//       title: 'Notice of Hearing',
//       description: 'Notifies parties of a scheduled court hearing.',
//       link: '#',
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Generate Legal Documents</h1>
//         <select
//           className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="All">All Categories</option>
//           {Object.keys(categories).map((cat) => (
//             <option key={cat} value={cat}>{cat}</option>
//           ))}
//         </select>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//         {filteredCards.map((docName) => (
//           <Card key={docName} >
//             <CardContent
//               title={docName}
//               description={`Click to fill and generate the ${docName}.`}
//             />
//             <div className="px-6 pb-4">
//               <Button onClick={() => setActiveForm(docName)}>Generate</Button>
//             </div>
//           </Card>
//         ))}
//       </div>
//       {activeForm && forms[activeForm]()}
//       {selectedDoc === 'affidavit' && <AffidavitForm onClose={handleCloseForm} />}
//       {selectedDoc === 'rental' && <RentalAgreementForm onClose={handleCloseForm} />}
//       {selectedDoc === 'powerOfAttorney' && <PowerOfAttorneyForm onClose={handleCloseForm} />}
//       {selectedDoc === 'divorce' && <PetitionForDivorceForm onClose={handleCloseForm} />}
//       {selectedDoc === 'custody' && <ChildCustodyAgreementForm onClose={handleCloseForm} />}
//       {selectedDoc === 'support' && <ChildSupportWorksheetForm onClose={handleCloseForm} />}
//       {selectedDoc === 'claim' && <StatementOfClaimForm onClose={handleCloseForm}/>}
//       {selectedDoc === 'hearing' && <NoticeOfHearingForm onClose={handleCloseForm} />}
//     </div>
//   );
// };

// // Import and use your form components (AffidavitForm, RentalAgreementForm, etc.) above this page component as you already have them.

// // --- Legal Forms ---

// function AffidavitForm({ onClose }) {
//   const [name, setName] = useState('');
//   const [statement, setStatement] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Affidavit", 20, 20);
//     doc.text(`I, ${name}, do hereby solemnly affirm:`, 20, 40);
//     doc.text(statement, 20, 60);
//     doc.text("Signature: ________________________", 20, 100);
//     doc.save("Affidavit.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between items-center mb-4 gap-x-2">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Affidavit</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input
//         label="Your Full Name"
//         placeholder="Enter your full name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//         className="mb-4"
//       />
//       <Textarea
//         label="Statement"
//         placeholder="Enter your statement..."
//         value={statement}
//         onChange={(e) => setStatement(e.target.value)}
//         rows={5}
//         className="mb-4"
//       />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// }

// function RentalAgreementForm({ onClose }) {
//   const [landlordName, setLandlordName] = useState('');
//   const [tenantName, setTenantName] = useState('');
//   const [propertyAddress, setPropertyAddress] = useState('');
//   const [rentAmount, setRentAmount] = useState('');
//   const [term, setTerm] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Rental Agreement", 20, 20);
//     doc.text(`Landlord: ${landlordName}`, 20, 40);
//     doc.text(`Tenant: ${tenantName}`, 20, 50);
//     doc.text(`Property Address: ${propertyAddress}`, 20, 60);
//     doc.text(`Rent Amount: ${rentAmount}`, 20, 70);
//     doc.text(`Term: ${term}`, 20, 80);
//     doc.save("Rental_Agreement.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between items-center mb-4 gap-x-2">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Rental Agreement</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Landlord Name" placeholder="Enter landlord's full name" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} className="mb-4" />
//       <Input label="Tenant Name" placeholder="Enter tenant's full name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="mb-4" />
//       <Input label="Property Address" placeholder="Enter property address" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} className="mb-4" />
//       <Input label="Rent Amount" placeholder="Enter monthly rent amount" value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} className="mb-4" />
//       <Input label="Agreement Term" placeholder="Enter agreement term (e.g., 12 months)" value={term} onChange={(e) => setTerm(e.target.value)} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// }

// // Power of Attorney Form Component
// function PowerOfAttorneyForm({ onClose }) {
//   const [principalName, setPrincipalName] = useState('');
//   const [agentName, setAgentName] = useState('');
//   const [powersGranted, setPowersGranted] = useState('');
//   const [effectiveDate, setEffectiveDate] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Power of Attorney", 20, 20);
//     doc.text(`Principal: ${principalName}`, 20, 40);
//     doc.text(`Agent: ${agentName}`, 20, 50);
//     doc.text(`Powers Granted: ${powersGranted}`, 20, 60);
//     doc.text(`Effective Date: ${effectiveDate}`, 20, 70);
//     doc.save("Power_of_Attorney.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between gap-x-2 items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Power of Attorney</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Principal Name" placeholder="Enter your full name (Principal)" value={principalName} onChange={(e) => setPrincipalName(e.target.value)} className="mb-4" />
//       <Input label="Agent Name" placeholder="Enter the agent's full name" value={agentName} onChange={(e) => setAgentName(e.target.value)} className="mb-4" />
//       <Textarea label="Powers Granted" placeholder="Specify the powers granted to the agent" value={powersGranted} onChange={(e) => setPowersGranted(e.target.value)} rows={5} className="mb-4" />
//       <Input label="Effective Date" type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// }

// const PetitionForDivorceForm = ({ onClose }) => {
//   const [petitionerName, setPetitionerName] = useState('');
//   const [respondentName, setRespondentName] = useState('');
//   const [marriageDate, setMarriageDate] = useState('');
//   const [groundsForDivorce, setGroundsForDivorce] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Petition for Divorce", 20, 20);
//     doc.text(`Petitioner: ${petitionerName}`, 20, 40);
//     doc.text(`Respondent: ${respondentName}`, 20, 50);
//     doc.text(`Date of Marriage: ${marriageDate}`, 20, 60);
//     doc.text(`Grounds for Divorce: ${groundsForDivorce}`, 20, 70);
//     doc.save("Petition_for_Divorce.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between gap-x-2 items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Petition for Divorce</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Petitioner Name" placeholder="Enter your full name" value={petitionerName} onChange={(e) => setPetitionerName(e.target.value)} className="mb-4" />
//       <Input label="Respondent Name" placeholder="Enter your spouse's full name" value={respondentName} onChange={(e) => setRespondentName(e.target.value)} className="mb-4" />
//       <Input label="Date of Marriage" type="date" value={marriageDate} onChange={(e) => setMarriageDate(e.target.value)} className="mb-4" />
//       <Textarea label="Grounds for Divorce" placeholder="Specify the grounds for divorce" value={groundsForDivorce} onChange={(e) => setGroundsForDivorce(e.target.value)} rows={5} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// };

// const ChildCustodyAgreementForm = ({ onClose }) => {
//   const [parent1Name, setParent1Name] = useState('');
//   const [parent2Name, setParent2Name] = useState('');
//   const [childName, setChildName] = useState('');
//   const [custodyTerms, setCustodyTerms] = useState('');
//   const [visitationSchedule, setVisitationSchedule] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Child Custody Agreement", 20, 20);
//     doc.text(`Parent 1: ${parent1Name}`, 20, 40);
//     doc.text(`Parent 2: ${parent2Name}`, 20, 50);
//     doc.text(`Child's Name: ${childName}`, 20, 60);
//     doc.text(`Custody Terms: ${custodyTerms}`, 20, 70);
//     doc.text(`Visitation Schedule: ${visitationSchedule}`, 20, 80);
//     doc.save("Child_Custody_Agreement.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-scroll h-screen bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between gap-x-2 items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Child Custody Agreement</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Parent 1 Name" placeholder="Enter Parent 1 Name" value={parent1Name} onChange={(e) => setParent1Name(e.target.value)} className="mb-4" />
//       <Input label="Parent 2 Name" placeholder="Enter Parent 2 Name" value={parent2Name} onChange={(e) => setParent2Name(e.target.value)} className="mb-4" />
//       <Input label="Child's Name" placeholder="Enter Child's Name" value={childName} onChange={(e) => setChildName(e.target.value)} className="mb-4" />
//       <Textarea label="Custody Terms" placeholder="Enter Custody Terms" value={custodyTerms} onChange={(e) => setCustodyTerms(e.target.value)} rows={5} className="mb-4" />
//       <Textarea label="Visitation Schedule" placeholder="Enter Visitation Schedule" value={visitationSchedule} onChange={(e) => setVisitationSchedule(e.target.value)} rows={5} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// };

// const ChildSupportWorksheetForm = ({ onClose }) => {
//   const [parent1Income, setParent1Income] = useState('');
//   const [parent2Income, setParent2Income] = useState('');
//   const [numberOfChildren, setNumberOfChildren] = useState('');
//   const [healthInsuranceCosts, setHealthInsuranceCosts] = useState('');
//   const [childcareCosts, setChildcareCosts] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Child Support Calculation Worksheet", 20, 20);
//     doc.text(`Parent 1 Income: ${parent1Income}`, 20, 40);
//     doc.text(`Parent 2 Income: ${parent2Income}`, 20, 50);
//     doc.text(`Number of Children: ${numberOfChildren}`, 20, 60);
//     doc.text(`Health Insurance Costs: ${healthInsuranceCosts}`, 20, 70);
//     doc.text(`Childcare Costs: ${childcareCosts}`, 20, 80);
//     doc.save("Child_Support_Worksheet.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform overflow-y-scroll -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between gap-x-2 items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Child Support Worksheet</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Parent 1 Income" type="number" placeholder="Enter Parent 1 Income" value={parent1Income} onChange={(e) => setParent1Income(e.target.value)} className="mb-4" />
//       <Input label="Parent 2 Income" type="number" placeholder="Enter Parent 2 Income" value={parent2Income} onChange={(e) => setParent2Income(e.target.value)} className="mb-4" />
//       <Input label="Number of Children" type="number" placeholder="Enter Number of Children" value={numberOfChildren} onChange={(e) => setNumberOfChildren(e.target.value)} className="mb-4" />
//       <Input label="Health Insurance Costs" type="number" placeholder="Enter Health Insurance Costs" value={healthInsuranceCosts} onChange={(e) => setHealthInsuranceCosts(e.target.value)} className="mb-4" />
//       <Input label="Childcare Costs" type="number" placeholder="Enter Childcare Costs" value={childcareCosts} onChange={(e) => setChildcareCosts(e.target.value)} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// };

// // --- Small Claims Forms ---
// const StatementOfClaimForm = ({ onClose }) => {
//   const [claimantName, setClaimantName] = useState('');
//   const [defendantName, setDefendantName] = useState('');
//   const [amountClaimed, setAmountClaimed] = useState('');
//   const [incidentDate, setIncidentDate] = useState('');
//   const [description, setDescription] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Statement of Claim", 20, 20);
//     doc.text(`Claimant: ${claimantName}`, 20, 40);
//     doc.text(`Defendant: ${defendantName}`, 20, 50);
//     doc.text(`Amount Claimed: ${amountClaimed}`, 20, 60);
//     doc.text(`Date of Incident: ${incidentDate}`, 20, 70);
//     doc.text(`Description: ${description}`, 20, 80);
//     doc.save("Statement_of_Claim.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md z-50">
//       <div className="flex justify-between gap-x-2 items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Statement of Claim</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Claimant Name" placeholder="Enter your full name" value={claimantName} onChange={(e) => setClaimantName(e.target.value)} className="mb-4" />
//       <Input label="Defendant Name" placeholder="Enter the defendant's full name" value={defendantName} onChange={(e) => setDefendantName(e.target.value)} className="mb-4" />
//       <Input label="Amount Claimed" type="number" placeholder="Enter the amount claimed" value={amountClaimed} onChange={(e) => setAmountClaimed(e.target.value)} className="mb-4" />
//       <Input label="Date of Incident" type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} className="mb-4" />
//       <Textarea label="Description" placeholder="Describe the incident" value={description} onChange={(e) => setDescription(e.target.value)} rows={5} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// };

// const NoticeOfHearingForm = ({ onClose }) => {
//   const [courtName, setCourtName] = useState('');
//   const [caseNumber, setCaseNumber] = useState('');
//   const [hearingDate, setHearingDate] = useState('');
//   const [hearingTime, setHearingTime] = useState('');
//   const [location, setLocation] = useState('');
//   const [purpose, setPurpose] = useState('');

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.text("Notice of Hearing", 20, 20);
//     doc.text(`Court Name: ${courtName}`, 20, 40);
//     doc.text(`Case Number: ${caseNumber}`, 20, 50);
//     doc.text(`Hearing Date: ${hearingDate}`, 20, 60);
//     doc.text(`Hearing Time: ${hearingTime}`, 20, 70);
//     doc.text(`Location: ${location}`, 20, 80);
//     doc.text(`Purpose: ${purpose}`, 20, 90);
//     doc.save("Notice_of_Hearing.pdf");
//     onClose();
//   };

//   return (
//     <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 max-w-md max-h-screen m-1 overflow-y-scroll z-50">
//       <div className="flex justify-between gap-x-2 items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800">Generate Notice of Hearing</h2>
//         <Button size="sm" onClick={onClose}><BsFillXCircleFill /></Button>
//       </div>
//       <Input label="Court Name" placeholder="Enter the name of the court" value={courtName} onChange={(e) => setCourtName(e.target.value)} className="mb-4" />
//       <Input label="Case Number" placeholder="Enter the case number" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} className="mb-4" />
//       <Input label="Hearing Date" type="date" value={hearingDate} onChange={(e) => setHearingDate(e.target.value)} className="mb-4" />
//       <Input label="Hearing Time" type="time" value={hearingTime} onChange={(e) => setHearingTime(e.target.value)} className="mb-4" />
//       <Input label="Location" placeholder="Enter the hearing location" value={location} onChange={(e) => setLocation(e.target.value)} className="mb-4" />
//       <Textarea label="Purpose of Hearing" placeholder="Describe the purpose of the hearing" value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={5} className="mb-4" />
//       <Button onClick={generatePDF} className="w-full">Generate PDF</Button>
//     </div>
//   );
// };
import React, { useEffect, useState } from "react";
import jsPDF from 'jspdf';
import { Form, useActionData, useNavigation } from "react-router-dom"; // Updated for modern usage
import customFetch from '../utils/customFetch'
export const action = async ({ request }) => {
  const formdata = await request.formData();
  
  // Convert FormData to object with trimmed values
  const data = Object.fromEntries(formdata);

  

  try {
    const res = await customFetch.post('/docs', data)
    console.log(res);
    return res.data.draft;
  } catch (error) {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });
    
    return {
      error: error.response?.data?.message || 
            `Document generation failed (${error.response?.status || 'no status'})`
    };
  }
};
const basicMarkdownToHtml = (markdown) => {
  let html = markdown;

  // Basic heading replacement (atx style)
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');

  // Basic bold and italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>');
  html = html.replace(/\*(.*?)\*/gim, '<i>$1</i>');
  html = html.replace(/__(.*?)__/gim, '<b>$1</b>'); // Alternative bold
  html = html.replace(/_(.*?)_/gim, '<i>$1</i>');   // Alternative italic

  // Basic unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  const ulRegex = /^(<li>.*?<\/li>\n*)+/gim;
  html = html.replace(ulRegex, '<ul>$&</ul>');

  // Basic line breaks (two spaces at the end of a line)
  html = html.replace(/  \n/g, '<br />\n');

  // Preserve newlines for other content
  html = html.replace(/\n/g, '<br />\n');

  return html;
};
// Assuming you are using React Router
const LegalAssistant = () => {
  const [type, setDocumentType] = useState("");
  const [language, setLanguage] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const data = useActionData();
// console.log(data);
  const [formData, setFormData] = useState({
    description: "",
    policeStation: "",
    name: "",
    address: "",
    contact: "",
    occupation: "",
    accusedName: "",
    accusedAddress: "",
    relationshipToComplainant: "",
    incidentDate: "",
    incidentTime: "",
    incidentPlace: "",
    natureOfOffense: "",
    witnesses: "",
    evidence: "",
    actionRequest: "",
    fullName: "",
    fatherOrHusbandName: "",
    rtiAddress: "",
    pinCode: "",
    officePhone: "",
    residencePhone: "",
    mobile: "",
    isBPL: "",
    feeDetails: {
      paymentMode: "",
      refNumber: "",
      paymentDate: "",
      issuingAuthority: "",
      amount: ""
    },
    infoRequired: "",
    preferredFormat: "",
    place: "",
    date: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeeDetailsChange = (e) => {
    setFormData({
      ...formData,
      feeDetails: {
        ...formData.feeDetails,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleGenerate = (e) => {
    return setShowPreview(true)
    // If validation passes, the form will submit and the action will be called
    // After the action returns data, the 'data' state will be updated
  };

  // const handleDownload = () => {
  //   if (data) {
  //     const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = `legal_document.${language === 'Hindi' ? 'pdf' : 'pdf'}`; // You might want to adjust the filename
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   }
  // };
const handleDownload = () => {
  if (data) {
    const doc = new jsPDF('p', 'mm', 'a4'); // 'a4' specifies the A4 page size
    doc.text(data, 10, 10);
    doc.save(`legal_document.pdf`);
  }
};


  // useEffect(() => {
  //   if (data) {
  //     setShowPreview(true);
  //   } else {
  //     setShowPreview(false);
  //   }
  // }, [data]);

  const cardData = [
    {
      head: "Police & Criminal Matters",
      i1: "/c1.png",
      i2: "/c2.png",
      i3: "/c3.png",
      g: "/1st2.png",
      h1: "First Information Report (FIR)",
      h2: "Police Complaint",
      h3: "Missing Person Report",
    },
    {
      head: "Government Requests",
      i1: "/c4.png",
      i2: "/c5.png",
      i3: "/c6.png",
      g: "/2nd.png",
      h1: "RTI Application",
      h2: "Public Grievance Petition",
      h3: "Government Service Complaint",
    },
    {
      head: "Civil Matters",
      i1: "/c7.png",
      i2: "/c8.png",
      i3: "/c9.png",
      g: "/3rd.png",
      h1: "Consumer Complaint",
      h2: "Tenant/Landlord Notices",
      h3: "Small Cases Filing",
    },
    {
      head: "Personal & Legal Documents",
      i1: "/c10.png",
      i2: "/c11.png",
      i3: "/c12.png",
      g: "/4th.png",
      h1: "Affidavit Template",
      h2: "Legal Notice Format",
      h3: "Power of Attorney",
    },
  ];
const navigation = useNavigation()
  return (
  <>
  <div className="flex gap-4 justify-evenly pb-12 items-center mt-12">
    {cardData.map((item, index) => {
      const { head, g, h1, h2, h3, i1, i2, i3 } = item;
      return (
        <div
          key={index}
          className="min-w-[22vw] bg-white shadow-sm hover:shadow-xl transition-all duration-300 min-h-[52vh] border-t-4 rounded-[8px] border-blue-900"
        >
          <div className="flex flex-col justify-center items-start p-5">
            <div className="flex gap-x-3 max-w-[20vw] justify-start mt-4 items-center">
              <img src={g} alt="category-icon" className="h-[45px] w-[45px]" />
              <h1 className="font-bold text-[20px] leading-[20px] ml-1 text-[#0A2342]">{head}</h1>
            </div>
            <div className="mt-8 mx-3 flex flex-col gap-y-2 justify-center min-w-[16vw] max-w-[18vw] items-start">
              {[{ icon: i1, text: h1 }, { icon: i2, text: h2 }, { icon: i3, text: h3 }].map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center justify-center mt-5">
                  <img src={item.icon} alt="icon" className="w-[18px] h-[18px]" />
                  <h1 className="text-[16px] font-normal leading-[20px] text-[#000000]">{item.text}</h1>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    })}
  </div>

  <div className="p-6 max-w-[800px] mx-auto flex flex-col items-center">
    <h1 className="text-2xl font-bold mb-4">Create Legal Document</h1>
    <p className="text-sm text-red-600 mb-4">⚠️ All fields are compulsory. Please fill them carefully.</p>

    <Form method="post" onSubmit={handleGenerate} className="space-y-4 w-full">
      <div>
        <label>Select Document Type</label>
        <select name="type" value={type} onChange={(e) => setDocumentType(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Document Type</option>
          <option value="FIR">FIR</option>
          <option value="RTI">RTI</option>
        </select>
      </div>

      <div>
        <label>Select Language</label>
        <select name="language" value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 border rounded" required>
          <option value="">Select Language</option>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>

      {type === "FIR" && (
        <>
          {[
            { name: "description", type: "textarea" },
            { name: "policeStation" },
            { name: "name" },
            { name: "address" },
            { name: "contact" },
            { name: "occupation" },
            { name: "accusedName" },
            { name: "accusedAddress" },
            { name: "relationshipToComplainant" },
            { name: "incidentDate", type: "date" },
            { name: "incidentTime", type: "time" },
            { name: "incidentPlace" },
            { name: "natureOfOffense" },
            { name: "witnesses", type: "textarea" },
            { name: "evidence", type: "textarea" },
            { name: "actionRequest", type: "textarea" },
          ].map(({ name, type = "text" }) => (
            <div key={name}>
              <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
              {type === "textarea" ? (
                <textarea name={name} required placeholder={name.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full p-2 border rounded" />
              ) : (
                <input name={name} type={type} required placeholder={name.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full p-2 border rounded" />
              )}
            </div>
          ))}
        </>
      )}

      {type === "RTI" && (
        <>
          {[
            "fullName",
            "fatherOrHusbandName",
            "rtiAddress",
            "pinCode",
            "officePhone",
            "residencePhone",
            "mobile",
            "isBPL",
          ].map((name) => (
            <div key={name}>
              <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
              <input name={name} required placeholder={name.replace(/([A-Z])/g, ' $1')} onChange={handleChange} className="w-full p-2 border rounded" />
            </div>
          ))}

          <div className="space-y-4 p-4 border rounded">
            <h3 className="font-bold">Fee Details</h3>
            {[
              { name: "paymentMode", type: "select", options: ["Demand Draft", "Banker's Cheque", "Cash", "Online Payment"] },
              { name: "refNumber" },
              { name: "paymentDate", type: "date" },
              { name: "issuingAuthority" },
              { name: "amount", type: "number" },
            ].map(({ name, type = "text", options }) => (
              <div key={name}>
                <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
                {type === "select" ? (
                  <select name={name} required value={formData.feeDetails[name]} onChange={handleFeeDetailsChange} className="w-full p-2 border rounded">
                    <option value="">Select {name.replace(/([A-Z])/g, ' $1')}</option>
                    {options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={name}
                    type={type}
                    placeholder={name.replace(/([A-Z])/g, ' $1')}
                    value={formData.feeDetails[name]}
                    required
                    onChange={handleFeeDetailsChange}
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>
            ))}
          </div>

          {["infoRequired", "preferredFormat", "place", "date"].map((name) => (
            <div key={name}>
              <label className="capitalize">{name.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={name} required
                type={name === "date" ? "date" : "text"}
                placeholder={name.replace(/([A-Z])/g, ' $1')}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </>
      )}

      <div className="flex justify-center items-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {navigation.state === 'submitting' ? "Generating" : "Generate"}
        </button>
      </div>
    </Form>

    {data && (
      <div className="mt-8 p-6 rounded border border-gray-400 shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Preview</h2>
        <div
          className="whitespace-pre-wrap flex justify-center items-center"
          dangerouslySetInnerHTML={{ __html: basicMarkdownToHtml(data) }}
        />
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Download
        </button>
      </div>
    )}
  </div>
</>

  );
};

export default LegalAssistant;



