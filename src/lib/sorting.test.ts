import { sortBy } from "./sorting.ts";

describe("sortBy()", () => {
	const scenarios = [
		{
			field: "total" as const,
			tests: [
				{
					description:
						"sorts primarily by total, then gold, then silver, then code",
					data: [
						{ code: "D", total: 25, gold: 10, silver: 8, bronze: 7 },
						{ code: "A", total: 22, gold: 10, silver: 5, bronze: 7 },
						{ code: "E", total: 20, gold: 8, silver: 7, bronze: 5 },
						{ code: "C", total: 25, gold: 10, silver: 8, bronze: 7 },
						{ code: "F", total: 15, gold: 5, silver: 5, bronze: 5 },
						{ code: "B", total: 22, gold: 10, silver: 5, bronze: 7 },
					],
					expectedCodes: ["C", "D", "A", "B", "E", "F"],
				},
				{
					description: "uses gold when total is tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 3, bronze: 2 },
						{ code: "B", total: 10, gold: 6, silver: 2, bronze: 2 },
						{ code: "C", total: 10, gold: 5, silver: 4, bronze: 1 },
					],
					expectedCodes: ["B", "C", "A"],
				},
				{
					description: "uses silver when total and gold are tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 3, bronze: 2 },
						{ code: "B", total: 10, gold: 5, silver: 4, bronze: 1 },
						{ code: "C", total: 10, gold: 5, silver: 3, bronze: 2 },
					],
					expectedCodes: ["B", "A", "C"],
				},
			],
		},
		{
			field: "gold" as const,
			tests: [
				{
					description:
						"sorts primarily by gold, then silver, then bronze, then code",
					data: [
						{ code: "B", total: 25, gold: 10, silver: 8, bronze: 7 },
						{ code: "C", total: 22, gold: 10, silver: 5, bronze: 7 },
						{ code: "D", total: 20, gold: 8, silver: 7, bronze: 5 },
						{ code: "A", total: 25, gold: 10, silver: 8, bronze: 7 },
					],
					expectedCodes: ["A", "B", "C", "D"],
				},
				{
					description: "uses silver when gold is tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 3, bronze: 2 },
						{ code: "B", total: 8, gold: 5, silver: 4, bronze: 1 },
						{ code: "C", total: 12, gold: 5, silver: 3, bronze: 4 },
					],
					expectedCodes: ["B", "C", "A"],
				},
				{
					description: "uses bronze when gold and silver are tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 3, bronze: 2 },
						{ code: "B", total: 9, gold: 5, silver: 3, bronze: 4 },
						{ code: "C", total: 11, gold: 5, silver: 3, bronze: 2 },
					],
					expectedCodes: ["B", "A", "C"],
				},
				{
					description: "uses code when gold, silver and bronze are tied",
					data: [
						{ code: "C", total: 1, gold: 1, silver: 1, bronze: 1 },
						{ code: "A", total: 1, gold: 1, silver: 1, bronze: 1 },
						{ code: "B", total: 1, gold: 1, silver: 1, bronze: 1 },
					],
					expectedCodes: ["A", "B", "C"],
				},
			],
		},
		{
			field: "silver" as const,
			tests: [
				{
					description:
						"sorts primarily by silver, then gold, then bronze, then code",
					data: [
						{ code: "C", total: 10, gold: 1, silver: 5, bronze: 4 },
						{ code: "A", total: 10, gold: 2, silver: 6, bronze: 2 },
						{ code: "B", total: 10, gold: 3, silver: 5, bronze: 2 },
					],
					expectedCodes: ["A", "B", "C"],
				},
				{
					description: "uses gold when silver is tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 5, bronze: 0 },
						{ code: "B", total: 8, gold: 6, silver: 5, bronze: 1 },
						{ code: "C", total: 12, gold: 5, silver: 5, bronze: 4 },
					],
					expectedCodes: ["B", "C", "A"],
				},
				{
					description: "uses bronze when silver and gold are tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 5, bronze: 2 },
						{ code: "B", total: 9, gold: 5, silver: 5, bronze: 4 },
						{ code: "C", total: 11, gold: 5, silver: 5, bronze: 2 },
					],
					expectedCodes: ["B", "A", "C"],
				},
			],
		},
		{
			field: "bronze" as const,
			tests: [
				{
					description:
						"sorts primarily by bronze, then gold, then silver, then code",
					data: [
						{ code: "C", total: 10, gold: 1, silver: 4, bronze: 5 },
						{ code: "A", total: 10, gold: 2, silver: 2, bronze: 6 },
						{ code: "B", total: 10, gold: 3, silver: 2, bronze: 5 },
					],
					expectedCodes: ["A", "B", "C"],
				},
				{
					description: "uses gold when bronze is tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 0, bronze: 5 },
						{ code: "B", total: 8, gold: 6, silver: 1, bronze: 5 },
						{ code: "C", total: 12, gold: 5, silver: 4, bronze: 5 },
					],
					expectedCodes: ["B", "C", "A"],
				},
				{
					description: "uses silver when bronze and gold are tied",
					data: [
						{ code: "A", total: 10, gold: 5, silver: 2, bronze: 5 },
						{ code: "B", total: 9, gold: 5, silver: 4, bronze: 5 },
						{ code: "C", total: 11, gold: 5, silver: 2, bronze: 5 },
					],
					expectedCodes: ["B", "A", "C"],
				},
			],
		},
	];

	describe.each(scenarios)("when sorting by $field", (scenario) => {
		it.each(scenario.tests)("$description", ({ data, expectedCodes }) => {
			const sorted = sortBy(scenario.field, data);
			expect(sorted.map((c) => c.code)).toEqual(expectedCodes);
		});
	});
});
