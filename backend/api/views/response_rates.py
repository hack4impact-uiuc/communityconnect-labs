from api.core import logger
from api.models import db, CensusResponse
import re

'''
Returns response rate by date
Parameters: date string with format MMDDYYYY
Output:
    [
    {"tract_id": string, "rate": float},
    ...
    ]
'''
def get_response_rates_by_date(date):
    response_rates = {}

    responses = CensusResponse.objects()
    year = date[-4:]

    for resp in responses:
        rate = resp.rates[year][date]
        response_rates[resp.tract_id] = rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]

'''
Returns response rate by year
Parameters: date string with format YY
Output:
    [
    {"tract_id": string, "rate": float},
    ...
    ]
The returned rate is the response rate on the last collection day in the year
'''
def get_response_rates_by_year(year):
    response_rates = {}

    responses = CensusResponse.objects()

    for resp in responses:
        rates = resp.rates[year]
        end_rate = rates[max(rates, key=str)]
        response_rates[resp.tract_id] = end_rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]

'''
Returns response rate by date
Parameters: date string with format MMDDYYYY
            2 digit state id
Output:
    [
    {"tract_id": string, "rate": float},
    ...
    ]
'''
def get_response_rates_by_state(state, date):
    response_rates = {}

    # this regex is looking for all tract ids that start with the 2-digit state ID
    regex = re.compile("^{}.*".format(state))
    responses = CensusResponse.objects(tract_id=regex)
    year = date[-4:]

    for resp in responses:
        rate = resp.rates[year][date]
        response_rates[resp.tract_id] = rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]
