import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Users, MessageSquare, CheckSquare, Zap, Star, ArrowUp } from "lucide-react";

const useScrollAnimation = (threshold = 0.2) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [threshold]);

  return { ref: elementRef, isVisible };
};

const Button = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500"
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const FeatureCard = ({ card, index }) => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const IconComponent = card.icon;

  return (
    <div
      ref={ref}
      className={`group w-3/4 aspect-square ${card.bgColor} rounded-3xl border-0 shadow-lg backdrop-blur-sm mx-auto
        transform transition-all duration-700 ease-out hover:scale-[1.02] hover:shadow-2xl 
        hover:-translate-y-1 cursor-pointer overflow-hidden relative ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-12 opacity-0 scale-95'
        }`}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
    >
      <div className="p-6 md:p-8 relative w-full h-full flex flex-col bg-white rounded-lg shadow">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <IconComponent className="w-6 h-6 text-[#260f5c]" />
            </div>
            <h3 className="font-semibold text-[#260f5c] text-lg md:text-xl lg:text-2xl leading-tight mb-2">
              {card.title}
            </h3>
            <p className="text-[#260f5c]/80 text-sm md:text-base leading-relaxed">
              {card.description}
            </p>
          </div>

          {card.hasImage && card.image && (
            <div className="flex-1 flex items-end justify-center mt-auto">
              <img
                className="max-w-full max-h-[120px] object-contain transition-transform duration-500 group-hover:scale-110"
                alt="Feature illustration"
                src={card.image}
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ stat, index }) => {
  const { ref, isVisible } = useScrollAnimation(0.3);

  return (
    <div
      ref={ref}
      className={`text-center transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
      <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
    </div>
  );
};

export function LandingPage({ onLogin }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Help Center", href: "#help" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleGetStarted = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const stats = [
    { number: "50K+", label: "Business Users" },
    { number: "1M+", label: "Messages Daily" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" },
  ];

  const featureCards = [
    {
      title: "Instant Business Messaging",
      description: "Connect with your team instantly through secure, professional chat channels designed for business.",
      icon: Users,
      bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
      hasImage: true,
      image: "https://c.animaapp.com/meffifryXSAFwh/img/image-2.png",
    },
    {
      title: "Smart Chat Features",
      description: "Organize chats, suggest quick replies, and trigger simple workflows with rule-based automation.",
      icon: MessageSquare,
      bgColor: "bg-gradient-to-br from-purple-100 to-purple-200",
      hasImage: false,
    },
    {
      title: "Integrated Task Management",
      description: "Convert chat messages into actionable tasks and track progress without leaving the conversation.",
      icon: CheckSquare,
      bgColor: "bg-gradient-to-br from-green-100 to-green-200",
      hasImage: false,
    },
    {
      title: "Lightning Fast Performance",
      description: "Experience real-time messaging with instant delivery, read receipts, and seamless multi-device sync.",
      icon: Zap,
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-200",
      hasImage: true,
      image: "https://c.animaapp.com/meffifryXSAFwh/img/image-5.png",
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="bg-gray-50 min-h-screen w-full relative">
      {/* Floating Action Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#260f5c] text-white rounded-full shadow-lg hover:bg-[#1a0a3d] transition-all duration-300 ${
          isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}
      >
        <ArrowUp className="w-5 h-5 mx-auto" />
      </button>

      <div className="bg-white w-full mx-auto relative">
        {/* Navigation */}
        <nav className={`w-full h-20 sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-[#1b0b41]'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 h-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                CollabSpace
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className={`font-medium transition-colors hover:opacity-80 ${
                    isScrolled ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                  }`}
                >
                  {item.label}
                </a>
              ))}

              <Button 
                onClick={handleGetStarted}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all hover:scale-105 ${
                  isScrolled 
                    ? 'bg-[#260f5c] text-white hover:bg-[#1a0a3d]' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </nav>
        
        {/* Hero Section */}
        <header 
          className="w-full relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(to bottom right, #260f5c, #260f5c, #260f5c), url('./src/hooks/images/image-1.png')`,
            backgroundBlendMode: 'multiply, normal',
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center'
          }}
        >
        
                <div className="absolute inset-0 bg-black/40"></div>
                
                <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 text-center">
                <div className="mb-12">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Where Conversations
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Become Actions
                  </span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                  Streamline business communication with intelligent chat features that enhance team productivity and decision-making.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button className="px-8 py-4 bg-[#7A85C1] text-[#1A2A80] rounded-xl text-lg font-semibold hover:bg-[#6a74ad] hover:scale-105 transition-all shadow-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="outline" className="px-8 py-4 border-2 border-blue-400 bg-transparent text-blue-400 rounded-xl text-lg font-semibold hover:bg-blue-400 hover:text-white transition-all">
                  Watch Demo
                  </Button>
                </div>
                </section>

                {/* Stats Section */}
          <section className="relative z-10  border-white/10 py-16">
            <div className="max-w-6xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <StatCard key={index} stat={stat} index={index} />
                ))}
              </div>
            </div>
          </section>
        </header>

        {/* About Section */}
        <section id="about" className="bg-gradient-to-br from-gray-50 to-white py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                About CollabSpace
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're revolutionizing business communication by making every conversation actionable and productive.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-[#260f5c] mb-4">
                  Our Mission
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To transform how teams communicate by bridging the gap between conversation and action. We believe that every chat should lead to meaningful outcomes.
                </p>
                <div className="grid grid-cols-2 gap-6 mt-8">
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-[#260f5c] mb-2">2019</div>
                    <div className="text-sm text-gray-600">Founded</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold text-[#260f5c] mb-2">50K+</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-[#260f5c] to-[#3d1a75] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckSquare className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Enterprise Security</h4>
                      <p className="text-white/80 text-sm">Bank-level encryption and compliance standards</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Team Focused</h4>
                      <p className="text-white/80 text-sm">Built specifically for business team collaboration</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Zap className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-1">Lightning Fast</h4>
                      <p className="text-white/80 text-sm">Real-time messaging with 99.9% uptime guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need for
              <span className="block text-[#260f5c]">business communication</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful chat features designed to enhance business productivity and streamline team communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {featureCards.map((card, index) => (
              <FeatureCard key={index} card={card} index={index} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-[#260f5c] to-[#3d1a75] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 md:py-24 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your team?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using CollabSpace to enhance communication and boost productivity.
            </p>
            <Button className="px-8 py-4 bg-blue-500 text-white rounded-xl text-lg font-semibold hover:bg-blue-600 hover:scale-105 transition-all shadow-lg">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

          </div>
        </section>

        {/* Login/Signup Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {isLogin ? 'Sign in to your account' : 'Join CollabSpace today'}
                </p>
              </div>
              
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                {!isLogin && (
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#260f5c] focus:border-transparent"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#260f5c] focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#260f5c] focus:border-transparent"
                />
                
                <Button type="submit" className="w-full py-3 bg-[#260f5c] text-white rounded-xl hover:bg-[#1a0a3d] transition-all">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
              
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#260f5c] hover:underline ml-1 font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">CollabSpace</span>
              </div>
              <div className="text-gray-400 text-sm">
                © 2025 CollabSpace. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

