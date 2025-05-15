import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";

import { useSortedMedals } from "@/lib/useMedals.ts";

import { MedalsTable } from "./index.tsx";

jest.mock("@/lib/useMedals.ts");

const mockUseSortedMedals = useSortedMedals as jest.Mock;

const mockMedalsData = [
	{ code: "USA", gold: 10, silver: 5, bronze: 2, total: 17 },
	{ code: "CHN", gold: 8, silver: 6, bronze: 4, total: 18 },
	{ code: "BLR", gold: 5, silver: 8, bronze: 9, total: 21 },
];

const testSortableColumns = [
	{
		key: "gold" as const,
		buttonLabel: "Sort by gold medals",
		headerText: "Gold",
	},
	{
		key: "silver" as const,
		buttonLabel: "Sort by silver medals",
		headerText: "Silver",
	},
	{
		key: "bronze" as const,
		buttonLabel: "Sort by bronze medals",
		headerText: "Bronze",
	},
	{
		key: "total" as const,
		buttonLabel: "Sort by total medals",
		headerText: "Total",
	},
];

describe("MedalsTable", () => {
	let mockOnSort: jest.Mock;
	const sourceUrl = "example.com/medals.json";
	const initialSortKey = "gold";

	beforeEach(() => {
		mockOnSort = jest.fn();
		mockUseSortedMedals.mockReturnValue({
			data: [...mockMedalsData],
			isLoading: false,
			error: null,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders correctly with initial data and default sort key", () => {
		render(
			<MedalsTable
				sourceUrl={sourceUrl}
				sortKey={initialSortKey}
				onSort={mockOnSort}
			/>,
		);

		expect(mockUseSortedMedals).toHaveBeenCalledWith({
			sortKey: initialSortKey,
			url: sourceUrl,
		});

		expect(
			screen.getByRole("columnheader", { name: "Rank" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("columnheader", { name: "Flag" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("columnheader", { name: "Country" }),
		).toBeInTheDocument();

		mockMedalsData.forEach((medal, index) => {
			const row = screen
				.getByRole("rowheader", { name: medal.code })
				.closest("tr");
			expect(row).toBeInTheDocument();

			if (row) {
				expect(
					within(row).getByRole("cell", { name: (index + 1).toString() }),
				).toBeInTheDocument();
				expect(
					within(row).getByLabelText(`Flag of ${medal.code}`),
				).toBeInTheDocument();

				const goldCell = within(row).getByRole("cell", {
					name: `${medal.code} have ${medal.gold} gold medals`,
				});
				expect(goldCell).toBeInTheDocument();
				expect(goldCell).toHaveTextContent(medal.gold.toString());

				const silverCell = within(row).getByRole("cell", {
					name: `${medal.code} have ${medal.silver} silver medals`,
				});
				expect(silverCell).toBeInTheDocument();
				expect(silverCell).toHaveTextContent(medal.silver.toString());

				const bronzeCell = within(row).getByRole("cell", {
					name: `${medal.code} have ${medal.bronze} bronze medals`,
				});
				expect(bronzeCell).toBeInTheDocument();
				expect(bronzeCell).toHaveTextContent(medal.bronze.toString());

				const totalCell = within(row).getByRole("cell", {
					name: `${medal.code} have ${medal.total} total medals`,
				});
				expect(totalCell).toBeInTheDocument();
				expect(
					within(totalCell).getByText(medal.total.toString(), {
						selector: "strong",
					}),
				).toBeInTheDocument();
			}
		});
	});

	for (const col of testSortableColumns) {
		it(`calls onSort with ${col.key} and updates sort attributes when ${col.headerText} header is clicked`, () => {
			const { rerender } = render(
				<MedalsTable
					sourceUrl={sourceUrl}
					sortKey={initialSortKey}
					onSort={mockOnSort}
				/>,
			);

			const buttonToClick = screen.getByRole("button", {
				name: col.buttonLabel,
			});
			fireEvent.click(buttonToClick);

			expect(mockOnSort).toHaveBeenCalledTimes(1);
			expect(mockOnSort).toHaveBeenCalledWith(col.key);

			rerender(
				<MedalsTable
					sourceUrl={sourceUrl}
					sortKey={col.key}
					onSort={mockOnSort}
				/>,
			);

			expect(mockUseSortedMedals).toHaveBeenCalledWith({
				sortKey: col.key,
				url: sourceUrl,
			});

			const newlySortedButton = screen.getByRole("button", {
				name: col.buttonLabel,
			});
			const thOfNewlySortedButton = newlySortedButton.closest("th");
			expect(thOfNewlySortedButton).toHaveAttribute("aria-sort", "descending");
			expect(newlySortedButton).toHaveAttribute("aria-pressed", "true");

			for (const otherCol of testSortableColumns.filter(
				(otherCol) => otherCol.key !== col.key,
			)) {
				const otherButton = screen.getByRole("button", {
					name: otherCol.buttonLabel,
				});
				const thOfOtherButton = otherButton.closest("th");
				expect(thOfOtherButton).toHaveAttribute("aria-sort", "none");
				expect(otherButton).toHaveAttribute("aria-pressed", "false");
			}
		});
	}

	it("renders skeleton rows and disables sort buttons when isLoading is true", () => {
		mockUseSortedMedals.mockReturnValue({
			data: [],
			isLoading: true,
			error: null,
		});

		render(
			<MedalsTable
				sourceUrl={sourceUrl}
				sortKey={initialSortKey}
				onSort={mockOnSort}
			/>,
		);

		const table = screen.getByRole("table");
		const tbody = table.querySelector("tbody");

		if (!tbody) {
			throw new Error("tbody not found");
		}

		const skeletonBodyRows = within(tbody).getAllByRole("row");
		expect(skeletonBodyRows.length).toBe(10);

		skeletonBodyRows.forEach((row, index) => {
			expect(
				within(row).getByRole("cell", { name: (index + 1).toString() }),
			).toBeInTheDocument();
			expect(within(row).getAllByRole("cell")).toHaveLength(6);
		});

		for (const col of testSortableColumns) {
			const button = screen.getByRole("button", { name: col.buttonLabel });
			expect(button).toBeDisabled();

			expect(button).toHaveAttribute(
				"aria-pressed",
				col.key === initialSortKey ? "true" : "false",
			);

			const th = button.closest("th");
			expect(th).toHaveAttribute(
				"aria-sort",
				col.key === initialSortKey ? "descending" : "none",
			);
		}
	});

	it('renders "No medal data available" message when data is empty and not loading', () => {
		mockUseSortedMedals.mockReturnValue({
			data: [],
			isLoading: false,
			error: null,
		});

		render(
			<MedalsTable
				sourceUrl={sourceUrl}
				sortKey={initialSortKey}
				onSort={mockOnSort}
			/>,
		);

		const noDataMessageCell = screen
			.getByText("No medal data available.")
			.closest("td");
		expect(noDataMessageCell).toBeInTheDocument();
		const expectedColspan = (3 + testSortableColumns.length).toString();
		expect(noDataMessageCell).toHaveAttribute("colspan", expectedColspan);

		for (const medal of mockMedalsData) {
			expect(
				screen.queryByRole("rowheader", { name: medal.code }),
			).not.toBeInTheDocument();
		}

		const allRowsInTable = screen.getAllByRole("row");
		expect(allRowsInTable.length).toBe(2);
	});
});
