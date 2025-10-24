import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { handleFetchError, safeParseURL } from '@/utils/urlHandler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Check if this is a URL parsing error
      const isURLParsingError = this.state.error?.message?.includes('Failed to parse URL') || 
                                this.state.error?.message?.includes('Invalid URL');
      
      const errorMessage = isURLParsingError 
        ? handleFetchError(this.state.error!, window.location.href)
        : "We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.";

      return (
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8">
              {isURLParsingError ? (
                <Globe className="w-16 h-16 text-destructive mx-auto mb-4" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              )}
              <h1 className="text-2xl font-heading font-semibold text-foreground mb-4">
                {isURLParsingError ? 'Navigation Error' : 'Something went wrong'}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {errorMessage}
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left bg-muted p-4 rounded-lg mb-6">
                  <summary className="cursor-pointer font-semibold mb-2">Error Details</summary>
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </Button>
              {isURLParsingError && (
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Go to Homepage
                </Button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
