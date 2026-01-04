import { createFileRoute, useRouter } from '@tanstack/react-router';
import { ChevronLeft, Star, Trash2 } from 'lucide-react';
import { type FavoriteTeam, type FavoriteMatch, useFavorites } from '@/hooks/useFavorites';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api';
import { MatchCard, BasketballComponentHeader } from '@/shared/BasketballAccordionComponentCard';
import { useMemo } from 'react';

export const Route = createFileRoute('/favorites')({
    component: FavoritesPage,
});

const FavoriteMatchCardRow = ({ match, onRemove }: { match: FavoriteMatch; onRemove: () => void }) => {
    const { data: gameData } = useQuery({
        queryKey: [match.sport, 'game', match.id],
        queryFn: () => apiRequest<any>(`${match.sport}/game/${match.id}`),
        refetchInterval: 30000,
    });

    const team1 = gameData?.home?.name || match.team1;
    const team2 = gameData?.away?.name || match.team2;
    const score1 = gameData?.home?.points;
    const score2 = gameData?.away?.points;
    const status = (gameData?.status === 'closed' || gameData?.status === 'ended' || gameData?.status === 'Finished A.E.T.' || gameData?.status === 'Full Time') ? 'FT' : (gameData?.clock ? 'Live' : (gameData?.status || 'FT'));
    const time = gameData?.clock || match.time || "00:00";


    return (
        <div className="bg-white overflow-hidden border-b border-gray-100 last:border-b-0">
            <MatchCard
                id={match.id}
                team1={team1}
                team2={team2}
                score1={score1}
                score2={score2}
                status={status}
                time={time}
                isFavorite={true}
                onFavoriteToggle={onRemove}
                hideFinishedStatus={true}
            />
        </div>
    );
};

function FavoritesPage() {
    const router = useRouter();
    const { favoriteTeams, favoriteMatches, toggleFavoriteTeam, toggleFavoriteMatch } = useFavorites();

    const teamsGroupedByLeague = useMemo(() => {
        const groups: Record<string, { league: string; country: string; flag?: string; teams: FavoriteTeam[] }> = {};

        favoriteTeams.forEach(team => {
            const leagueKey = team.tournament || 'Other';
            if (!groups[leagueKey]) {
                groups[leagueKey] = {
                    league: leagueKey,
                    country: team.country || 'International',
                    flag: team.flag,
                    teams: []
                };
            }
            groups[leagueKey].teams.push(team);
        });

        return Object.values(groups);
    }, [favoriteTeams]);

    const matchesGroupedByLeague = useMemo(() => {
        const groups: Record<string, { league: string; country: string; flag?: string; matches: FavoriteMatch[] }> = {};

        favoriteMatches.forEach(match => {
            const leagueKey = match.tournament || 'Other';
            if (!groups[leagueKey]) {
                groups[leagueKey] = {
                    league: leagueKey,
                    country: match.country || 'International',
                    flag: match.flag,
                    matches: []
                };
            }
            groups[leagueKey].matches.push(match);
        });

        return Object.values(groups);
    }, [favoriteMatches]);

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-20">
            {/* Header */}
            <div className="bg-white px-6 py-5 flex items-center sticky top-0 z-20 shadow-sm mb-4">
                <button
                    onClick={() => router.history.back()}
                    className="mr-5 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-primary" />
                </button>
                <h1 className="text-xl font-bold text-primary">Favorites</h1>
            </div>

            <div className="space-y-8 px-4 w-full mx-auto">
                {favoriteTeams.length === 0 && favoriteMatches.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <Star className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-lg font-bold text-primary mb-2">No favorites yet</h2>
                        <p className="text-gray-500 max-w-[260px] text-sm">
                            Tap the star icon next to teams or matches to keep track of them here.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Favorite Teams Section */}
                        {teamsGroupedByLeague.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-lg font-bold text-primary ml-1">Favorite Teams</h2>
                                <div className="space-y-4">
                                    {teamsGroupedByLeague.map((group) => (
                                        <div key={group.league} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                            <BasketballComponentHeader
                                                league={group.league}
                                                country={group.country}
                                                flag={group.flag}
                                                isExpanded={true}
                                                onToggle={() => { }}
                                            />
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50/50">
                                                {group.teams.map((team) => (
                                                    <div
                                                        key={team.id}
                                                        className="bg-white p-4 flex items-center justify-between hover:bg-gray-50 transition-all group rounded-xl border border-gray-100 shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center p-1.5 border border-gray-100">
                                                                <img
                                                                    src={team.logo || '/Profile.png'}
                                                                    alt={team.name}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm text-primary">{team.name}</span>
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{team.sport}</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleFavoriteTeam(team)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Favorite Matches Section */}
                        {matchesGroupedByLeague.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-lg font-bold text-primary ml-1">Favorite Matches</h2>
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                                    {matchesGroupedByLeague.map((group) => (
                                        <div key={group.league} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                                            <BasketballComponentHeader
                                                league={group.league}
                                                country={group.country}
                                                flag={group.flag}
                                                isExpanded={true}
                                                onToggle={() => { }}
                                            />
                                            <div className="divide-y divide-gray-100">
                                                {group.matches.map((match) => (
                                                    <FavoriteMatchCardRow
                                                        key={match.id}
                                                        match={match}
                                                        onRemove={() => toggleFavoriteMatch(match)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
