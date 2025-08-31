import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiGithub } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
          
          {/* Logo / Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">AI ML Playground</h2>
            <p className="text-gray-400 mt-1 text-sm">Learning, building, innovating.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <Link href="/profile" className="hover:text-blue-500 transition-colors">Profile</Link>
            <Link href="/projects" className="hover:text-blue-500 transition-colors">Projects</Link>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col space-y-2 text-center md:text-left">
            <h3 className="font-semibold text-white">Connect</h3>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="hover:text-blue-500 transition-colors"><FiFacebook size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><FiTwitter size={20} /></a>
              <a href="#" className="hover:text-blue-700 transition-colors"><FiLinkedin size={20} /></a>
              <a href="#" className="hover:text-gray-100 transition-colors"><FiGithub size={20} /></a>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-6"></div>

        {/* Copyright */}
        <p className="text-center text-gray-500 text-sm mt-4">
          &copy; {new Date().getFullYear()} AI ML Playground. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
