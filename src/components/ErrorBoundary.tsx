import { Component, type ReactNode } from "react";

interface Props {
  /** Child components to render when no error occurs. */
  children: ReactNode;
  /** Optional custom fallback UI to display on error. */
  fallback?: ReactNode;
  /** Optional callback when an error is caught — useful for analytics or logging. */
  onError?: (error: Error, componentStack: string) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary that catches JavaScript errors in its child component tree.
 *
 * Displays a branded fallback UI with a refresh button, or a custom `fallback`
 * element if provided. Prevents the entire app from crashing due to a single
 * component failure.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<p>Something went wrong</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
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
    this.props.onError?.(error, info.componentStack || "");
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[300px] flex items-center justify-center bg-background px-8 py-16">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">✈</span>
            </div>
            <h2 className="font-display text-xl text-foreground mb-3">Something went wrong</h2>
            <p className="text-[13px] text-muted-foreground font-light leading-relaxed mb-6">
              This section encountered an unexpected issue. You can try refreshing or continue browsing.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-6 py-2.5 border border-border/30 text-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-300 hover:bg-muted/30"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-gradient-gold text-primary-foreground text-[10px] tracking-[0.2em] uppercase font-medium rounded-xl transition-all duration-500"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;