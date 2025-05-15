import { Suspense } from "react";
import Providers from "./providers.tsx";
import "./globals.css";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Suspense>{children}</Suspense>
				</Providers>
			</body>
		</html>
	);
}
