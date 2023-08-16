/** @jsxImportSource @emotion/react */
import React, { ReactNode, Component, ErrorInfo } from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

interface ErrorBoundaryProps {
    /** margin top and bottom */
    my?: number;
    /** children components */
    children: ReactNode;
}

interface ErrorBoundaryState {
    /** error object */
    error: Error | null;
    /** error info object */
    errorInfo: ErrorInfo | null;
}

/**
 * Default error boundary component for catching errors in children components
 * using MUI Alert component
 *
 * AO from https://reactjs.org/docs/error-boundaries.html
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <Alert
                    severity="error"
                    css={{
                        marginTop: this.props.my ? this.props.my : undefined,
                        marginBottom: this.props.my ? this.props.my : undefined,
                    }}
                >
                    <AlertTitle>
                        {this.state.error && this.state.error.toString()
                            ? this.state.error.toString()
                            : 'Something went wrong :('}
                    </AlertTitle>
                    <details css={{ whiteSpace: 'pre-wrap' }}>
                        <summary>See stack trace</summary>
                        <pre>{this.state.errorInfo.componentStack}</pre>
                    </details>
                </Alert>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
