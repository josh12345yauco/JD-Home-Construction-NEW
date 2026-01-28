import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' }
  ];

  // Determine if we're on the home page (for dark header on hero)
  const isHomePage = location.pathname === '/';
  const isDarkMode = isHomePage && !isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDarkMode
          ? 'bg-secondary/95 backdrop-blur-md'
          : isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-lg' 
            : 'bg-background'
      }`}
    >
      <div className="max-w-[120rem] mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Image 
              src="https://static.wixstatic.com/media/dc69ab_21844db13f144d55b78196fb41a7cc1d~mv2.png?originWidth=128&originHeight=128" 
              alt="JD Construction Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading text-base transition-colors ${
                  isDarkMode
                    ? location.pathname === link.path
                      ? 'text-accent-orange'
                      : 'text-white/80 hover:text-accent-orange'
                    : location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button 
              asChild 
              className={`font-heading px-6 h-11 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-accent-orange hover:bg-accent-orange/90 text-secondary'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${isDarkMode ? 'text-white' : 'text-secondary'}`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden py-6 border-t ${
            isDarkMode ? 'border-white/10 bg-secondary/50' : 'border-medium-grey/30'
          }`}>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-heading text-lg transition-colors ${
                    isDarkMode
                      ? location.pathname === link.path
                        ? 'text-accent-orange'
                        : 'text-white/80 hover:text-accent-orange'
                      : location.pathname === link.path
                        ? 'text-primary'
                        : 'text-foreground hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Button 
                asChild 
                className={`font-heading h-11 rounded-lg mt-4 transition-all ${
                  isDarkMode
                    ? 'bg-accent-orange hover:bg-accent-orange/90 text-secondary'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                }`}
              >
                <Link to="/contact">Request a Quote</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
