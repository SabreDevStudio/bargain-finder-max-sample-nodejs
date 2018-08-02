const LOCAL_CURRENCY = {
  style: 'currency',
  currency: 'USD',
};

class BargainFinderMaxView {
  constructor(searchModel) {
    this.searchModel = searchModel;
    this.flightData = this.searchModel.itineraries;
  }

  displaySearchCriteria() {
    console.log(`\n\n\t\t\t>> ${this.searchModel.fromAirportCode} to ${this.searchModel.toAirportCode} <<`);
  }

  displayNumberOfItineraries() {
    console.log(`\t\t      ${this.flightData.OTA_AirLowFareSearchRS.PricedItineraries.PricedItinerary.length} itineraries found\n`);
  }

  static displayItineraryListHeader() {
    console.log('Flight   Cities         Departs              Arrives        Dur\n');
  }

  static displayItineraryPenalties(itinerary) {
    const penalties = {};

    itinerary.AirItineraryPricingInfo.forEach((pricing) => {
      pricing.PTC_FareBreakdowns.PTC_FareBreakdown.forEach((breakDown) => {
        breakDown.PassengerFare.PenaltiesInfo.Penalty.forEach((penalty) => {
          if (!penalties[penalty.Type]) {
            penalties[penalty.Type] = {
              applicability: penalty.Applicability,
              changeable: penalty.Changeable,
              refundable: penalty.Refundable,
              amount: penalty.Amount,
            };
          }
        });
      });
    });

    let exchangePenaltyNote = '';

    if (penalties.Exchange && penalties.Exchange.changeable) {
      exchangePenaltyNote = `Exchangeable for ${penalties.Exchange.amount.toLocaleString('en-us', LOCAL_CURRENCY)}`;
    } else {
      exchangePenaltyNote = '\tCan\'t be exchanged';
    }

    let refundPenaltyNote = '';

    if (penalties.Refund && penalties.Refund.refundable) {
      refundPenaltyNote = 'Refundable';
    } else {
      refundPenaltyNote = 'Can\'t be refunded';
    }

    console.log(`\tNotes: ${exchangePenaltyNote}  ${refundPenaltyNote}`);
  }

  static displayItinerary(itinerary) {
    itinerary.AirItinerary.OriginDestinationOptions.OriginDestinationOption.forEach((option) => {
      option.FlightSegment.forEach((segment) => {
        console.log(`${segment.OperatingAirline.Code} ${segment.OperatingAirline.FlightNumber.padEnd(4)}  ${segment.DepartureAirport.LocationCode} ${segment.ArrivalAirport.LocationCode}  ${segment.DepartureDateTime}  ${segment.ArrivalDateTime}  ${segment.ElapsedTime.toString().padEnd(4)}`);
      });
      console.log('\t\t\t ----------------');
    });

    const fare = itinerary.AirItineraryPricingInfo[0].ItinTotalFare;
    console.log(`\tTotal Price: ${fare.TotalFare.Amount.toLocaleString('en-us', LOCAL_CURRENCY)} (Fare: ${fare.BaseFare.Amount.toLocaleString('en-us', LOCAL_CURRENCY)} + Tax: ${fare.Taxes.Tax[0].Amount.toLocaleString('en-us', LOCAL_CURRENCY)})`);

    BargainFinderMaxView.displayItineraryPenalties(itinerary);
  }

  displayItineraries() {
    BargainFinderMaxView.displayItineraryListHeader();

    const itineraries = this.flightData.OTA_AirLowFareSearchRS.PricedItineraries.PricedItinerary;
    itineraries.forEach((itinerary, index) => {
      if (index !== 0) console.log('\n');

      BargainFinderMaxView.displayItinerary(itinerary);
    });
  }

  render() {
    this.displaySearchCriteria();
    this.displayNumberOfItineraries();
    this.displayItineraries();
  }
}

module.exports = BargainFinderMaxView;
