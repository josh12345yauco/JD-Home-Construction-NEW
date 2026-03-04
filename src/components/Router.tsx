import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { lazy, Suspense, useEffect } from 'react';

const HomePage = lazy(() => import('@/components/pages/HomePage'));
const AboutPage = lazy(() => import('@/components/pages/AboutPage'));
const ServicesPage = lazy(() => import('@/components/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/components/pages/ServiceDetailPage'));
const ProjectsPage = lazy(() => import('@/components/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/components/pages/ProjectDetailPage'));
const FAQPage = lazy(() => import('@/components/pages/FAQPage'));
const ContactPage = lazy(() => import('@/components/pages/ContactPage'));
const AdminLeadsPage = lazy(() => import('@/components/pages/AdminLeadsPage'));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage'));

function PageLoader() {
  return <div className="min-h-screen flex items-center justify-center bg-background" />;
}

function Layout() {
  useEffect(() => {
    document.getElementById('app-loading')?.remove();
  }, []);
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: "about", element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: "services", element: <Suspense fallback={<PageLoader />}><ServicesPage /></Suspense> },
      { path: "services/:id", element: <Suspense fallback={<PageLoader />}><ServiceDetailPage /></Suspense> },
      { path: "projects", element: <Suspense fallback={<PageLoader />}><ProjectsPage /></Suspense> },
      { path: "projects/:id", element: <Suspense fallback={<PageLoader />}><ProjectDetailPage /></Suspense> },
      { path: "faq", element: <Suspense fallback={<PageLoader />}><FAQPage /></Suspense> },
      { path: "contact", element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense> },
      { path: "admin", element: <Suspense fallback={<PageLoader />}><AdminLeadsPage /></Suspense> },
      { path: "404", element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
      { path: "*", element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
    ],
  },
], {
  basename: (typeof import.meta.env !== 'undefined' && import.meta.env.BASE_NAME) || '',
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
