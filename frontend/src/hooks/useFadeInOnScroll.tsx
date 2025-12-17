'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface UseFadeInOnScrollOptions {
  threshold?: number;
  className?: string;
}

export function useFadeInOnScroll(options: UseFadeInOnScrollOptions = {}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pathname = usePathname();
  const { threshold = 0.05, className = 'animate-fade-in-below' } = options;
  
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
      observerRef.current = observer;

      const sections = container.querySelectorAll('.fade-trigger');
      sections.forEach((section) => {
        observer.observe(section);
      });

      (containerRef.current as any)._observer = observer;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
    }
      document.body.classList.remove('js');
    };
  }, [pathname, threshold, className]);

  return containerRef;
}