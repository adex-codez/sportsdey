import DetailsImageCard from '@/shared/DetailsImageCard'
import type { Quarter, TeamData, TeamStanding } from '@/types/basketball';
import { TeamStats } from './TeamStats';
import ImportantUpdate from '@/shared/ImportantUpdate';
import { useState } from 'react';
import InfoTab from './InfoTab';
import StandingsTab from './StandingsTab';


const standingsData: TeamStanding[] = [
  {
    position: 1,
    name: "Pistons",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "-",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
  {
    position: 2,
    name: "Raptors",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "W", "L", "L", "W"],
  },
  {
    position: 3,
    name: "Heat",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
  {
    position: 4,
    name: "Detroit Pistons",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    isHighlighted: true,
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
  {
    position: 5,
    name: "Knicks",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
  {
    position: 6,
    name: "Cavaliers",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "L", "L", "L", "W"],
  },
  {
    position: 7,
    name: "Chicago Bulls",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    isHighlighted: true,
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
  {
    position: 8,
    name: "Hawks",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "L", "L", "L", "W"],
  },
  {
    position: 9,
    name: "Magic",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
  {
    position: 10,
    name: "Celtics",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "L", "L", "L", "W"],
  },
  {
    position: 11,
    name: "Bulls",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "L", "W", "L", "W"],
  },
  {
    position: 12,
    name: "76ers",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "L", "L", "L", "W"],
  },
  {
    position: 13,
    name: "Bucks",
    played: 18,
    wins: 15,
    losses: 8,
    streak: "-2",
    gamesBehind: "2.5",
    diff: "+127",
    pct: "0.8734",
    lastFiveResults: ["W", "W", "W", "L", "W"],
  },
]

  export const sampleTeams = [
  {
    teamName: "Detroit Pistons",
    teamLogo: "/Pistons.png",
    starters: [
      {
        name: "Precious Achiuwa",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Drew Eubanks",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Russell Westbrook",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "DeMar DeRozan",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Zach LaVine",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
    ],
    bench: [
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
    ],
    totals: {
      pts: 99,
      fg: "39-88",
      threePt: "8-23",
      ft: "15-20",
      reb: 45,
      ast: 23,
      to: 18,
      stl: 12,
      blk: 0,
      oreb: 12,
      dreb: 33,
      pf: 33,
      min: 240,
      fgPct: 44,
      threePtPct: 29,
      ftPct: 65,
    },
  },
  {
    teamName: "Chicago Bulls",
    teamLogo: "/Bulls.png",
    starters: [
      {
        name: "Precious Achiuwa",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Drew Eubanks",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Russell Westbrook",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "DeMar DeRozan",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Zach LaVine",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 6,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
    ],
    bench: [
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
      {
        name: "Roma",
        number: "15",
        pts: 15,
        fg: "3-6",
        threePt: "0-2",
        ft: "2-4",
        reb: 9,
        ast: 8,
        to: 4,
        stl: 3,
        blk: 0,
        oreb: 5,
        dreb: 10,
        pf: 2,
        min: 26,
        plusMinus: -8,
      },
    ],
    totals: {
      pts: 99,
      fg: "39-88",
      threePt: "8-23",
      ft: "15-20",
      reb: 45,
      ast: 23,
      to: 18,
      stl: 12,
      blk: 0,
      oreb: 12,
      dreb: 33,
      pf: 33,
      min: 240,
      fgPct: 44,
      threePtPct: 29,
      ftPct: 65,
    },
  },
]

const BasketBallDetailsPage = () => {
        const [activeTab, setActiveTab] = useState('info');
  const quarters: Quarter[] = [
    { id: 'q1', label: 'Q1' },
    { id: 'q2', label: 'Q2' },
    { id: 'q3', label: 'Q3' },
    { id: 'q4', label: 'Q4' }
  ];

  const team1Data: TeamData = {
    name: 'Detroit Pistons',
    quarterScores: [36, 34, 26, 25],
    total: 121,
  };

  const team2Data: TeamData = {
    name: 'Chicago Bulls',
    quarterScores: [32, 28, 26, 28],
    total: 113,
  };


const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
         <InfoTab/>
        );
      
      case 'standings':
        return (
         <StandingsTab teams={standingsData} onSeeAllClick={() => console.log("See all forms clicked")}/>
        );
      
      case 'team-stats':
        return (
        <TeamStats teams={sampleTeams}/>
        );
      
      case 'videos':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Game Highlights</h3>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 ring-blue-500 transition cursor-pointer">
                  <div className="h-32 bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium">Highlight {i}</p>
                    <p className="text-gray-400 text-xs">2:15</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'news':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Latest News</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition cursor-pointer">
                  <h4 className="text-white font-medium mb-1">Post-Game Analysis: Bulls Dominate</h4>
                  <p className="text-gray-400 text-sm mb-2">
                    Chicago Bulls showcase stellar performance in their victory over Detroit Pistons...
                  </p>
                  <p className="text-gray-500 text-xs">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  return (
    <div className='w-full space-y-3 pb-28 lg:pb-10'>
        <div className='py-4 lg:py-0'>
         <DetailsImageCard activeTab={activeTab} setActiveTab={setActiveTab} competitionCountry='USA' competitionName='NBA' hostTeamName='Detroit Pistons' hostTeamLogo='/Pistons.png' matchStatus='finished' hostTeamScore={121} guestTeamScore={131} guestTeamLogo='/Bulls.png' guestTeamName='Chicago Bulls'/>
        </div>
      <div>
        {renderTabContent()}
      </div>
        <div><ImportantUpdate/></div>
    </div>
  )
}

export default BasketBallDetailsPage