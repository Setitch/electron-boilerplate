import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, fallback: null };
    }
  
    static getDerivedStateFromError(error: any) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error: any, info: any) {
      console.log(
        error,
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        info.componentStack,
        // Warning: `captureOwnerStack` is not available in production.
        React.captureOwnerStack(),
      );
    }
  
    render() {
      if ((this.state as any).hasError) {
        // You can render any custom fallback UI
        return (this.props as any).fallback;
      }
  
      return (this.props as any).children;
    }
  }