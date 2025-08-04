import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy-loaded components (matching bzceval's exact structure and naming)
const Navbar = lazy(() => import('../components/layout/Navbar'));
const Footer = lazy(() => import('../components/layout/Footer'));
const Home = lazy(() => import('../pages/Home'));
const FlightsList = lazy(() => import('../pages/FlightsList'));
const NotFoundComp = lazy(() => import('../pages/NotFoundComp'));

// Loading fallback component with Google Flights styling
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-theme-default">
    <LoadingSpinner size="lg" />
  </div>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<FlightsList />} />
          <Route path="*" element={<NotFoundComp />} />
        </Routes>
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
