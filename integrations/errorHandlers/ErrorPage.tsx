import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as Error & { status?: number; statusText?: string };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center',
      background: '#fafafa',
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#131720', marginBottom: '0.5rem' }}>
        {error?.status === 404 ? 'Page Not Found' : "Something went wrong"}
      </h1>
      <p style={{ fontSize: '1rem', color: '#42454C', marginBottom: '1.5rem', maxWidth: '400px' }}>
        {error?.statusText || error?.message || "An unexpected error occurred."}
      </p>
      <Link
        to="/"
        style={{
          padding: '0.75rem 1.5rem',
          background: '#131720',
          color: 'white',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Go Home
      </Link>
    </div>
  );
}
