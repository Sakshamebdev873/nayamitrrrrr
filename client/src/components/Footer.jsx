import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-blue-900/90 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Column 1: Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-blue-400" /> +91 12345 67890
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-blue-400" /> support@example.com
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-400" /> New Delhi, India
            </li>
          </ul>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-blue-400 cursor-pointer">Legal Services</li>
            <li className="hover:text-blue-400 cursor-pointer">Documents</li>
            <li className="hover:text-blue-400 cursor-pointer">FAQs</li>
            <li className="hover:text-blue-400 cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        {/* Column 3: Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-600">
              <FaLinkedinIn />
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} LegalEase. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
