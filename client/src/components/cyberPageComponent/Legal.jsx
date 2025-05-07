import { Gavel, Link as LinkIcon, ShieldAlert, UserX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/cards";

export function CyberLawCard() {
  return (
    <Card className="transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-800 flex items-center gap-2">
          <Gavel className="w-6 h-6" />
          Cyber Law & IT Act Essentials
        </CardTitle>
        <CardDescription className="text-gray-700">
          Key provisions of the <strong>Indian IT Act 2000</strong> that every digital citizen must know.
        </CardDescription>
      </CardHeader>

      <CardContent className="text-gray-800 space-y-4">
        <p>
          The <strong>Information Technology Act 2000</strong> lays the foundation for cyber law in India,
          addressing offenses related to digital communication, data protection, and cybercrime prevention.
        </p>

        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
            <span className="font-semibold">Section 65:</span> Tampering with computer source documents.
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-green-500 shadow-sm">
            <span className="font-semibold">Section 66:</span> Hacking and unauthorized access to data or systems.
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-yellow-500 shadow-sm flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-yellow-600 mt-1" />
            <span><span className="font-semibold">Section 66C:</span> Identity theft using password or digital signature.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-red-500 shadow-sm flex items-start gap-2">
            <UserX className="w-5 h-5 text-red-600 mt-1" />
            <span><span className="font-semibold">Section 66D:</span> Phishing or online cheating by personation.</span>
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-pink-500 shadow-sm">
            <span className="font-semibold">Section 67:</span> Publishing/transmitting obscene material electronically.
          </div>
          <div className="bg-white p-3 rounded-lg border-l-4 border-blue-500 shadow-sm">
            <span className="font-semibold">Section 72:</span> Breach of confidentiality and privacy by any intermediary.
          </div>
        </div>

        <a
          href="https://www.meity.gov.in/content/information-technology-act"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 underline mt-4 font-medium transition"
        >
          <LinkIcon className="w-4 h-4" />
          Learn more about the IT Act
        </a>
      </CardContent>
    </Card>
  );
}
