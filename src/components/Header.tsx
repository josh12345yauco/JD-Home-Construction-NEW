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
    { name: 'Contact', path: '/contact' }
  ];

  // Determine if we're on the home page (for dark header on hero)
  const isHomePage = location.pathname === '/';
  const isDarkMode = isHomePage && !isScrolled;
  // When scrolled, always show white text (dark background)
  const isScrolledMode = isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className={`max-w-[120rem] mx-auto px-8 transition-all duration-300 ${
        isDarkMode
          ? 'bg-secondary/95 backdrop-blur-md'
          : isScrolled 
            ? 'bg-secondary/95 backdrop-blur-md shadow-lg' 
            : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center">
            <Image
              src="https://static.wixstatic.com/media/dc69ab_ee8a367561b049528ed1bb3a1d9e7ec7~mv2.png"
              width={204}
              height={68}
              className="h-16 w-auto"
              originWidth={875}
              originHeight={602}
              alt="JD Construction Logo" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-heading text-base transition-colors ${
                  isDarkMode || isScrolledMode
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

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              asChild 
              className={`font-heading px-6 h-11 rounded-lg transition-all ${
                isDarkMode
                  ? 'bg-accent-orange hover:bg-accent-orange/90 text-secondary'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              }`}
            >
              <a href="tel:+1234567890">Call Now</a>
            </Button>
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
            className={`lg:hidden p-2 transition-colors ${isDarkMode || isScrolledMode ? 'text-white' : 'text-secondary'}`}
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
            isDarkMode || isScrolledMode ? 'border-white/10 bg-secondary/50' : 'border-medium-grey/30'
          }`}>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-heading text-lg transition-colors ${
                    isDarkMode || isScrolledMode
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
              <div className="flex flex-col gap-3 mt-4">
                <Button 
                  asChild 
                  className={`font-heading h-11 rounded-lg transition-all ${
                    isDarkMode || isScrolledMode
                      ? 'bg-accent-orange hover:bg-accent-orange/90 text-secondary'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  <a href="tel:+1234567890">Call Now</a>
                </Button>
                <Button 
                  asChild 
                  className={`font-heading h-11 rounded-lg transition-all ${
                    isDarkMode || isScrolledMode
                      ? 'bg-accent-orange hover:bg-accent-orange/90 text-secondary'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                >
                  <Link to="/contact">Request a Quote</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
