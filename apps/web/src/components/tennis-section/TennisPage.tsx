import SportAccordionCard from '@/shared/BasketballAccordionComponentCard'
import type { League } from '@/types/basketball'


const TennisPage = () => {
const tennisLeagues: League[] = [
  {
    id: "italy-atp-finals",
    country: "Italy",
    leagueName: "World Tour Finals, Jimmy Connors Group",
    flag: "/Italy.png",
    matches: [
      {
        team1: "Taylor Harry Fritz",
        team2: "Alex De Minaur",
        player1Sets: [],
        player2Sets: [],
        time: "13:00",
      },
      {
        team1: "Carlos Alcaraz",
        team2: "Lorenzo Musetti",
        player1Sets: [],
        player2Sets: [],
        time: "19:30",
      },
    ],
  },
  {
    id: "angola-m15",
    country: "Angola",
    leagueName: "M15 Luanda",
    flag: "/Angola.png",
    matches: [
      {
        team1: "Samir Hamza Reguig",
        team2: "Nikita Ianin",
        player1Sets: [{ games: 6 }, { games: 6 }, { games: 2 }],
        player2Sets: [{ games: 2 }, { games: 4 }, { games: 0 }],
        status: "FT",
      },
      {
        team1: "Kuperstein Alex",
        team2: "Kai Wehnelt",
        player1Sets: [{ games: 1 }, { games: 7, tiebreak: 7 }, { games: 2 }],
        player2Sets: [{ games: 6 }, { games: 6, tiebreak: 4 }, { games: 1 }],
        status: "FT",
      },
      {
        team1: "Ruslan Serazhetdinov",
        team2: "Constantin Bittoun Kouzmine",
        player1Sets: [{ games: 3 }, { games: 2 }, { games: 0 }],
        player2Sets: [{ games: 6 }, { games: 6 }, { games: 2 }],
        status: "FT",
      },
      {
        team1: "Tanner Gian Luca",
        team2: "Mikail Alimi",
        player1Sets: [{ games: 6 }, { games: 6 }, { games: 2 }],
        player2Sets: [{ games: 0 }, { games: 4 }, { games: 1 }],
        status: "FT",
      },
    ],
  },
  {
    id: "australia-w50",
    country: "Australia",
    leagueName: "W50 Brisbane",
    flag: "/Australia.png",
    matches: [
      {
        team1: "Matei Dodic",
        team2: "Liam Broady",
        player1Sets: [{ games: 7 }, { games: 6 }, { games: 2 }],
        player2Sets: [{ games: 5 }, { games: 2 }, { games: 6 }],
        status: "Q3",
      },
      {
        team1: "Tom Paris",
        team2: "Mikhail Kukushkin",
        player1Sets: [{ games: 6 }, { games: 6 }, { games: 7 }],
        player2Sets: [{ games: 2 }, { games: 4 }, { games: 5 }],
        status: "FT",
      },
      {
        team1: "Jan-Lennard Struff",
        team2: "Vit Kopriva",
        player1Sets: [],
        player2Sets: [],
        time: "13:00",
      },
      {
        team1: "Dan Added",
        team2: "Kyrian Jacquet",
        player1Sets: [],
        player2Sets: [],
        time: "16:00",
      },
    ],
  },
  {
    id: "egypt-w15",
    country: "Egypt",
    leagueName: "W15 Sharm ElSheikh",
    flag: "/Egypt.png",
    matches: [
      {
        team1: "Amelie Hejmankova",
        team2: "Zoziya Kardava",
        player1Sets: [{ games: 6 }, { games: 6 }, { games: 2 }],
        player2Sets: [{ games: 4 }, { games: 0 }, { games: 0 }],
        status: "FT",
      },
      {
        team1: "Fulgenzi Brandeyn",
        team2: "Lamis Alhussein Abdel Aziz",
        player1Sets: [{ games: 6 },  { games: 4 }, { games: 6 }],
        player2Sets: [{ games: 2 },  { games: 6 }, { games: 3 }],
        status: "FT",
      },
    ],
  },
  {
    id: "australia-challenger",
    country: "Australia",
    leagueName: "Challenger Brisbane 3",
    flag: "/Australia.png",
    matches: [
      {
        team1: "Polmans Marc",
        team2: "Alex Bolt",
        player1Sets: [{ games: 4 }, { games: 0 }, { games: 0 }],
        player2Sets: [{ games: 6 }, { games: 6 }, { games: 2 }],
        status: "FT",
      },
      {
        team1: "Carl Emil Overbeck",
        team2: "Leo Vithoontien",
        player1Sets: [{ games: 6 }, { games: 7, tiebreak: 7 }, { games: 2 }],
        player2Sets: [{ games: 2 }, { games: 6 }, { games: 0 }],
        status: "FT",
      },
      {
        team1: "James Duckworth",
        team2: "Blake Ellis",
        player1Sets: [{ games: 3 }, { games: 6 }, { games: 2 }],
        player2Sets: [{ games: 6 }, { games: 1 }, { games: 4 }],
        status: "FT",
      },
      {
        team1: "Cruz Hewitt",
        team2: "Tung-Lin Wu",
        player1Sets: [{ games: 6 }, { games: 4 }, { games: 1 }],
        player2Sets: [{ games: 3 }, { games: 6 }, { games: 6 }],
        status: "FT",
      },
    ],
  },
  {
    id: "australia-w50-2",
    country: "Australia",
    leagueName: "W50 Brisbane",
    flag: "/Australia.png",
    matches: [
      {
        team1: "Mei Yamaguchi",
        team2: "Sarah Rokusek",
        player1Sets: [{ games: 7 }, { games: 6 }, { games: 2 }],
        player2Sets: [{ games: 5 }, { games: 2 }, { games: 0 }],
        status: "FT",
      },
      {
        team1: "Katarina Zavatska",
        team2: "Emerson Jones",
        player1Sets: [{ games: 3 }, { games: 6 }, { games: 3 }],
        player2Sets: [{ games: 6 }, { games: 3 }, { games: 1 }],
        status: "FT",
      },
      {
        team1: "Saki Imamura",
        team2: "Destanee Jones",
        player1Sets: [{ games: 3 }, { games: 4 }, { games: 0 }],
        player2Sets: [{ games: 6 }, { games: 6 }, { games: 2 }],
        status: "FT",
      },
      {
        team1: "Maddison Inglis",
        team2: "Miho Kuramochi",
        player1Sets: [{ games: 3 }, { games: 7, tiebreak: 7 }, { games: 3 }],
        player2Sets: [{ games: 6 }, { games: 6 }, { games: 1 }],
        status: "FT",
      },
      {
        team1: "Aira Varakska",
        team2: "Ayumi Koshikata",
        player1Sets: [{ games: 2 }, { games: 6, tiebreak: 0 }, { games: 2 }],
        player2Sets: [{ games: 6 }, { games: 7, tiebreak: 7 }, { games: 2 }],
        status: "FT",
      },
    ],
  },
]
  return (
    <div className='space-y-4 mb-32 lg:mb-0 pb-10'>
        {tennisLeagues.map((league) => (
          <SportAccordionCard
            key={league.id}
            country={league.country}
            league={league.leagueName}
            flag={league.flag}
            matches={league.matches}
            imageUrl={league.imageUrl}
          />
        ))}
    </div>
  )
}

export default TennisPage