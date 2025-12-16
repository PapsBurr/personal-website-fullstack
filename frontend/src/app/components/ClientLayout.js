'use client';
import Header from '../components/Header';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';

export default function ClientLayout({ children }) {
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