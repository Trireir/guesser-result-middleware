import LeagueRepository from '../repository/league-repository';
import createError from '../utils/error-generator';

const isLeagueAlreadySaved = async (apiId) => {
  const league = await LeagueRepository.getLeague(apiId);
  return league.items.length !== 0;
};

const LeagueBusiness = {
  async create(data) {
    const leagueInfo = await LeagueRepository.getAPILeague(data);
    const leagueAlreadySaved = await isLeagueAlreadySaved(leagueInfo.apiId);
    if (leagueAlreadySaved) {
      return Promise.reject(createError(400, 'League already imported'));
    }
    return LeagueRepository.saveLeague(leagueInfo);
  }
};

export default LeagueBusiness;