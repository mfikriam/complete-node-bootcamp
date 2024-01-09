/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicGF5bnVrIiwiYSI6ImNscjYxNWZ4ZDBjNjkya3BxdzdyOGU3bzIifQ.wpeywDmR7nwmiLB1jpP5xw';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/paynuk/clr620izn01c301r55u8q4e3n', // style URL
    scrollZoom: false,
    // center: [-118.11349, 34.111745], // starting position [lng, lat]
    // zoom: 10, // starting zoom
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //? Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //? Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //? Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    //? Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
