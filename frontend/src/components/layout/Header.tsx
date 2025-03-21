import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Navigation links
  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Syllabus', path: '/syllabus' },
    { name: 'Question Papers', path: '/question-papers' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Chatbot', path: '/chatbot' },
    { name: 'Planner', path: '/planner' },
  ];
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Close mobile menu on location change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  
  return (
    <>
      <header 
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4 px-4 md:px-8",
          isScrolled ? "glass shadow-sm backdrop-blur-md" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-primary flex items-center gap-2"
          >
            <img 
              src="/logo.jpeg" 
              alt="EduSmartX Logo" 
              className="h-28 rounded-lg object-contain bg-transparent"
            />
            {/* <span>EduSmartX</span> */}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200",
                  location.pathname === link.path 
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={18} />
                </div>
                <span className="font-medium">Student</span>
                <ChevronDown size={16} className={cn(
                  "transition-transform duration-200",
                  userMenuOpen ? "transform rotate-180" : ""
                )} />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg glass border border-border/40 overflow-hidden animate-fade-in z-50">
                  <div className="p-3 border-b border-border/40">
                    <p className="font-semibold">Student Name</p>
                    <p className="text-sm text-muted-foreground">student@example.com</p>
                  </div>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 p-3 hover:bg-primary/5 transition-colors"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-2 p-3 hover:bg-primary/5 transition-colors border-t border-border/40"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 top-[72px] bg-white/95 backdrop-blur-sm z-40 animate-fade-in">
            <nav className="flex flex-col p-5 space-y-1 max-w-7xl mx-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "py-3 px-4 rounded-lg font-medium transition-colors duration-200",
                    location.pathname === link.path 
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-border/40 my-4"></div>
              <Link 
                to="/profile" 
                className="py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <Link 
                to="/login" 
                className="py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Link>
            </nav>
          </div>
        )}
      </header>
      {/* Padding element to prevent content from being hidden behind the fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;
