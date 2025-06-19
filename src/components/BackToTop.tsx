
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show/hide based on scroll direction and position
      if (currentScrollY > 300) { // Only show after scrolling down 300px
        if (currentScrollY < lastScrollY) {
          // Scrolling up
          setIsVisible(true);
        } else {
          // Scrolling down
          setIsVisible(false);
        }
      } else {
        // Near top of page
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      onClick={scrollToTop}
      className={`fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg transition-all duration-300 ${
        isVisible 
          ? 'translate-x-0 opacity-100' 
          : '-translate-x-full opacity-0'
      }`}
      size="icon"
      variant="default"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
};
