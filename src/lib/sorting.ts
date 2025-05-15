const SUPPORTED_SORT_KEYS = ["total", "gold", "silver", "bronze"] as const;

export type SortKey = (typeof SUPPORTED_SORT_KEYS)[number];

const FIELDS_TO_COMPARE = {
	total: ["total", "gold", "silver"],
	gold: ["gold", "silver", "bronze"],
	silver: ["silver", "gold", "bronze"],
	bronze: ["bronze", "gold", "silver"],
} as const;

export function isSortKey(value: string): value is SortKey {
	return SUPPORTED_SORT_KEYS.some((key) => key === value);
}

export function determineSortKey(maybeSortKey: string | null) {
	if (maybeSortKey && isSortKey(maybeSortKey)) {
		return maybeSortKey;
	}

	return "gold";
}

export function sortBy<
	T extends { [key in SortKey]: number } & { code: string },
>(sortKey: SortKey, data: T[]) {
	return [...data].sort((a, b) => {
		const fieldsToCompare = FIELDS_TO_COMPARE[sortKey];

		for (const field of fieldsToCompare) {
			const diff = b[field] - a[field];
			if (diff !== 0) {
				return diff;
			}
		}

		return a.code.localeCompare(b.code);
	});
}
