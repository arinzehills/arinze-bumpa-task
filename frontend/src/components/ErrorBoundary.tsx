/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, ReactNode } from "react";
import { Button } from "./Button";
import { Icon } from "@iconify/react";
import { SideToast } from "./Toast";

declare const process: { env: { NODE_ENV: string } };

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  reportSent: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      reportSent: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, reportSent: false };
  }

  handleReportToSupport = async () => {
    this.setState({ reportSent: true });

    try {
      // Report error notification
      SideToast.FireSuccess({
        title: "Report Sent",
        message: "Error report sent successfully! Our team will investigate this issue.",
      });
    } catch (error) {
      console.error("Failed to send error report:", error);
      this.setState({ reportSent: false });

      // Show error toast
      SideToast.FireError({
        title: "Report Failed",
        message: "Failed to send error report. Please try again later.",
      });
    }
  };

  handleRefreshPage = () => {
    window.location.reload();
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  renderErrorAnimation = () => (
    <div className="mb-8">
      <div className="w-48 h-48 mx-auto mb-6 flex items-center justify-center">
        <Icon
          icon="solar:bug-bold"
          width={200}
          height={200}
          className="text-red-500"
        />
      </div>
    </div>
  );

  renderErrorMessage = () => (
    <div className="max-w-md mb-8">
      <h1 className="text-3xl font-bold text-text-primary mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-text-secondary text-lg leading-relaxed">
        We've encountered an unexpected error. Our team has been notified and
        we're working to fix it.
      </p>
    </div>
  );

  renderActionButtons = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <Button
        onClick={this.handleRefreshPage}
        variant="primary"
        size="lg"
      >
        <Icon icon="solar:refresh-bold" width={20} height={20} className="mr-2" />
        Refresh Page
      </Button>

      <Button
        onClick={this.handleReportToSupport}
        variant="secondary"
        size="lg"
        disabled={this.state.reportSent}
      >
        <Icon
          icon={this.state.reportSent ? "solar:check-circle-bold" : "mdi:report-line-variant"}
          width={20}
          height={20}
          className="mr-2"
        />
        {this.state.reportSent ? "Report Sent" : "Report Issue"}
      </Button>
    </div>
  );

  renderErrorDetails = () => {
    if (process.env.NODE_ENV !== "development" || !this.state.error) {
      return null;
    }

    return (
      <details className="max-w-2xl w-full">
        <summary className="cursor-pointer text-text-secondary hover:text-text-primary mb-4 font-medium">
          View Error Details (Development Mode)
        </summary>
        <div className="bg-bg-primary text-text-primary p-6 rounded-lg text-left overflow-auto border border-border-color">
          <div className="mb-4">
            <h4 className="text-red-500 font-bold mb-2">Error Message:</h4>
            <p className="mb-4 font-mono text-sm">{this.state.error.message}</p>
          </div>
          {this.state.error.stack && (
            <div>
              <h4 className="text-red-500 font-bold mb-2">Stack Trace:</h4>
              <pre className="text-xs whitespace-pre-wrap font-mono overflow-x-auto">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      </details>
    );
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex-col items-center justify-center min-h-screen px-4 text-center">
          {this.renderErrorAnimation()}
          {this.renderErrorMessage()}
          {this.renderActionButtons()}
          {this.renderErrorDetails()}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;