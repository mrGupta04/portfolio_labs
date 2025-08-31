import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FiCode, FiCpu, FiUsers, FiStar, FiAward, FiTrendingUp, FiArrowRight, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Home() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Create Your Profile",
      description: "Showcase your skills, experience, and projects in a professional portfolio with interactive elements and live demos.",
      color: "from-blue-500 to-blue-700"
    },
    {
      icon: <FiCpu className="w-8 h-8" />,
      title: "AI Projects Showcase",
      description: "Display your machine learning models, datasets, and research findings with integrated code viewers and model demonstrations.",
      color: "from-green-500 to-green-700"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Connect & Collaborate",
      description: "Network with other AI enthusiasts, join communities, collaborate on projects, and get discovered by top tech companies.",
      color: "from-purple-500 to-purple-700"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Developers", icon: <FiTrendingUp className="w-5 h-5" /> },
    { number: "25K+", label: "AI Projects", icon: <FiCode className="w-5 h-5" /> },
    { number: "5K+", label: "Job Placements", icon: <FiAward className="w-5 h-5" /> },
    { number: "99.9%", label: "Platform Uptime", icon: <FiStar className="w-5 h-5" /> }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: "ML Engineer at Google",
      content: "This platform helped me showcase my TensorFlow projects and land my dream job at Google!",
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Sarah Chen",
      role: "AI Researcher",
      content: "The collaboration features are amazing. I found my current research team through this platform.",
      avatar: "/api/placeholder/40/40"
    },
    {
      name: "Mike Rodriguez",
      role: "Data Scientist",
      content: "My recruitment increased by 200% after creating my portfolio here. Highly recommended!",
      avatar: "/api/placeholder/40/40"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="absolute top-0 right-0 -mt-16 mr-[-10rem] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 left-0 -mt-16 ml-[-10rem] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 right-0 -mb-16 mr-[-10rem] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 mb-8 animate-pulse">
                <FiStar className="w-4 h-4 mr-2" />
                Trusted by AI developers worldwide
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to AI ML Intern
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}Playground
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                The perfect platform to showcase your AI and Machine Learning projects, 
                connect with other developers, and advance your career in artificial intelligence.
              </p>

              {session ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                    Welcome back, {session.user.name}! 👋
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Ready to continue building your AI portfolio?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link 
                      href="/profile" 
                      className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <span>View Profile</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/projects" 
                      className="group relative bg-white text-gray-800 border-2 border-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <span>My Projects</span>
                      <FiTrendingUp className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                    Get Started Today
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Sign in or create an account to start building your AI portfolio
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Link 
                      href="/auth/signin" 
                      className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <span>Sign In</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/auth/register" 
                      className="group relative bg-white text-gray-800 border-2 border-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <span>Register</span>
                      <FiAward className="w-5 h-5" />
                    </Link>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Join thousands of AI enthusiasts already using our platform
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Succeed in AI
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for machine learning practitioners and AI enthusiasts
            </p>
          </div>

          {/* Feature Carousel */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} text-white mr-4`}>
                  {features[activeFeature].icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">{features[activeFeature].title}</h3>
              </div>
              <p className="text-gray-600 text-lg">{features[activeFeature].description}</p>
              <div className="flex mt-6 space-x-2">
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFeature(index)}
                    className={`w-3 h-3 rounded-full ${index === activeFeature ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-2xl border transition-all duration-300 transform hover:-translate-y-1 ${
                  index === activeFeature 
                    ? 'bg-white shadow-xl border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white inline-block mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Users Say
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied AI developers who have advanced their careers with our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-blue-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Launch Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  AI Career?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of AI developers who have transformed their portfolios 
                and landed dream jobs at top tech companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth/register" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Get Started Free</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/auth/signin" 
                  className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  Sign In Existing Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

     
    </div>
  );
}