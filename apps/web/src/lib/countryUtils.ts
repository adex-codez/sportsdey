export const getCountryFromCompetition = (
	competitionName: string,
): { country: string; flag: string } => {
	const name = competitionName.toLowerCase();

	const cityCountryMap: Record<string, { country: string; flag: string }> = {
		// Poland
		krakow: { country: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
		warsaw: { country: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
		poznan: { country: "Poland", flag: "https://flagcdn.com/w40/pl.png" },

		// Italy
		rome: { country: "Italy", flag: "https://flagcdn.com/w40/it.png" },
		milan: { country: "Italy", flag: "https://flagcdn.com/w40/it.png" },
		turin: { country: "Italy", flag: "https://flagcdn.com/w40/it.png" },

		// France
		paris: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		lyon: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		marseille: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		limoges: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		nice: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		toulouse: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		bordeaux: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		nantes: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },

		// Spain
		madrid: { country: "Spain", flag: "https://flagcdn.com/w40/es.png" },
		barcelona: { country: "Spain", flag: "https://flagcdn.com/w40/es.png" },
		valencia: { country: "Spain", flag: "https://flagcdn.com/w40/es.png" },

		// Germany
		berlin: { country: "Germany", flag: "https://flagcdn.com/w40/de.png" },
		munich: { country: "Germany", flag: "https://flagcdn.com/w40/de.png" },
		hamburg: { country: "Germany", flag: "https://flagcdn.com/w40/de.png" },

		// UK
		london: {
			country: "United Kingdom",
			flag: "https://flagcdn.com/w40/gb.png",
		},
		wimbledon: {
			country: "United Kingdom",
			flag: "https://flagcdn.com/w40/gb.png",
		},
		birmingham: {
			country: "United Kingdom",
			flag: "https://flagcdn.com/w40/gb.png",
		},

		// USA
		"new york": { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		miami: { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		"indian wells": { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		cincinnati: { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		knoxville: { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		boca: { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		"boca raton": { country: "USA", flag: "https://flagcdn.com/w40/us.png" },

		// Australia
		melbourne: { country: "Australia", flag: "https://flagcdn.com/w40/au.png" },
		sydney: { country: "Australia", flag: "https://flagcdn.com/w40/au.png" },
		brisbane: { country: "Australia", flag: "https://flagcdn.com/w40/au.png" },

		// Egypt
		cairo: { country: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
		"sharm elsheikh": {
			country: "Egypt",
			flag: "https://flagcdn.com/w40/eg.png",
		},

		// Angola
		luanda: { country: "Angola", flag: "https://flagcdn.com/w40/ao.png" },

		// Netherlands
		amsterdam: {
			country: "Netherlands",
			flag: "https://flagcdn.com/w40/nl.png",
		},
		rotterdam: {
			country: "Netherlands",
			flag: "https://flagcdn.com/w40/nl.png",
		},

		// China
		beijing: { country: "China", flag: "https://flagcdn.com/w40/cn.png" },
		shanghai: { country: "China", flag: "https://flagcdn.com/w40/cn.png" },

		// Japan
		tokyo: { country: "Japan", flag: "https://flagcdn.com/w40/jp.png" },
		osaka: { country: "Japan", flag: "https://flagcdn.com/w40/jp.png" },

		// Canada
		toronto: { country: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
		montreal: { country: "Canada", flag: "https://flagcdn.com/w40/ca.png" },

		// Switzerland
		basel: { country: "Switzerland", flag: "https://flagcdn.com/w40/ch.png" },
		geneva: { country: "Switzerland", flag: "https://flagcdn.com/w40/ch.png" },

		// Austria
		vienna: { country: "Austria", flag: "https://flagcdn.com/w40/at.png" },

		// Czech Republic
		prague: {
			country: "Czech Republic",
			flag: "https://flagcdn.com/w40/cz.png",
		},
		olomouc: {
			country: "Czech Republic",
			flag: "https://flagcdn.com/w40/cz.png",
		},
		brno: { country: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png" },

		// Russia
		moscow: { country: "Russia", flag: "https://flagcdn.com/w40/ru.png" },
		"st petersburg": {
			country: "Russia",
			flag: "https://flagcdn.com/w40/ru.png",
		},

		// Brazil
		rio: { country: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
		"sao paulo": { country: "Brazil", flag: "https://flagcdn.com/w40/br.png" },

		// Argentina
		"buenos aires": {
			country: "Argentina",
			flag: "https://flagcdn.com/w40/ar.png",
		},

		// Portugal
		lisbon: { country: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
		porto: { country: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },

		// Belgium
		brussels: { country: "Belgium", flag: "https://flagcdn.com/w40/be.png" },
		antwerp: { country: "Belgium", flag: "https://flagcdn.com/w40/be.png" },

		// Sweden
		stockholm: { country: "Sweden", flag: "https://flagcdn.com/w40/se.png" },

		// India
		mumbai: { country: "India", flag: "https://flagcdn.com/w40/in.png" },
		delhi: { country: "India", flag: "https://flagcdn.com/w40/in.png" },

		// South Korea
		seoul: { country: "South Korea", flag: "https://flagcdn.com/w40/kr.png" },

		// Mexico
		"mexico city": {
			country: "Mexico",
			flag: "https://flagcdn.com/w40/mx.png",
		},
		acapulco: { country: "Mexico", flag: "https://flagcdn.com/w40/mx.png" },
	};

	// Check for city matches
	for (const [city, info] of Object.entries(cityCountryMap)) {
		if (name.includes(city)) {
			return info;
		}
	}

	// Check for direct country mentions in the name
	const countryMap: Record<string, { country: string; flag: string }> = {
		poland: { country: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
		italy: { country: "Italy", flag: "https://flagcdn.com/w40/it.png" },
		france: { country: "France", flag: "https://flagcdn.com/w40/fr.png" },
		spain: { country: "Spain", flag: "https://flagcdn.com/w40/es.png" },
		germany: { country: "Germany", flag: "https://flagcdn.com/w40/de.png" },
		"united kingdom": {
			country: "United Kingdom",
			flag: "https://flagcdn.com/w40/gb.png",
		},
		usa: { country: "USA", flag: "https://flagcdn.com/w40/us.png" },
		australia: { country: "Australia", flag: "https://flagcdn.com/w40/au.png" },
		egypt: { country: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
		angola: { country: "Angola", flag: "https://flagcdn.com/w40/ao.png" },
		netherlands: {
			country: "Netherlands",
			flag: "https://flagcdn.com/w40/nl.png",
		},
		china: { country: "China", flag: "https://flagcdn.com/w40/cn.png" },
		japan: { country: "Japan", flag: "https://flagcdn.com/w40/jp.png" },
		canada: { country: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
		switzerland: {
			country: "Switzerland",
			flag: "https://flagcdn.com/w40/ch.png",
		},
		austria: { country: "Austria", flag: "https://flagcdn.com/w40/at.png" },
		"czech republic": {
			country: "Czech Republic",
			flag: "https://flagcdn.com/w40/cz.png",
		},
		russia: { country: "Russia", flag: "https://flagcdn.com/w40/ru.png" },
		brazil: { country: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
		argentina: { country: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
		portugal: { country: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
		belgium: { country: "Belgium", flag: "https://flagcdn.com/w40/be.png" },
		sweden: { country: "Sweden", flag: "https://flagcdn.com/w40/se.png" },
		india: { country: "India", flag: "https://flagcdn.com/w40/in.png" },
		"south korea": {
			country: "South Korea",
			flag: "https://flagcdn.com/w40/kr.png",
		},
		mexico: { country: "Mexico", flag: "https://flagcdn.com/w40/mx.png" },
	};

	for (const [countryName, info] of Object.entries(countryMap)) {
		if (name.includes(countryName)) {
			return info;
		}
	}

	// Default to International if no match found
	return { country: "International", flag: "https://flagcdn.com/w40/un.png" };
};
