import React from "react";
import mapboxgl from "mapbox-gl";
import {
  stateLayers,
  sourceIDs,
  countryLayer,
  mockStates,
  stateGeoIds
} from "../resources/stateLayers.js";
import Geocoder from "react-geocoder-autocomplete";
import { getBatchResponseByTractIDAndYear } from "../utils/apiWrapper";
import "../styles/index.css";
import "../styles/sidebar.css";
import logoWithText from "../resources/ccl_logo_text.png";
import Graph from "./Graph.js";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWVnaGFieXRlIiwiYSI6ImNrMXlzbDYxNzA3NXYzbnBjbWg5MHd2bGgifQ._sJyE87zG6o5k32efYbrAA";

const MIN_TRACT_ZOOM = 8;
const MAX_ZOOM = 22;
const MIN_ZOOM = 2.5;
const MAX_BOUNDS = [-171.791110603, 18.91619, -66.96466, 71.3577635769];

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lng: -97,
      lat: 38,
      zoom: 3.7,
      searchText: "",
      tractSelected: false,
      currentTract: {},
      geocoderValue: "",
      displayGraph: false
    };
    this.map = null;
    this.tractCache = {};
  }

  getCensusMBRColor = response_rate => {
    // temp for now, separation lines not final
    if (response_rate < 10) {
      return { color: "#b71c1c" };
    } else if (response_rate < 20) {
      return { color: "#c62828" };
    } else if (response_rate < 30) {
      return { color: "#d32f2f" };
    } else if (response_rate < 40) {
      return { color: "#E65100" };
    } else if (response_rate < 50) {
      return { color: "#EF6C00" };
    } else if (response_rate < 60) {
      return { color: "#F57C00" };
    } else if (response_rate < 70) {
      return { color: "#FB8C00" };
    } else if (response_rate < 80) {
      return { color: "#388E3C" };
    } else if (response_rate < 90) {
      return { color: "#2E7D32" };
    } else if (response_rate <= 100) {
      return { color: "#1B5E20" };
    }
  };

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: "mapbox://styles/meghabyte/ck1yssrtr3sge1drt4qb8kdde",
      center: [lng, lat],
      zoom,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
      maxBounds: MAX_BOUNDS
    });

    this.map.on("load", () => {
      this.initTracts();
    });

    this.map.on("move", () => {
      const { lng, lat } = this.map.getCenter();
      const zoom = this.map.getZoom().toFixed(2);

      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom
      });
    });

    this.map.on("moveend", () => {
      const zoom = this.map.getZoom().toFixed(2);
      if (zoom > MIN_TRACT_ZOOM) {
        let tractIDs = this.getRenderedTracts();
        if (tractIDs.length > 0) {
          this.updateRenderedTracts(tractIDs);
        }
      }
    });

    this.map.on("click", e => {
      if (this.map.getZoom() > 8) {
        const tracts = this.map.queryRenderedFeatures(e.point, {
          layers: sourceIDs
        });

        if (tracts.length > 0) {
          this.setState({
            tractSelected: true,
            currentTract: {
              name: tracts[0].properties.NAMELSAD,
              id: tracts[0].properties.GEOID
            },
            displayGraph: true,
            tract_id: tracts[0].properties.GEOID
          });
        } else {
          this.setState({
            tractSelected: false,
            currentTract: null,
            displayGraph: false
          });
        }
      }
    });

    this.map.on("zoom", () => {
      let stateVisibility = this.map.getZoom() > 8 ? "none" : "visible";
      let tractVisibility = stateVisibility === "none" ? "visible" : "none";

      this.map.setLayoutProperty("00", "visibility", stateVisibility);
      stateGeoIds.map(id => {
        this.map.setLayoutProperty(id, "visibility", tractVisibility);
      });
    });
  }

  initTracts() {
    var tractData = { "0": 0 };
    this.setState({
      tractData: tractData
    });
    const fillColor = this.generateFillColor(tractData);

    stateLayers.map(stateLayer => {
      const id = stateLayer.id;
      this.map.addLayer(
        {
          id: id,
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
      return 0;
    });

    this.map.addLayer(
      {
        id: countryLayer.id,
        type: "fill",
        source: {
          type: "vector",
          url: countryLayer.sourceURL
        },
        "source-layer": countryLayer.sourceLayer,
        paint: {
          "fill-color": this.generateFillColor(mockStates)
        }
      },
      "state-label"
    );
  }

  getRenderedTracts() {
    let tracts = [];
    stateLayers.forEach(stateLayer => {
      const stateTracts = this.map.queryRenderedFeatures({
        layers: [stateLayer.id],
        validate: false
      });
      tracts = tracts.concat(stateTracts);
    });

    let tractIDs = tracts.map(tract => tract.properties.GEOID);
    return tractIDs;
  }

  updateRenderedTracts(tractIds) {
    var tractsToRequest = [];
    for (const tract_id of tractIds) {
      if (!(tract_id in this.tractCache)) {
        tractsToRequest.push(tract_id);
      }
    }

    if (tractsToRequest.length === 0) {
      this.renderFromCache(tractIds);
    } else {
      getBatchResponseByTractIDAndYear(tractsToRequest, "2010")
        .then(response => {
          const responseRates = response.data.result.response_rates;
          for (const responseRate of responseRates) {
            const { rates, tract_id } = responseRate;
            this.tractCache[tract_id] = rates[0];
          }
          // ignore missing tracts
          for (const tract_id of tractsToRequest) {
            if (!(tract_id in this.tractCache)) {
              this.tractCache[tract_id] = undefined;
            }
          }

          this.renderFromCache(tractIds);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  renderFromCache(tractIds) {
    var tractsToRender = {};
    tractIds.forEach(id => {
      tractsToRender[id] = this.tractCache[id];
    });
    this.renderTracts(tractsToRender);
  }

  generateFillColor(tractData) {
    console.log(tractData);
    const fillColor = ["match", ["get", "GEOID"]];

    // converting the response rate into a color
    const LIGHTEST = [233, 244, 222];
    const DARKEST = [64, 89, 34];
    const geoIds = Object.keys(tractData);
    geoIds.map(geoId => {
      const rate = tractData[geoId];
      if (rate === undefined) {
        return;
      }
      const red = (1 - rate) * (LIGHTEST[0] - DARKEST[0]) + DARKEST[0];
      const green = (1 - rate) * (LIGHTEST[1] - DARKEST[1]) + DARKEST[1];
      const blue = (1 - rate) * (LIGHTEST[2] - DARKEST[2]) + DARKEST[2];
      const color = "rgba(" + red + ", " + green + ", " + blue + ", 0.8)";
      return fillColor.push(geoId, color);
    });

    fillColor.push("rgba(0,0,0,0)");
    return fillColor;
  }

  renderTracts(tractData) {
    this.setState({
      tractData: tractData
    });
    const fillColor = this.generateFillColor(tractData);
    let currentStateGeoIds = Object.keys(tractData).map(id =>
      id.substring(0, 2)
    );
    currentStateGeoIds = currentStateGeoIds.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    currentStateGeoIds.forEach(id => {
      this.map.setPaintProperty(id, "fill-color", fillColor);
    });
  }

  render() {
    const { lng, lat, zoom } = this.state;

    return (
      <div>
        <div className="map">
          <div className="inline-block absolute top right mt12 mr12 bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold">
            <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
          </div>
          <div
            ref={el => (this.mapContainer = el)}
            className="absolute top right bottom mapbox"
          />
        </div>
        <div>
          <div className="sidebar">
            <img
              src={logoWithText}
              alt="CCL Logo"
              className="sidebar-logo-text"
            />
            <div className="geocoder">
              <Geocoder
                accessToken={mapboxgl.accessToken}
                value={this.state.searchText}
                onInput={e => {
                  this.setState({ searchText: e });
                }}
                onSelect={e => {
                  this.map.flyTo({ center: e.center, zoom: 10 });
                }}
                showLoader={true}
                inputClass="search-input"
                inputPlaceholder="Search for county, address or zipcode"
                resultClass="search-results"
                bbox={MAX_BOUNDS}
              />
            </div>

            {this.state.tractSelected && (
              <div className="detail-box">
                <div className="detail-box-inner">
                  <h1>{this.state.currentTract.id}</h1>
                  <h1>{this.state.currentTract.name}</h1>
                  <h2>Latest Census Response Rate</h2>
                  {isNaN(this.state.tractData[this.state.currentTract.id]) ? (
                    <div>Data unavailable</div>
                  ) : (
                    <div
                      style={this.getCensusMBRColor(
                        this.state.tractData[this.state.currentTract.id] * 100
                      )}
                    >
                      <h3>
                        {(
                          this.state.tractData[this.state.currentTract.id] * 100
                        ).toFixed(0)}
                        %
                      </h3>
                      <h4 className="h3_year">in 2010</h4>
                    </div>
                  )}
                </div>
              </div>
            )}

            {this.state.displayGraph && (
              <Graph
                key={this.state.tract_id}
                tract_id={this.state.tract_id}
              ></Graph>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
