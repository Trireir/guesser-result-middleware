import { getLeagueInfo } from '../services/axios/info-api';
import { saveItems, searchItems } from '../services/axios/halo-api';

const LeagueRepository = {
  async getAPILeague(data) {
    const leagueResponse = await getLeagueInfo(data.leagueId);
    const { id, name, currentSeason: { startDate, endDate } } = leagueResponse;
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();

    return {
      apiId: `${id}`,
      name: `${name} ${startYear}/${endYear}`
    };
  },
  async getLeague(apiId) {
    const filter = {
      searchValues: {
        property: "apiId",
        operation: "in",
        value: [apiId],
        type: "string"
      },
      metaSearch: {
        property: "deletedAt",
        operation: "=",
        value: null,
        type: "null"
      },
    };

    return searchItems(filter);
  },
  async saveLeague(data) {
    const { name, ...values } = data;
    const leagueResponse = await saveItems(name, process.env.HALO_MODULE_LEAGUE, values);
    return leagueResponse;
  }
};

export default LeagueRepository;