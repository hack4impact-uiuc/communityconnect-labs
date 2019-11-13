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
  const requestString = `${BASE_URL}response_data?tract_id=${tract_id}`;
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

export const getResponseRatesByDate = date => {
  const requestString = `${BASE_URL}response_rates?date=${date}&state=17`;
  return axios.get(requestString).catch(error => {
    return {
      type: "GET_TRACT_DATA_FAIL",
      error
    };
  });
};
