import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-8">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✈</span>
            </div>
            <h1 className="font-display text-2xl text-foreground mb-3">Something went wrong</h1>
            <p className="text-[14px] text-muted-foreground font-light leading-relaxed mb-8">
              We encountered an unexpected issue. Please refresh to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.25em] uppercase font-medium rounded-xl transition-all duration-500"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
