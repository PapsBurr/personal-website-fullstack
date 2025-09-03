'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function useFadeInOnScroll(options = {}) {
  const containerRef = useRef(null);
  const pathname = usePathname();
  const { threshold = 0.1, className = 'animate-fade-in-below' } = options;
  
  useEffect(() => {
    document.body.classList.add('js');

    const timeoutId = setTimeout(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add(className);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold }
      );

      const sections = container.querySelectorAll('.fade-trigger');
      sections.forEach((section) => {
        observer.observe(section);
      });

      containerRef.current._observer = observer;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (containerRef.current?._observer) {
        containerRef.current._observer.disconnect();
        delete containerRef.current._observer;
      }
      document.body.classList.remove('js');
    };
  }, [pathname, threshold, className]);

  return containerRef;
}