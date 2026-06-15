"use client";
import { Component, ReactNode } from "react";

// Koi component crash kare to poori app na gire — fallback dikhao.
interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <p className="text-maroon font-display text-xl">Something went wrong</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-sm text-gold underline"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
