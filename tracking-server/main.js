/*eslint-disable unknown-require, semi, no-unused-vars, no-undef-expression*/

/*globals generatedPaths */
const _async = require('asyncawait/async');
const _await = require('asyncawait/await');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const trackerConfig = require('./tracker_configuration.json');
const Promise = require('bluebird');

const panelConfig = require('./panels_config.json');
const googleMapsClient = require('@google/maps').createClient({
  key: trackerConfig.mapsApiKey,
  Promise
}); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: trackerConfig.databaseURL
});

// Database references
const busLocationsRef = admin.database().ref('bus-locations');
const mapRef = admin.database().ref('map');
const panelsRef = admin.database().ref('panels');
const timeRef = admin.database().ref('current-time');

// Library classes
const {BusSimulator} = require('./bus_simulator.js');
const {GTFS} = require('./gtfs.js');
const {HeartBeat} = require('./heart_beat.js');
const {TimeTable} = require('./time_table.js');
const {PanelChanger} = require('./panel_changer');
const {generatedPaths} = require('./generate_paths');
const gtfs = new GTFS();

new HeartBeat(timeRef, trackerConfig.simulation);
new TimeTable(timeRef, panelsRef, gtfs, panelConfig, googleMapsClient);
new PanelChanger(mapRef, panelConfig);

if (trackerConfig.simulation) {
  new BusSimulator(timeRef, gtfs, busLocationsRef, generatedPaths);
} else {
  // Exercise for the reader: integrate real bus location data
}