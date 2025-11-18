import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error }: { error?: Error | null }) {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const errorMessage = error?.message || 'Bilinmeyen bir hata oluştu';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-destructive/20 bg-card p-6 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Bir Hata Oluştu
          </h1>
          <p className="text-sm text-muted-foreground">
            Üzgünüz, beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya
            ana sayfaya dönün.
          </p>
        </div>

        {error && process.env.NODE_ENV === 'development' && (
          <div className="rounded-md bg-muted p-3 text-left">
            <p className="text-xs font-semibold text-destructive">
              Hata Detayı (Sadece Development):
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-mono">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={handleReload} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sayfayı Yenile
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}

// React Router için error element
export function RouteErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Bilinmeyen bir hata oluştu';
  let errorDetails: Error | null = null;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || errorMessage;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error;
  }

  return <ErrorFallback error={errorDetails || new Error(errorMessage)} />;
}

export function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>;
}

