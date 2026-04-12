import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-6">
          <div className="absolute inset-0 pointer-events-none">
            <div className="glow-blob w-[30rem] h-[30rem] bg-[hsl(var(--destructive)/0.12)] -top-28 -left-24" />
          </div>
          <div className="relative z-10 mx-auto max-w-lg text-center space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl text-white">Something went wrong.</h1>
              <p className="text-white/60">We encountered an unexpected error while rendering this page.</p>
            </div>
            {this.state.error && (
              <div className="text-left rounded-2xl border border-[hsl(var(--destructive)/0.35)] bg-[hsl(var(--destructive)/0.08)] px-4 py-3 pb-4">
                <p className="text-sm font-semibold text-[hsl(var(--destructive))] mb-1">Error Details:</p>
                <code className="text-xs text-[hsl(var(--destructive)/0.8)] break-all max-h-32 overflow-y-auto block">
                  {this.state.error.message}
                </code>
              </div>
            )}
            <div className="pt-4 flex justify-center">
              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => window.location.reload()}
              >
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
