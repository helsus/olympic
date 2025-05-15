import styles from "./Flag.module.css";

const FLAG_HEIGHT_PX = 17;

const KNOWN_FLAGS = [
	"AUT",
	"BLR",
	"CAN",
	"CHN",
	"FRA",
	"GER",
	"ITA",
	"NED",
	"NOR",
	"RUS",
	"SUI",
	"SWE",
	"USA",
] as const;

type CountryWithFlag = (typeof KNOWN_FLAGS)[number];

function isCountryWithFlag(code: string): code is CountryWithFlag {
	return KNOWN_FLAGS.some((country) => country === code);
}

export function Flag({ code }: { code: string }) {
	if (isCountryWithFlag(code)) {
		return (
			<span
				role="img"
				aria-label={`Flag of ${code}`}
				className={styles.flag}
				style={
					{
						"--flag-pos": `0px -${KNOWN_FLAGS.indexOf(code) * FLAG_HEIGHT_PX}px`,
					} as React.CSSProperties
				}
			/>
		);
	}

	return "NO FLAG";
}
