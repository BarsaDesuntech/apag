import React from 'react';
import { Platform, Linking } from 'react-native';
import moment from 'moment';

/**
 * Parses any date String and returns a Date object
 * @returns Date Object
 * @param {String} date
 */
const parseDate = function (date) {
  let newDate = date;
  if (
    typeof date !== typeof undefined &&
    !(date instanceof Date && !isNaN(date.valueOf()))
  ) {
    if (date.indexOf('Z') !== -1) {
      newDate = moment(date).toDate();
    } else {
      newDate = moment(date, 'DD-MM-YYYY HH:mm').toDate();
      if (newDate === 'Invalid Date') {
        newDate = moment(date, 'dd., DD MMMM YYYY, HH:mm [Uhr]').toDate();
      }
    }
  }
  return newDate;
};

/**
 * Parses any date String and returns a Date object
 * @returns Number of days
 * @param {Date} date1
 * @param {Date} date2
 */
const differenceBetweenDatesInDays = function (date1, date2) {
  const one_day = 1000 * 60 * 60 * 24;

  const date1_ms = date1.getTime();
  const date2_ms = date2.getTime();

  const difference_ms = date2_ms - date1_ms;

  return difference_ms / one_day;
};

/**
 * Parses a date and returns it in the specified format.
 * @returns Date String
 * @param {String} date
 */
const formatDate = function (date) {
  return moment(date).format('DD.MM.YYYY HH:mm');
};

/**
 * Orders an array of parkhouses by title (name)
 * @returns Parkhouse Array
 * @param {Array} parkhouses
 */
const sortParkhouses = function (parkhouses) {
  return parkhouses.sort(function (a, b) {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  });
};

/**
 * Orders an array of parkhouses by city
 * @returns Parkhouse Array
 * @param {Array} parkhouses
 */
const sortParkhousesByCity = function (parkhouses) {
  return parkhouses.sort(function (a, b) {
    if (a.site < b.site) {
      return -1;
    }
    if (a.site > b.site) {
      return 1;
    }
    return 0;
  });
};

/**
 * Creates an array with cities as index and for each city an array of matching parkhouses
 * @returns Parkhouse Array
 * @param {Array} parkhouses
 */
const groupParkhousesByCity = function (parkhouses) {
  let cities = {};

  for (var i = 0; i < parkhouses.length; i++) {
    if (typeof cities[parkhouses[i].site] === typeof undefined) {
      cities[parkhouses[i].site] = [];
    }
    cities[parkhouses[i].site].push(parkhouses[i]);
  }

  return cities;
};

/**
 * Orders an array of parkhouses by distance
 * This expects that the target location was defined and the distance was already calculated
 * @returns Parkhouse Array
 * @param {Array} parkhouses
 */
const sortParkhousesByDistance = parkhouses =>
  parkhouses.sort(function (a, b) {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  });

/**
 * Goes through a list of parkhouses and checks if they are listed in the placesList which holds all parkhouses with free charging places.
 * This is used to sort the placesList in the same order provided by the parkhouses array.
 * @returns Parkhouses id list filtered by free charging places
 * @param {Object} placesList
 * @param {Array} parkhouses
 */
const sortPlacesByParkhouses = (placesList, parkhouses) => {
  let idSort = [];
  parkhouses?.map((parkhouse, i) => {
    if (Object.keys(placesList).indexOf(parkhouse.id) !== -1) {
      parkhouse.index = idSort.length + 1;
      idSort.push(parkhouse.id);
    }
  });
  return idSort;
};

/**
 * Calculates the distance between each parkhouse and the target location
 * @returns Parkhouses Array
 * @param {Array} parkobjects
 * @param {Object} location - Result of Google Maps Autocomplete
 */
const calculateDistances = function (parkobjects, location) {
  if (
    typeof location !== typeof undefined &&
    typeof location.geometry !== typeof undefined
  ) {
    parkobjects?.map((parkhouse, i) => {
      parkhouse.distance = getDistanceFromLatLonInKm(
        parseFloat(parkhouse.latitude),
        parseFloat(parkhouse.longitude),
        location.geometry.location.lat,
        location.geometry.location.lng,
      ).toFixed(2);
      return parkhouse;
    });
  }
  return parkobjects;
};

/**
 * Filters an array of Parkhouses by a specific city.
 * @returns Parkhouses Array
 * @param {Array} parkobjects
 * @param {String} city
 */
const filterParkhousesByCity = function (parkobjects, city) {
  let result = [];
  for (var i = 0; i < parkobjects.length; i++) {
    if (parkobjects[i].site === city) {
      result.push(parkobjects[i]);
    }
  }
  return result;
};

/**
 * Calculates the distance between to geosphere points two latitues and two longitudes
 * @retuns Distance as Float
 * @param {Float} lat1
 * @param {Float} lon1
 * @param {Float} lat2
 * @param {Float} lon2
 */
const getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

/**
 * Transforms degrees to radials
 * @param {Float} deg
 */
const deg2rad = function (deg) {
  return deg * (Math.PI / 180);
};

/**
 * Takes a parkhouse object coming from the APAG API v2 and starts the navigation.
 * This is platform specific. Either Apple Maps or Google maps will start.
 * @param {Object} item
 */
const startNavigation = function (item) {
  const { latitude, longitude, title } = item;
  const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
  const latLng = `${latitude},${longitude}`;
  const url =
    Platform.OS === 'ios'
      ? `${scheme}${title}@${latLng}`
      : `${scheme}${latLng}(${title})`;
  if (Linking.canOpenURL(url)) {
    Linking.openURL(url);
  }
};

/**
 * Calculates the maximum image height and width while keeping the aspect ratio
 * @param {Number} imageWidth
 * @param {Number} imageHeight
 * @param {Number} maxHeight
 * @param {Number} maxWidth
 */
const calcDim = function (imageWidth, imageHeight, maxHeight, maxWidth) {
  const imageRatio = imageWidth / imageHeight;

  let newImageHeight = Math.min(maxHeight, imageHeight);
  let newImageWidth = newImageHeight * imageRatio;

  if (maxWidth > 0 && newImageWidth > maxWidth) {
    newImageWidth = maxWidth;
    newImageHeight = maxWidth / imageRatio;
  }

  return {
    imageWidth: newImageWidth,
    imageHeight: newImageHeight,
  };
};

/**
 * Returns a list of cities sorted by name
 * @param {Array} parkhouses
 */
const getCityList = function (parkhouses) {
  let cities = [];
  for (var i = 0; i < parkhouses.length; i++) {
    if (cities.indexOf(parkhouses[i].site.toUpperCase()) === -1) {
      cities.push(parkhouses[i].site.toUpperCase());
    }
  }
  return cities.sort(function (a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  });
};

/**
 * Calculate the center coordinates for a map based on the parkhouses, current select cit, available charging places (placesList) and the target a customer wants to reach
 * The placesList and target are optional paramters and are used on the LadenScreen to calculate the center between target location of the customer and available charging stations
 * @param {Array} parkhouses
 * @param {String} city
 * @param {Array} placesList
 * @param {Object} target
 */
const calcCenterCoordinate = function (parkhouses, city, placesList, target) {
  let matched = 0;
  let LATITUDE = 0;
  let LONGITUDE = 0;
  let LATITUDE_DELTA = 0.1;
  let LONGITUDE_DELTA = 0.1;
  let maxlat = 0;
  let minlat = 999;
  let maxlon = 0;
  let minlon = 999;
  // Loop through all parkhouses
  for (var i = 0; i < parkhouses.length; i++) {
    // If the parkhouse location matches the current selected city
    if (parkhouses[i].site === city) {
      // If either the parkhouse has got available stations or no stations have been passed
      if (
        (typeof placesList !== typeof undefined &&
          placesList.indexOf(parkhouses[i].id) >= 0) ||
        typeof placesList === typeof undefined
      ) {
        // Add the coordinates => later divide it by the number of parkhouses to get the center
        matched++;
        let latitude = parseFloat(parkhouses[i].latitude);
        let longitude = parseFloat(parkhouses[i].longitude);
        LATITUDE += latitude;
        LONGITUDE += longitude;
        if (latitude > maxlat) {
          maxlat = latitude;
        }
        if (latitude < minlat) {
          minlat = latitude;
        }
        if (longitude > maxlon) {
          maxlon = longitude;
        }
        if (longitude < minlon) {
          minlon = longitude;
        }
      }
    }
  }
  // After all parkhouses that are relevant have been added check if the customer has entered an target and if so add it to the coordinates
  if (typeof target !== typeof undefined) {
    matched++;
    let latitude = parseFloat(target.geometry.location.lat);
    let longitude = parseFloat(target.geometry.location.lng);
    LATITUDE += latitude;
    LONGITUDE += longitude;
    if (latitude > maxlat) {
      maxlat = latitude;
    }
    if (latitude < minlat) {
      minlat = latitude;
    }
    if (longitude > maxlon) {
      maxlon = longitude;
    }
    if (longitude < minlon) {
      minlon = longitude;
    }
  }
  // If there is only one match or two there needs to be a special handling of the LATITUDE_DELTA and LONGITUDE_DELTA to have a correct zoom
  if (matched > 1) {
    LATITUDE_DELTA = maxlat - minlat;
    if (matched > 2) {
      LATITUDE_DELTA = LATITUDE_DELTA * 1.2;
    } else {
      LATITUDE_DELTA = LATITUDE_DELTA * 2;
    }
  } else {
    LATITUDE_DELTA = 0.01;
  }
  if (matched > 1) {
    LONGITUDE_DELTA = maxlon - minlon;
    if (matched > 2) {
      LONGITUDE_DELTA = LONGITUDE_DELTA * 1.2;
    } else {
      LONGITUDE_DELTA = LONGITUDE_DELTA * 2;
    }
  } else {
    LONGITUDE_DELTA = 0.01;
  }
  // Calculate the final coordinates by dividing the difference beteen max and min coordinate by two
  LATITUDE = (maxlat + minlat) / 2 + (matched > 2 ? 0.001 : 0);
  LONGITUDE = (maxlon + minlon) / 2;
  return {
    LONGITUDE,
    LATITUDE,
    LATITUDE_DELTA,
    LONGITUDE_DELTA,
  };
};

/**
 * Collect all parkhouse ids filtered by city
 * @param {Array} parkhouses
 * @param {String} city
 */
const getParkhouseIdsByCity = function (parkhouses, city) {
  let ids = [];
  for (var i = 0; i < parkhouses.length; i++) {
    if (parkhouses[i].site === city) {
      ids.push(parkhouses[i].id);
    }
  }
  return ids;
};

/**
 * Collect all parkhouse coordinates filtered by city
 * @param {Array} parkhouses
 * @param {String} city
 */
const getParkhouseCoordinatesByCity = function (parkhouses, city) {
  let coordinates = [];
  for (var i = 0; i < parkhouses.length; i++) {
    if (parkhouses[i].site === city) {
      coordinates.push({
        latitude: parseFloat(parkhouses[i].latitude),
        longitude: parseFloat(parkhouses[i].longitude),
      });
    }
  }
  return coordinates;
};

/**
 * Filter the shown charging station places by some to hide parkhouses
 * @param {Array} parkhouses
 * @param {String} city
 */
const filterPlaces = function (places) {
  const toRemove = ['9999', '7301', '6949', '6950'];
  return places.filter(function (el) {
    return toRemove.indexOf(el) < 0;
  });
};

// Export all functions so that they can be used globally throughout the app
module.exports = {
  parseDate,
  formatDate,
  calcDim,
  /**
   * Goes through a list of parkhouses which can be passed a props and searches for a parkhouse matching the phid which can be passed as navigation parameter.
   * @returns Component which has a special property parkhouse
   * @todo check if withParkhouse can be moved outside of the export like all other functions
   * @param {Component} Component
   */
  withParkhouse: NewComponent => {
    return props => {
      if (typeof props.parkobjects !== typeof undefined) {
        var { parkobjects } = props;
      } else {
        var { parkhouses } = props;
        var parkobjects = parkhouses.parkhouses;
      }
      let phid = props.phid;
      if (
        typeof phid === typeof undefined &&
        typeof props.route !== typeof undefined &&
        typeof props.route.params !== typeof undefined
      ) {
        phid = props.route.params.phid;
      }

      let selectedParkhouse = null;
      if (parkobjects.length) {
        for (var i = 0; i < parkobjects.length; i++) {
          if (parkobjects[i].id == phid) {
            selectedParkhouse = parkobjects[i];
          }
        }
      }
      return <NewComponent {...props} parkhouse={selectedParkhouse} />;
    };
  },
  sortParkhouses,
  sortParkhousesByDistance,
  sortParkhousesByCity,
  groupParkhousesByCity,
  sortPlacesByParkhouses,
  calculateDistances,
  getDistanceFromLatLonInKm,
  deg2rad,
  filterParkhousesByCity,
  startNavigation,
  getCityList,
  calcCenterCoordinate,
  getParkhouseIdsByCity,
  getParkhouseCoordinatesByCity,
  differenceBetweenDatesInDays,
  filterPlaces,
};
