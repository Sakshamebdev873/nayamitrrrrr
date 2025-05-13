import React, { useEffect, useState } from "react";
import { Form, useActionData, useLoaderData, useNavigation, useParams } from "react-router";
import customFetch from "../utils/customFetch";
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, FileText, ListChecks, FileSearch, RotateCw } from 'lucide-react';
export const action = async ({ request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    const res = await customFetch.post("/caseHelper", data);
    toast.success("Successfully Generated the Case Guide");
    console.log(res);
    return res.data;
  } catch (error) {
    toast.error("Error in Generating Case Guide....");
    console.log(error);
    return error;
  }
};




// Helper to remove "**" and apply bold formatting
const formatMarkdownText = (text) => {
  return text.split(/\*\*(.*?)\*\*/g).map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : part
  );
};

const RenderMarkdown = ({ content }) => {
  if (!content) return null;

  return content.split('\n').map((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2); // remove "- " or "* "
      return (
        <motion.li
          key={i}
          className="flex items-start mb-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <ChevronRight className="text-[#3c32b5] w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
          <span>{formatMarkdownText(itemText)}</span>
        </motion.li>
      );
    }

    if (trimmed === '') return <br key={i} />;

    return (
      <motion.p
        key={i}
        className="mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05 }}
      >
        {formatMarkdownText(trimmed)}
      </motion.p>
    );
  });
};

// export default RenderMarkdown;

const CaseHelper = () => {
  const navigation = useNavigation();
  const { id } = useParams();
  const actionData = useActionData();
  const [activeTab, setActiveTab] = useState('procedure');
  
  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold text-[#3c32b5] text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {actionData ? 'Your Case Guide' : 'Step 1: Enter the Case Data'}
        </motion.h1>
        
        <AnimatePresence mode="wait">
          {actionData ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'procedure', icon: <FileText className="w-5 h-5 mr-2" />, label: 'Procedure' },
                  { id: 'nextMoves', icon: <ListChecks className="w-5 h-5 mr-2" />, label: 'Next Steps' },
                  { id: 'assistingDocuments', icon: <FileSearch className="w-5 h-5 mr-2" />, label: 'Documents' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center py-4 px-6 font-medium transition-colors ${activeTab === tab.id ? 'text-[#3c32b5] border-b-2 border-[#3c32b5]' : 'text-gray-500 hover:text-[#3c32b5]'}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* Tab Content */}
              <div className="p-8 min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="prose max-w-none"
                  >
                    {activeTab === 'procedure' && (
                      <>
                        <h2 className="text-2xl font-bold text-[#3c32b5] mb-6 flex items-center">
                          <FileText className="mr-3" />
                          Legal Procedure Roadmap
                        </h2>
                        <ul className="space-y-3 pl-0">
                          <RenderMarkdown content={actionData.procedure} />
                        </ul>
                      </>
                    )}
                    
                    {activeTab === 'nextMoves' && (
                      <>
                        <h2 className="text-2xl font-bold text-[#3c32b5] mb-6 flex items-center">
                          <ListChecks className="mr-3" />
                          Recommended Next Steps
                        </h2>
                        <ul className="space-y-3 pl-0">
                          <RenderMarkdown content={actionData.nextMoves} />
                        </ul>
                      </>
                    )}
                    
                    {activeTab === 'assistingDocuments' && (
                      <>
                        <h2 className="text-2xl font-bold text-[#3c32b5] mb-6 flex items-center">
                          <FileSearch className="mr-3" />
                          Key Supporting Documents
                        </h2>
                        <ul className="space-y-3 pl-0">
                          <RenderMarkdown content={actionData.assistingDocuments} />
                        </ul>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-6 py-3 bg-[#3c32b5] text-white rounded-lg font-medium shadow-md hover:bg-[#2a2480] transition-colors"
                  onClick={() => window.location.reload()}
                >
                  <RotateCw className="mr-2" />
                  Start New Case
                </motion.button>
              </div>
            </motion.div>
          ) : (
        <motion.div
  key="form"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-10"
>
  <Form method="POST" className="space-y-6">
    <h1 className="text-2xl font-bold text-[#3c32b5] text-center mb-4">
      Initialize the Case
    </h1>

    <input
      type="text"
      name="userId"
      id="userId"
      value={id}
      hidden
      readOnly
    />

    {/* Case Type */}
    <div>
      <label htmlFor="caseType" className="block text-sm font-medium text-gray-700 mb-1">
        Case Type
      </label>
      <select
        name="caseType"
        id="caseType"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select a case type</option>
        <option value="Eviction">Eviction</option>
        <option value="Property Dispute">Property Dispute</option>
        <option value="Divorce">Divorce</option>
        <option value="Child Custody">Child Custody</option>
        <option value="Domestic Violence">Domestic Violence</option>
        <option value="Cheque Bounce">Cheque Bounce</option>
        <option value="Consumer Complaint">Consumer Complaint</option>
        <option value="RTI Appeal">RTI Appeal</option>
        <option value="Criminal Complaint">Criminal Complaint</option>
        <option value="Civil Suit">Civil Suit</option>
        <option value="Bail Application">Bail Application</option>
        <option value="Maintenance">Maintenance</option>
        <option value="Inheritance Dispute">Inheritance Dispute</option>
        <option value="Service Matter">Service Matter</option>
        <option value="Writ Petition">Writ Petition</option>
        <option value="Appeal">Appeal</option>
        <option value="Defamation">Defamation</option>
        <option value="Land Acquisition">Land Acquisition</option>
      </select>
    </div>

    {/* Case Stage */}
    <div>
      <label htmlFor="caseStage" className="block text-sm font-medium text-gray-700 mb-1">
        Case Stage
      </label>
      <select
        name="caseStage"
        id="caseStage"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select a case stage</option>
        <option value="new_case">New Case</option>
        <option value="pre_filing">Pre-filing</option>
        <option value="filed">Filed</option>
        <option value="discovery">Discovery</option>
        <option value="trial_scheduled">Trial Scheduled</option>
        <option value="judgment_issued">Judgment Issued</option>
        <option value="appeal_started">Appeal Started</option>
        <option value="appeal_pending">Appeal Pending</option>
        <option value="appeal_decided">Appeal Decided</option>
      </select>
    </div>

    {/* Jurisdiction */}
    <div>
      <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 mb-1">
        Jurisdiction
      </label>
      <select
        name="jurisdiction"
        id="jurisdiction"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select a jurisdiction</option>
        <option value="District Court">District Court</option>
        <option value="Sessions Court">Sessions Court</option>
        <option value="High Court">High Court</option>
        <option value="Supreme Court">Supreme Court</option>
        <option value="Consumer Court">Consumer Court</option>
        <option value="Family Court">Family Court</option>
        <option value="Civil Court">Civil Court</option>
        <option value="Criminal Court">Criminal Court</option>
        <option value="Tribunal">Tribunal</option>
        <option value="Lok Adalat">Lok Adalat</option>
        <option value="Labour Court">Labour Court</option>
        <option value="Motor Accident Claims Tribunal">Motor Accident Claims Tribunal</option>
        <option value="Revenue Court">Revenue Court</option>
        <option value="RTI Authority">RTI Authority</option>
      </select>
    </div>

    {/* Representation Type */}
    <div>
      <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
        Representation Type
      </label>
      <select
        name="userRole"
        id="userRole"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Select representation</option>
        <option value="self_represented">Self-Represented</option>
        <option value="lawyer_assisted">Lawyer-Assisted</option>
      </select>
    </div>

    {/* Case Description */}
    <div>
      <label htmlFor="caseFacts" className="block text-sm font-medium text-gray-700 mb-1">
        Case Description
      </label>
      <textarea
        id="caseFacts"
        name="caseFacts"
        placeholder="Enter detailed case facts here"
        required
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        rows={6}
      />
    </div>

    {/* Submit Button */}
    <div className="flex justify-center pt-4">
      <button
        type="submit"
        className="bg-[#3c32b5] hover:bg-[#2b2799] text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
      >
        {navigation.state === "submitting" ? "Generating..." : "Generate"}
      </button>
    </div>
  </Form>

</motion.div>


          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CaseHelper;
   