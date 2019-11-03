import React from "react";
import mapboxgl from "mapbox-gl";
import stateLayers from "../resources/stateLayers.js";
import {
  getResponseByTractID,
  getResponseRatesByDate
} from "../utils/apiWrapper";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWVnaGFieXRlIiwiYSI6ImNrMXlzbDYxNzA3NXYzbnBjbWg5MHd2bGgifQ._sJyE87zG6o5k32efYbrAA";

const MAX_ZOOM = 22;
const MIN_ZOOM = 2.5;
const MAX_BOUNDS_SW = new mapboxgl.LngLat(-175, 5);
const MAX_BOUNDS_NE = new mapboxgl.LngLat(-25, 73);
const MAX_BOUNDS = new mapboxgl.LngLatBounds(MAX_BOUNDS_SW, MAX_BOUNDS_NE);
const MAP_TRACTS = stateLayers.map(x => x);

class MapBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -97,
      lat: 38,
      zoom: 3.7,
      tractSelected: false,
      currentTract: {},
      tractToRates: {}
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    let map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/meghabyte/ck1yssrtr3sge1drt4qb8kdde",
      center: [lng, lat],
      zoom,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: MAX_BOUNDS
    });

    // TODO: set a default start date?
    getResponseRatesByDate("03312010").then(data => {
      var responseRates = data.data.result.response_rates;

      // We're going to map IDs to response rates so we can display them
      var tractToRates = {};
      responseRates.forEach(response_rate => {
        tractToRates[response_rate.tract_id] = response_rate.rate;
      });
      this.setState({
        tractToRates: tractToRates
      });

      var tractData = responseRates.map(response_rate => {
        return {
          GEOID: response_rate.tract_id,
          response_rate: response_rate.rate
        };
      });

      map.on("load", function() {
        var fillColor = ["match", ["get", "GEOID"]];

        // converting the response rate into a color
        const LIGHTEST = [233, 244, 222];
        const DARKEST = [64, 89, 34];
        tractData.forEach(row => {
          var rate = row["response_rate"];
          // push the rate onto a property
          var red = (1 - rate) * (LIGHTEST[0] - DARKEST[0]) + DARKEST[0];
          var green = (1 - rate) * (LIGHTEST[1] - DARKEST[1]) + DARKEST[1];
          var blue = (1 - rate) * (LIGHTEST[2] - DARKEST[2]) + DARKEST[2];
          var color = "rgba(" + red + ", " + green + ", " + blue + ", 0.8)";
          fillColor.push(row["GEOID"], color);
        });

        fillColor.push("rgba(0,0,0,0)");

        stateLayers.map(stateLayer => {
          map.addLayer(
            {
              id: stateLayer.sourceURL,
              type: "fill",
              source: {
                type: "vector",
                url: stateLayer.sourceURL
              },
              "source-layer": stateLayer.sourceLayer,
              paint: {
                "fill-color": fillColor
              }
            },
            "state-label"
          );
        });
      });
    });

    map.on("move", () => {
      const { lng, lat } = map.getCenter();

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: map.getZoom().toFixed(2)
      });
    });

    map.on("mousemove", e => {
      MAP_TRACTS.forEach(element => {
        var tracts = map.queryRenderedFeatures(e.point, {
          // TODO: get all layers using a .map on stateLayers instead of hardcoding IL
          layers: ["mapbox://meghabyte.ac7v02uw"]
        });

        if (tracts.length > 0) {
          this.setState({
            tractSelected: true,
            currentTract: {
              name: tracts[0].properties.NAMELSAD,
              id: tracts[0].properties.GEOID
            }
          });
        } else {
          this.setState({
            tractSelected: false,
            currentTract: null
          });
        }
      });
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="inline-block absolute top left mt12 ml12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
          <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        </div>
        <div
          ref={el => (this.mapContainer = el)}
          className="absolute top right left bottom"
        />
        <div className="map-overlay" id="features">
          {this.state.tractSelected ? (
            <>
              <h2> {this.state.currentTract.name} </h2>
              <p>
                {" "}
                Response rate:{" "}
                {this.state.tractToRates[this.state.currentTract.id]}{" "}
              </p>
            </>
          ) : (
            <p> Hover over to see more detailed info! </p>
          )}
        </div>
      </div>
    );
  }
}

export default MapBox;
