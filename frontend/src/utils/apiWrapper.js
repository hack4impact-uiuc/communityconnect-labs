import axios from "axios";

const BASE_URL = "http://localhost:5000/";

export const getResponseByTractID = tract_id => {
  /**
   * Given:
   * tract id in database
   *
   * Returns all response rates associated to that id upon success
   * Returns GET_TRACT_DATA_FAIL upon failure
   */
  const requestString = `${BASE_URL}rate?tract_id=${tract_id}`;
  return axios
    .get(requestString, {
      headers: {
        "Content-Type": "application/text"
      }
    })
    .catch(error => {
      return {
        type: "GET_TRACT_DATA_FAIL",
        error
      };
    });
};

export const getResponseRatesByYear = year => {
  const requestString = `${BASE_URL}rate?year=${year}`;
  return axios.get(requestString).catch(error => {
    return {
      type: "GET_TRACT_DATA_FAIL",
      error
    };
  });
};

export const getResponseByTractIDAndYear = (tract_id, year) => {
  /**
   * Given:
   * tract id in database
   * year
   *
   * Returns all tracts associated to that id upon success
   * Returns GET_TRACT_DATA_FAIL upon failure
   */
  const requestString = `${BASE_URL}response_rates?tract_id=${tract_id}&year=${year}`;
  return axios
    .get(requestString, {
      headers: {
        "Content-Type": "application/text"
      }
    })
    .catch(error => {
      return {
        type: "GET_TRACT_DATA_FAIL",
        error
      };
    });
};
