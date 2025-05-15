import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { type SortKey, sortBy } from "./sorting.ts";

type ApiMedal = {
	code: string;
	gold: number;
	silver: number;
	bronze: number;
};

async function fetchMedals(url: string) {
	const response = await fetch(url);
	const data: ApiMedal[] = await response.json();
	return data;
}

function useMedals({
	url,
}: {
	url: string;
}) {
	return useQuery({
		queryKey: ["medals", url],
		queryFn: () => fetchMedals(url),
		retry: 2,
		throwOnError: true,
		select: (data) =>
			data.map((entry) => ({
				...entry,
				total: entry.gold + entry.silver + entry.bronze,
			})),
	});
}

export function useSortedMedals({
	sortKey,
	url,
	limit = 10,
}: {
	sortKey: SortKey;
	url: string;
	limit?: number;
}) {
	const { data, ...rest } = useMedals({ url });

	const sortedData = useMemo(() => {
		if (!data) return null;
		return sortBy(sortKey, data).slice(0, limit);
	}, [data, sortKey, limit]);
	return {
		data: sortedData,
		...rest,
	};
}
