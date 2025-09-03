'use client';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';

export default function ClientLayout({ children }) {
  const fadeInRef = useFadeInOnScroll();

  return (
    <div ref={fadeInRef}>
      {children}
    </div>
  );
}