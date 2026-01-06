/**
 * Get team logo URL for football teams
 * Uses a combination of logo CDN and fallback mappings
 */

// Common team ID mappings for logo CDN
const teamLogoMap: Record<string, string> = {
  // English Premier League
  "Arsenal": "https://media.api-sports.io/football/teams/42.png",
  "Manchester City": "https://media.api-sports.io/football/teams/50.png",
  "Manchester United": "https://media.api-sports.io/football/teams/33.png",
  "Liverpool": "https://media.api-sports.io/football/teams/40.png",
  "Chelsea": "https://media.api-sports.io/football/teams/49.png",
  "Tottenham Hotspur": "https://media.api-sports.io/football/teams/47.png",
  "Tottenham": "https://media.api-sports.io/football/teams/47.png",
  "Newcastle United": "https://media.api-sports.io/football/teams/34.png",
  "Newcastle": "https://media.api-sports.io/football/teams/34.png",
  "Aston Villa": "https://media.api-sports.io/football/teams/66.png",
  "Brighton & Hove Albion": "https://media.api-sports.io/football/teams/51.png",
  "Brighton": "https://media.api-sports.io/football/teams/51.png",
  "West Ham United": "https://media.api-sports.io/football/teams/48.png",
  "West Ham": "https://media.api-sports.io/football/teams/48.png",
  "Everton": "https://media.api-sports.io/football/teams/45.png",
  "Leicester City": "https://media.api-sports.io/football/teams/46.png",
  "Leicester": "https://media.api-sports.io/football/teams/46.png",
  "Nottingham Forest": "https://media.api-sports.io/football/teams/65.png",
  "Crystal Palace": "https://media.api-sports.io/football/teams/52.png",
  "Brentford": "https://media.api-sports.io/football/teams/55.png",
  "Fulham": "https://media.api-sports.io/football/teams/36.png",
  "Wolverhampton": "https://media.api-sports.io/football/teams/39.png",
  "Wolves": "https://media.api-sports.io/football/teams/39.png",
  "AFC Bournemouth": "https://media.api-sports.io/football/teams/35.png",
  "Bournemouth": "https://media.api-sports.io/football/teams/35.png",
  "Southampton": "https://media.api-sports.io/football/teams/41.png",
  "Leeds United": "https://media.api-sports.io/football/teams/63.png",
  "Leeds": "https://media.api-sports.io/football/teams/63.png",
  "Burnley": "https://media.api-sports.io/football/teams/44.png",
  "Sheffield United": "https://media.api-sports.io/football/teams/62.png",
  "Sheffield": "https://media.api-sports.io/football/teams/62.png",
  "Luton Town": "https://media.api-sports.io/football/teams/1359.png",
  "Luton": "https://media.api-sports.io/football/teams/1359.png",
  "Sunderland": "https://media.api-sports.io/football/teams/71.png",

  // La Liga
  "Real Madrid": "https://media.api-sports.io/football/teams/541.png",
  "Barcelona": "https://media.api-sports.io/football/teams/529.png",
  "Atletico Madrid": "https://media.api-sports.io/football/teams/530.png",
  "Sevilla": "https://media.api-sports.io/football/teams/536.png",
  "Valencia": "https://media.api-sports.io/football/teams/532.png",
  "Villarreal": "https://media.api-sports.io/football/teams/533.png",
  "Real Sociedad": "https://media.api-sports.io/football/teams/548.png",
  "Athletic Bilbao": "https://media.api-sports.io/football/teams/531.png",
  "Real Betis": "https://media.api-sports.io/football/teams/543.png",

  // Serie A
  "Juventus": "https://media.api-sports.io/football/teams/496.png",
  "Inter Milan": "https://media.api-sports.io/football/teams/505.png",
  "Inter": "https://media.api-sports.io/football/teams/505.png",
  "AC Milan": "https://media.api-sports.io/football/teams/489.png",
  "Milan": "https://media.api-sports.io/football/teams/489.png",
  "Napoli": "https://media.api-sports.io/football/teams/492.png",
  "AS Roma": "https://media.api-sports.io/football/teams/497.png",
  "Roma": "https://media.api-sports.io/football/teams/497.png",
  "Lazio": "https://media.api-sports.io/football/teams/487.png",
  "Atalanta": "https://media.api-sports.io/football/teams/499.png",
  "Fiorentina": "https://media.api-sports.io/football/teams/502.png",

  // Bundesliga
  "Bayern Munich": "https://media.api-sports.io/football/teams/157.png",
  "Bayern": "https://media.api-sports.io/football/teams/157.png",
  "Borussia Dortmund": "https://media.api-sports.io/football/teams/165.png",
  "Dortmund": "https://media.api-sports.io/football/teams/165.png",
  "RB Leipzig": "https://media.api-sports.io/football/teams/173.png",
  "Leipzig": "https://media.api-sports.io/football/teams/173.png",
  "Bayer Leverkusen": "https://media.api-sports.io/football/teams/168.png",
  "Leverkusen": "https://media.api-sports.io/football/teams/168.png",

  // Ligue 1
  "Paris Saint Germain": "https://media.api-sports.io/football/teams/85.png",
  "PSG": "https://media.api-sports.io/football/teams/85.png",
  "Marseille": "https://media.api-sports.io/football/teams/81.png",
  "Lyon": "https://media.api-sports.io/football/teams/80.png",
  "Monaco": "https://media.api-sports.io/football/teams/91.png",
  "Lille": "https://media.api-sports.io/football/teams/79.png",
};

export function getTeamLogo(teamName: string): string {
  // Try exact match first
  if (teamLogoMap[teamName]) {
    return teamLogoMap[teamName];
  }

  // Try case-insensitive match
  const lowerTeamName = teamName.toLowerCase();
  const matchedKey = Object.keys(teamLogoMap).find(
    key => key.toLowerCase() === lowerTeamName
  );

  if (matchedKey) {
    return teamLogoMap[matchedKey];
  }

  // Return placeholder if not found
  return "/Profile.png";
}

export function getTeamInitials(teamName: string): string {
  return teamName.substring(0, 2).toUpperCase();
}
