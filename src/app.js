const config = require('./config');
const BFMModel = require('./bfm_model');
const BFMView = require('./bfm_view');
const AuthenticationModel = require('./authentication_model');
const SearchCriteria = require('./search_criteria');


function GetFlights(accessToken) {
  const searchModel = new BFMModel({
    pcc: config.api.pcc,
    apiEndPoint: config.api.endpoint,
    fromAirportCode: SearchCriteria.fromAirportCode,
    toAirportCode: SearchCriteria.toAirportCode,
    timeStampLeave: SearchCriteria.timeStampLeave,
    timeStampReturn: SearchCriteria.timeStampReturn,
    apiAccessToken: accessToken,
  });

  searchModel.readRequest().then(() => {
    const searchView = new BFMView(searchModel);
    searchView.render();
  });
}

function RunFlightSearch() {
  console.log('Welcome to the Bargain Finder Max demo');

  const authModel = new AuthenticationModel({
    apiEndPoint: config.api.endpoint,
    secret: config.api.secret,
  });
  authModel.readRequest().then(() => {
    GetFlights(authModel.accessToken);
  });
}

RunFlightSearch();
