"use client";

import { QueryErrorBoundary } from "@/components/ErrorBoundary";
import { MedalsTable } from "@/components/MedalsTable/index.tsx";
import { determineSortKey } from "@/lib/sorting.ts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const SOURCE_URL = "/medals.json";

export default function Home() {
	const router = useRouter();
	const pathname = usePathname();

	const searchParams = useSearchParams();
	const sortKey = determineSortKey(searchParams.get("sort"));

	const handleSort = useCallback(
		(newSortKey: string) => {
			const params = new URLSearchParams(searchParams.toString());

			params.set("sort", newSortKey);
			router.replace(`${pathname}?${params.toString()}`);
		},
		[pathname, router, searchParams],
	);

	return (
		<div className="page-container">
			<QueryErrorBoundary resetKeys={[SOURCE_URL, sortKey]}>
				<MedalsTable
					onSort={handleSort}
					sortKey={sortKey}
					sourceUrl={SOURCE_URL}
				/>
			</QueryErrorBoundary>
		</div>
	);
}
