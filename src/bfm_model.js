const request = require('request-promise-native');
const FileHelper = require('./file_helper');

class BargainFinderMaxModel {
  constructor(params) {
    Object.assign(this, params);
  }

  get itineraries() {
    return this.response;
  }

  async readRequest() {
    try {
      const response = await request({
        method: 'POST',
        url: `${this.apiEndPoint}/v4.2.0/shop/flights?mode=live`,
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.apiAccessToken}`,
        },
        body: this.toBodyString(),
      });

      FileHelper.writeData(response, '../mocks/bfm.json');
      this.response = JSON.parse(response);

      return this.response;
    } catch (error) {
      console.log(`Flight Search response error ${error.statusCode}`);
      console.log(JSON.parse(error.error));
      return -1;
    }
  }

  toBodyString() {
    const requestPayload = {
      OTA_AirLowFareSearchRQ: {
        DirectFlightsOnly: false,
        AvailableFlightsOnly: true,
        Version: '4.1.0',
        POS: {
          Source: [
            {
              PseudoCityCode: this.pcc,
              RequestorID: {
                Type: '1',
                ID: '1',
                CompanyName: {
                  Code: 'TN',
                  content: 'TN',
                },
              },
            },
          ],
        },
        OriginDestinationInformation: [
          {
            RPH: '1',
            DepartureDateTime: this.timeStampLeave,
            OriginLocation: {
              LocationCode: this.fromAirportCode,
            },
            DestinationLocation: {
              LocationCode: this.toAirportCode,
            },
          },
          {
            RPH: '2',
            DepartureDateTime: this.timeStampReturn,
            OriginLocation: {
              LocationCode: this.toAirportCode,
            },
            DestinationLocation: {
              LocationCode: this.fromAirportCode,
            },
          },
        ],
        TravelPreferences: {
          ValidInterlineTicket: true,
        },
        TravelerInfoSummary: {
          SeatsRequested: [
            1,
          ],
          AirTravelerAvail: [
            {
              PassengerTypeQuantity: [
                {
                  Code: 'ADT',
                  Quantity: 1,
                  TPA_Extensions: {
                    VoluntaryChanges: {
                      Match: 'Info',
                    },
                  },
                },
              ],
            },
          ],
        },
        TPA_Extensions: {
          IntelliSellTransaction: {
            RequestType: {
              Name: '50ITINS',
            },
          },
        },
      },
    };

    return JSON.stringify(requestPayload);
  }
}

module.exports = BargainFinderMaxModel;
