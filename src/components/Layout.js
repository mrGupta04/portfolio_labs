import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiUser, FiBriefcase, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import Footer from './Footer';

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [imageError, setImageError] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: <FiHome className="w-5 h-5" /> },
    { href: '/profile', label: 'Profile', icon: <FiUser className="w-5 h-5" /> },
    { href: '/projects', label: 'Projects', icon: <FiBriefcase className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <span className="ml-2">AI ML Playground</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center text-slate-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-slate-100"
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {session ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-slate-100 rounded-full pl-1 pr-3 py-1">
                    {session.user.image && !imageError ? (
                      <div className="relative w-8 h-8">
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          fill
                          className="rounded-full object-cover"
                          onError={() => setImageError(true)}
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {session.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-slate-700 text-sm hidden lg:block">
                      {session.user.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-300 transition-all duration-200"
                  >
                    <FiLogOut className="w-4 h-4 mr-1" />
                    <span className="hidden sm:block">Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex space-x-2">
                  <button
                    onClick={() => signIn()}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FiLogIn className="w-4 h-4 mr-1" />
                    <span>Sign In</span>
                  </button>
                  <Link
                    href="/auth/register"
                    className="flex items-center bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all duration-200"
                  >
                    <FiUserPlus className="w-4 h-4 mr-1" />
                    <span>Register</span>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-200 transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-inner">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span className="ml-3">{link.label}</span>
                </Link>
              ))}

              {!session && (
                <div className="flex flex-col space-y-2 mt-4 px-2">
                  <button
                    onClick={() => {
                      signIn();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    <FiLogIn className="w-5 h-5 mr-2" />
                    <span>Sign In</span>
                  </button>
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center w-full bg-white text-blue-600 border border-blue-600 px-4 py-3 rounded-lg text-base font-medium hover:bg-blue-50 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FiUserPlus className="w-5 h-5 mr-2" />
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content - Full Width */}
      <main className="flex-1 w-full">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}