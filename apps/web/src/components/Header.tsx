import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-200 shadow-sm`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Claro
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {user ? (
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
              >
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                >
                  Get Started
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col space-y-4 mt-8">
                {user ? (
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 text-white hover:bg-blue-700 font-semibold mt-4"
                  >
                    Dashboard
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => navigate('/register')}
                      className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header; 