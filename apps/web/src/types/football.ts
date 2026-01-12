export type FootballSchedule = {
  competitions: {
    competition: {
      id: string;
      name: string;
      gender: string;
    };
    category: {
      id: string;
      name: string;
    };
    matches: {
      id: string;
      competitors: {
        home: {
          id: string;
          name: string;
          score: number;
        };
        away: {
          id: string;
          name: string;
          score: number;
        };
      };
      start_time: string;
      match_status: string;
      clock?: number;
    }[];
  }[];
  total_matches: number
};

export type TournamentFootballSchedule = {
    competition: {
        id: string;
        name: string;
    } 
    matches: {
      id: string;
      competitors: {
        home: {
          id: string;
          name: string;
          score: number;
        };
        away: {
          id: string;
          name: string;
          score: number;
        };
      };
      date: string;
      match_status: string;
      clock?: number;
    }[];
total_matches: number
};

export type FootballMatchInfoType = {
  competition: {
    id: string;
    name: string;
    gender: string;
  };
  season: {
    id: string;
  };
  competitors: {
    home: {
      id: string;
      name: string;
      score: number;
    };
    away: {
      id: string;
      name: string;
      score: number;
    };
  };
  match_info: {
    date_time: string;
    stadium: string;
    capacity: number;
  };
  clock?: number; 
  status: string | { name: string; shortname: string };
  standings?: {
    id: string;
    name: string;
    position: number;
    points: number;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    goals_for: number;
    goals_against: number;
    goal_diff: number;
  }[];
  top_scorers?: {
    id: string;
    name: string;
    team: {
      id: string;
      name: string;
      abbreviation: string;
    };
    gs: number;
  }[];
  homeH2H?: {
    id: string;
    date: string;
    name: string;
    result: "win" | "draw" | "loss";
  }[];
  awayH2H?: {
    id: string;
    date: string;
    name: string;
    result: "win" | "draw" | "loss";
  }[];
};

export type FootballStandingsResponse = {
  tournament: {
    id: number;
    name: string;
  };
  standings: FootballStanding[];
};

export type FootballStanding = {
  name: string;
  position: number;
  statistics: {
    P: number;
    W: number;
    D: number;
    L: number;
    GD: number;
    PTS: number;
  };
  isHighlighted?: boolean;
};

export type FootballStatsResponse = {
  success: boolean;

  home: {
    statistics: {
      yellowCards: number;
      secondYellowCards: number;
      redCards: number;
    };
    name: string;
    id: number;
  };
  away: {
    statistics: {
      yellowCards: number;
      secondYellowCards: number;
      redCards: number;
    };
    name: string;
    id: number;
  };
  date: string;
  id: number;
};
