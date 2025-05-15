import type { SortKey } from "@/lib/sorting.ts";
import { useSortedMedals } from "@/lib/useMedals.ts";
import cx from "classnames";
import { Flag } from "../Flag/index.tsx";
import styles from "./MedalsTable.module.css";

const COLUMNS = [
	{ key: "gold" as const, className: styles.gold },
	{ key: "silver" as const, className: styles.silver },
	{ key: "bronze" as const, className: styles.bronze },
	{ label: "Total", key: "total" as const, className: styles.total },
];

export interface MedalsTableProps {
	sourceUrl: string;
	sortKey: SortKey;
	onSort: (newSortKey: SortKey) => void;
}

export function MedalsTable({ sourceUrl, sortKey, onSort }: MedalsTableProps) {
	const { data: medals, isLoading } = useSortedMedals({
		sortKey,
		url: sourceUrl,
	});

	const tableHeader = (
		<thead>
			<tr>
				<th scope="col" className={styles.rank}>
					<span className={styles.visuallyHidden}>Rank</span>
				</th>
				<th scope="col" className={styles.flag}>
					<span className={styles.visuallyHidden}>Flag</span>
				</th>
				<th scope="col">
					<span className={styles.visuallyHidden}>Country</span>
				</th>
				{COLUMNS.map((column) => (
					<th
						key={column.key}
						className={styles.medals}
						scope="col"
						aria-sort={sortKey === column.key ? "descending" : "none"}
					>
						<button
							type="button"
							onClick={() => onSort(column.key)}
							className={cx(styles.medalButton, column.className, {
								[styles.sorted]: !isLoading && sortKey === column.key,
							})}
							aria-label={`Sort by ${column.key} medals`}
							aria-pressed={sortKey === column.key}
							disabled={isLoading}
						>
							{column.label}
						</button>
					</th>
				))}
			</tr>
		</thead>
	);

	return (
		<table className={styles.table}>
			{tableHeader}
			<tbody>
				{isLoading &&
					Array.from({ length: 10 }).map((_, index) => (
						<SkeletonRow
							rank={index + 1}
							key={`skeleton-${
								// biome-ignore lint/suspicious/noArrayIndexKey: just a skeleton
								index
							}`}
						/>
					))}
				{!isLoading &&
					medals &&
					medals.length > 0 &&
					medals.map((medal, index) => (
						<tr key={medal.code} aria-label={`Medals of ${medal.code}`}>
							<td className={styles.right}>{index + 1}</td>
							<td>
								<Flag code={medal.code} />
							</td>
							<th className={styles.country} scope="row">
								{medal.code}
							</th>
							<td
								aria-label={`${medal.code} have ${medal.gold} gold medals`}
								className={styles.center}
							>
								{medal.gold}
							</td>
							<td
								aria-label={`${medal.code} have ${medal.silver} silver medals`}
								className={styles.center}
							>
								{medal.silver}
							</td>
							<td
								aria-label={`${medal.code} have ${medal.bronze} bronze medals`}
								className={styles.center}
							>
								{medal.bronze}
							</td>
							<td
								aria-label={`${medal.code} have ${medal.total} total medals`}
								className={styles.center}
							>
								<strong>{medal.total}</strong>
							</td>
						</tr>
					))}
				{!isLoading && medals && medals.length === 0 && (
					<tr>
						<td colSpan={3 + COLUMNS.length} className={styles.noDataCell}>
							No medal data available.
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

function SkeletonRow({ rank }: { rank: number }) {
	return (
		<tr className={styles.skeletonRow}>
			<td className={styles.right}>{rank}</td>
			<td>
				<div className={styles.skeletonItem} />
			</td>
			<th className={styles.country} scope="row">
				<div className={styles.skeletonItem} />
			</th>
			{COLUMNS.map((col) => (
				<td key={col.key} className={styles.center}>
					<div className={styles.skeletonItem} />
				</td>
			))}
		</tr>
	);
}
