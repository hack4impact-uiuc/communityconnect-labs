import axios from "axios";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/"
    : "https://h4i-ccl-backend.hack4impact1.now.sh/";

export const getResponseByTractID = (tract_id, year) => {
  /**
   * Given:
   * tract id in database
   *
   * Returns all response rates associated to that id upon success
   * Returns GET_TRACT_DATA_FAIL upon failure
   */
  const requestString = `${BASE_URL}rate?tract_id=${tract_id}&year=${year}`;
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
  const requestString = `${BASE_URL}rates_per_period?tract_id=${tract_id}&year=${year}`;
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

export const getPredictive = (tract_id, actual_year) => {
  /**
   * Given:
   * tract id in database
   * year
   *
   * Returns all tracts associated to that id upon success
   * Returns GET_TRACT_DATA_FAIL upon failure
   */
  const requestString = `${BASE_URL}predictive_rates?tract_id=${tract_id}&actual_year=${actual_year}`;
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

export const getBatchResponseByTractIDAndYear = (tract_ids, year) => {
  /**
   * Given:
   * a list oftract id in database
   * year
   *
   * Returns all rates for the tracts in the given year upon success
   * Returns GET_TRACT_DATA_FAIL upon failure
   */
  const requestString = `${BASE_URL}batch_rates?year=${year}`;
  return axios
    .post(requestString, {
      headers: {
        "Content-Type": "application/json"
      },
      data: { tract_ids, year }
    })
    .catch(error => {
      return {
        type: "GET_TRACT_DATA_FAIL",
        error
      };
    });
};
