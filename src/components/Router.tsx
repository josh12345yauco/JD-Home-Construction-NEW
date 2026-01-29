import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import { lazy, Suspense } from 'react';

// Lazy load page components to avoid circular dependencies
const HomePage = lazy(() => import('@/components/pages/HomePage'));
const AboutPage = lazy(() => import('@/components/pages/AboutPage'));
const ServicesPage = lazy(() => import('@/components/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('@/components/pages/ServiceDetailPage'));
const ProjectsPage = lazy(() => import('@/components/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('@/components/pages/ProjectDetailPage'));
const FAQPage = lazy(() => import('@/components/pages/FAQPage'));
const ContactPage = lazy(() => import('@/components/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/components/pages/NotFoundPage'));

// Loading fallback component
function PageLoader() {
  return <div className="min-h-screen flex items-center justify-center bg-background" />;
}

// Layout component that includes ScrollToTop
function Layout() {
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
      {
        index: true,
        element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "about",
        element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'about',
        },
      },
      {
        path: "services",
        element: <Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'services',
        },
      },
      {
        path: "services/:id",
        element: <Suspense fallback={<PageLoader />}><ServiceDetailPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'service-detail',
        },
      },
      {
        path: "projects",
        element: <Suspense fallback={<PageLoader />}><ProjectsPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'projects',
        },
      },
      {
        path: "projects/:id",
        element: <Suspense fallback={<PageLoader />}><ProjectDetailPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'project-detail',
        },
      },
      {
        path: "faq",
        element: <Suspense fallback={<PageLoader />}><FAQPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'faq',
        },
      },
      {
        path: "contact",
        element: <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: 'contact',
        },
      },
      {
        path: "404",
        element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>,
        routeMetadata: {
          pageIdentifier: '404',
        },
      },
      {
        path: "*",
        element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense>,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
