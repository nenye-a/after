const convertFields = () => {
  let text =
    'places.allowsDogs, places.curbsidePickup, places.delivery, places.dineIn, places.editorialSummary, places.evChargeOptions, places.fuelOptions, places.goodForChildren, places.goodForGroups, places.goodForWatchingSports, places.liveMusic, places.menuForChildren, places.parkingOptions, places.paymentOptions, places.outdoorSeating, places.reservable, places.restroom, places.reviews, places.servesBeer, places.servesBreakfast, places.servesBrunch, places.servesCocktails, places.servesCoffee, places.servesDessert, places.servesDinner, places.servesLunch, places.servesVegetarianFood, places.servesWine, places.takeout';

  console.log(
    text
      .split(',')
      .map((option) => "| '" + option.trim().replace('places.', '') + "'\n")
      .join(''),
  );
};
