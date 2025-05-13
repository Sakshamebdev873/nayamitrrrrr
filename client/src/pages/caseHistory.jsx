import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import customFetch from "../utils/customFetch";
import { FileText, Filter, RotateCw, AlertCircle } from "lucide-react";

export const loader = async ({ params }) => {
  try {
    const { id } = params;
    const res = await customFetch.get(`/caseHistory/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

const renderMarkdown = (text) => {
  if (!text) return null;

  return text.split('\n').map((line, idx) => {
    const cleanLine = line.replace(/\*\*/g, "").trim();

    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <motion.li 
          key={idx} 
          className="mb-1 list-disc ml-4 text-sm text-gray-700"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
        >
          {cleanLine.substring(2)}
        </motion.li>
      );
    }

    // Make first line bold as a heading
    if (idx === 0) {
      return (
        <motion.p 
          key={idx} 
          className="text-sm font-semibold text-gray-800 mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {cleanLine}
        </motion.p>
      );
    }

    return (
      <motion.p 
        key={idx} 
        className="text-sm text-gray-600 mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: idx * 0.05 }}
      >
        {cleanLine}
      </motion.p>
    );
  });
};

const CaseHistory = () => {
  const { cases } = useLoaderData();
  const [isResetting, setIsResetting] = useState(false);
  const [filters, setFilters] = useState({
    caseType: "",
    caseStage: "",
    jurisdiction: "",
  });

  const filteredCases = cases.filter((c) => {
    return (
      (!filters.caseType || c.caseType === filters.caseType) &&
      (!filters.caseStage || c.caseStage === filters.caseStage) &&
      (!filters.jurisdiction || c.jurisdiction === filters.jurisdiction)
    );
  });

  const unique = (field) => [...new Set(cases.map((c) => c[field]))];

  const resetFilters = () => {
    setIsResetting(true);
    setTimeout(() => {
      setFilters({
        caseType: "",
        caseStage: "",
        jurisdiction: "",
      });
      setIsResetting(false);
    }, 300);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1 
        className="text-2xl font-bold mb-6 text-[#3c32b5]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Case History
      </motion.h1>

     
       <motion.div 
  className="bg-white rounded-xl shadow-md p-6 mb-8"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.1 }}
>
  <div className="flex flex-wrap items-center gap-4 mb-4">
    <Filter className="text-gray-500" />
    <h2 className="text-lg font-medium text-gray-700">Filter Cases</h2>
  </div>

  <div className="flex flex-wrap items-center gap-4">
    <motion.div className="relative" whileHover={{ scale: 1.02 }}>
      <select
        value={filters.caseType}
        onChange={(e) => setFilters({ ...filters, caseType: e.target.value })}
        className="appearance-none border border-gray-300 pl-3 pr-8 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#3c32b5] focus:border-[#3c32b5] w-full"
      >
        <option value="">All Case Types</option>
        {unique("caseType").map((type, idx) => (
          <option key={idx} value={type}>
            {type}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </motion.div>

    <motion.div className="relative" whileHover={{ scale: 1.02 }}>
      <select
        value={filters.caseStage}
        onChange={(e) => setFilters({ ...filters, caseStage: e.target.value })}
        className="appearance-none border border-gray-300 pl-3 pr-8 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#3c32b5] focus:border-[#3c32b5] w-full"
      >
        <option value="">All Case Stages</option>
        {unique("caseStage").map((stage, idx) => (
          <option key={idx} value={stage}>
            {stage}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </motion.div>

    <motion.div className="relative" whileHover={{ scale: 1.02 }}>
      <select
        value={filters.jurisdiction}
        onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
        className="appearance-none border border-gray-300 pl-3 pr-8 py-2 rounded-md text-sm focus:ring-2 focus:ring-[#3c32b5] focus:border-[#3c32b5] w-full"
      >
        <option value="">All Jurisdictions</option>
        {unique("jurisdiction").map((jur, idx) => (
          <option key={idx} value={jur}>
            {jur}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </motion.div>

    <motion.button
      onClick={resetFilters}
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#3c32b5] transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RotateCw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
      Reset Filters
    </motion.button>
  </div>
</motion.div>
      <AnimatePresence>
        {filteredCases.length === 0 ? (
          <motion.div
            className="bg-white rounded-xl shadow-md p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex flex-col items-center justify-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No cases found
              </h3>
              <p className="text-gray-500 mb-4">
                {cases.length === 0 
                  ? "You haven't created any cases yet. Start by creating your first case."
                  : "No cases match your current filters. Try adjusting your search criteria."}
              </p>
              {cases.length > 0 && (
                <motion.button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-[#3c32b5] text-white rounded-md hover:bg-[#2a2480] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Show All Cases
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {filteredCases.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.01 }}
                className="rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="text-[#3c32b5]" />
                    <h2 className="text-lg font-semibold text-[#3c32b5]">
                      {item.caseType}
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <motion.button 
                      className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Update
                    </motion.button>
                    <motion.button 
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      <strong>Jurisdiction:</strong> {item.jurisdiction}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Stage:</strong> {item.caseStage}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      <strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-800">
                    <strong>Case Facts:</strong> {item.caseFacts}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-[#3c32b5] mb-2">Procedure:</p>
                    <ul className="pl-4">{renderMarkdown(item.procedure)}</ul>
                  </div>

                  <div>
                    <p className="font-semibold text-[#3c32b5] mb-2">Next Moves:</p>
                    <ul className="pl-4">{renderMarkdown(item.nextMoves)}</ul>
                  </div>

                  <div>
                    <p className="font-semibold text-[#3c32b5] mb-2">Supporting Documents:</p>
                    <ul className="pl-4">{renderMarkdown(item.assistingDocuments)}</ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CaseHistory;