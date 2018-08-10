export default {
  getToken: () => 'oauth/token',
  getLeague: leagueId => `competitions/${leagueId}`,
  getTeams: leagueId => `competitions/${leagueId}/teams`,
  getStanding: leagueId => `competitions/${leagueId}/standings`,
  getMatches: leagueId => `competitions/${leagueId}/matches?matchday=3`,
};
