'use client';
import Header from './Header';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const fadeInRef = useFadeInOnScroll();

  return (
    <>
      <Header />
      <div ref={fadeInRef}>
        {children}
      </div>
    </>
  );
}