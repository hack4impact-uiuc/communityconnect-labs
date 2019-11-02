import React from "react";
import mapboxgl from "mapbox-gl";
import stateLayers from "../resources/stateLayers.js";
import { getResponseByTractID } from "../utils/apiWrapper";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWVnaGFieXRlIiwiYSI6ImNrMXlzbDYxNzA3NXYzbnBjbWg5MHd2bGgifQ._sJyE87zG6o5k32efYbrAA";

const MAX_ZOOM = 22;
const MIN_ZOOM = 2.5;
const MAX_BOUNDS_SW = new mapboxgl.LngLat(-175, 5);
const MAX_BOUNDS_NE = new mapboxgl.LngLat(-25, 73);
const MAX_BOUNDS = new mapboxgl.LngLatBounds(MAX_BOUNDS_SW, MAX_BOUNDS_NE);
const MAP_TRACKS = stateLayers.map(x => x);

class MapBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -97,
      lat: 38,
      zoom: 3.7,
      trackSelected: false
    };
  }

  componentDidMount() {
    // TODO: Replace the log below with a valid tract request
    console.log(getResponseByTractID("0"));
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

    // temporary data for testing
    const testData = [
      { GEOID: "12095010200", response_rate: 0.73 }, // florida (orlando)
      { GEOID: "06085505009", response_rate: 0.56 } // california- meg's home tract
    ];

    map.on("load", function() {
      var fillColor = ["match", ["get", "GEOID"]];

      // converting the response rate into a color
      testData.forEach(function(row) {
        var green = (row["response_rate"] / 1) * 255;
        var color = "rgba(" + 0 + ", " + green + ", " + 0 + ", 1)";
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
          "admin-country"
        );
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

    map.on('mousemove', (e) => {
      //MAP_TRACKS.forEach((element) => {
        var tracks = map.queryRenderedFeatures(e.point, {
          layers: MAP_TRACKS
        });

        if (tracks.length > 0) {
          console.log("true");
          this.setState({
            trackSelected: true
          })
        } else {
          console.log("false");
          this.setState({
            trackSelected: false
          })
        }
//});
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
        <div className='map-overlay' id='features'><h6> tract </h6><h2>City Name</h2>
        {this.state.trackSelected ? (<p> Tract Data! </p>) : (<p>Hover over to see more detailed info!</p>)} </div>
      </div>
    );
  }
}

export default MapBox;
