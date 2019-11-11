import axios from "axios";

export const getResponseByTractID = tract_id => {
  /**
   * Given:
   * tract id in database
   *
   * Returns all tracts associated to that id upon success
   * Returns GET_TRACT_DATA_FAIL upon failure
   */
  const requestString = `http://localhost:5000/response_data?tract_id=${tract_id}`;
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
  const requestString = `http://localhost:5000/census_response?date=${date}`;
  return axios.get(requestString).catch(error => {
    return {
      type: "GET_TRACT_DATA_FAIL",
      error
    };
  });
};
