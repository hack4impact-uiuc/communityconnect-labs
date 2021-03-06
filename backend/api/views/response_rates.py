from api.core import logger
from api.models import db, CensusResponse
import re
import time

DATE_FORMAT = "%m%d%Y"


def get_year(date):
    return str(time.strptime(date, DATE_FORMAT).tm_year)


"""
returns a collection of CensusResponses
filtered by tract_id if tract_id parameter is not None
"""


def get_census_responses(tract_id=None, state=None, tract_ids=None):
    if state:
        regex = re.compile(
            "^{}.*".format(state)
        )  # this regex searched for all tract_ids that begin with the state ID
        return CensusResponse.objects(tract_id=regex)
    elif tract_id:
        return CensusResponse.objects(tract_id=tract_id)
    elif tract_ids:
        return CensusResponse.objects(tract_id__in=tract_ids)
    else:
        return CensusResponse.objects()


"""
Returns response rate by year
Parameters:
    year: string with format YYYY
    optional tract_id: string 11 digit tract id
    optional state id: string 2 digit state id
Output:
    [
    {"tract_id": string, "rate": float},
    ...
    ]
The returned rate is the response rate on the last collection day in the year
"""


def get_last_response_rates_by_year(year, tract_id=None, state=None):
    response_rates = {}

    responses = get_census_responses(tract_id, state)

    for resp in responses:
        if year in resp.rates:
            rates = resp.rates[year]
            end_rate = rates[max(rates, key=str)]
            response_rates[resp.tract_id] = end_rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]


"""
Returns all response rates by year
Parameters:
    year: string with format YYYY, or YYYYp for predictive rates
    optional tract_id: string 11 digit tract id
    optional state id: string 2 digit state id
Output:
    [
    {"tract_id": string, "rates": {"date": rate, ...}},
    ...
    ]
"""


def get_response_rates_by_year(year, tract_id=None, state=None):
    response_rates = {}

    responses = get_census_responses(tract_id, state)

    for resp in responses:
        if year in resp.rates:
            rates = resp.rates[year]
            response_rates[resp.tract_id] = {
                rate[1]: rate[0] for _, rate in rates.items()
            }

    return [{"tract_id": tid, "rates": rate} for tid, rate in response_rates.items()]


def get_predictive_by_tract_id(year, tract_id):
    response_rates = {}

    responses = get_census_responses(tract_id)

    for resp in responses:
        if year in resp.rates and tract_id:
            rates = resp.rates[year]
            response_rates[resp.tract_id] = {
                rate[2]: [rate[0], rate[1]] for _, rate in rates.items()
            }

    return [{"rates": rate} for tid, rate in response_rates.items()]


def get_batch_response_rates_by_year(year, tract_ids):
    response_rates = {}
    responses = get_census_responses(tract_ids=tract_ids)

    for resp in responses:
        if year in resp.rates:
            rates = resp.rates[year]
            response_rates[resp.tract_id] = {
                rate[1]: rate[0] for _, rate in rates.items()
            }

    return [{"tract_id": tid, "rates": rate} for tid, rate in response_rates.items()]
