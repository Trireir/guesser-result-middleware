import _ from 'lodash';
import LeagueBusiness from '../business/league-business';
import createError from '../utils/error-generator';

function validateInput(data) {
  const errors = {};

  if (!data.leagueId) {
    errors.leagueId = 'Mandatory field';
  }
  if (!_.isNumber(data.leagueId)) {
    errors.leagueId = 'leagueId should be a number';
  }

  return errors;
}

const LeagueController = {
  create(data) {
    const validationErrors = validateInput(data);
    if (!_.isEmpty(validationErrors)) {
      return Promise.reject(createError(400, 'Input validation error', validationErrors));
    }
    return LeagueBusiness.create(data);
  },
};

export default LeagueController;
