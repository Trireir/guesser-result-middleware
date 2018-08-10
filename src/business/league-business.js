import LeagueRepository from '../repository/league-repository';
import createError from '../utils/error-generator';

const isLeagueAlreadySaved = async (apiId) => {
  const league = await LeagueRepository.getLeague(apiId);
  return league.items.length !== 0;
};

const LeagueBusiness = {
  async create(data) {
    let leagueInfo;
    try {
      leagueInfo = await LeagueRepository.getAPILeague(data);
    } catch(err) {
      return Promise.reject(createError(404, 'League do not exist or is restricted', err));
    }
    const leagueAlreadySaved = await isLeagueAlreadySaved(leagueInfo.apiId);
    if (leagueAlreadySaved) {
      return Promise.reject(createError(400, 'League already imported'));
    }
    return LeagueRepository.saveLeague(leagueInfo);
  }
};

export default LeagueBusiness;