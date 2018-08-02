exports.api = {
  endpoint: 'https://api.test.sabre.com',
  secret: process.env.SWS_API_SECRET || '',
  pcc: process.env.SWS_API_PCC || '',
};
