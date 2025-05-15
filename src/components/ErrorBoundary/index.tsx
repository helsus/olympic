import { QueryErrorResetBoundary } from "@tanstack/react-query";
import type React from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import styles from "./ErrorBoundary.module.css";

interface CustomFallbackProps extends FallbackProps {
	fallbackMessage?: string;
}

function CustomErrorFallback({
	resetErrorBoundary,
	fallbackMessage = "Something went wrong.",
}: CustomFallbackProps) {
	return (
		<div role="alert" className={styles.errorFallback}>
			<p className={styles.errorMessage}>{fallbackMessage}</p>
			<button type="button" onClick={resetErrorBoundary}>
				Try Again
			</button>
		</div>
	);
}

interface QueryErrorBoundaryProps {
	children: React.ReactNode;
	fallbackMessage?: string;
	resetKeys?: unknown[];
}

export function QueryErrorBoundary({
	children,
	fallbackMessage = "Failed to load data.",
	resetKeys,
}: QueryErrorBoundaryProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary
					onReset={reset}
					resetKeys={resetKeys}
					fallbackRender={({ error, resetErrorBoundary }) => (
						<CustomErrorFallback
							error={error}
							resetErrorBoundary={resetErrorBoundary}
							fallbackMessage={fallbackMessage}
						/>
					)}
				>
					{children}
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}
