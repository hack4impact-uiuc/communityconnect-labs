from api.core import logger
from api.models import db, CensusResponse
import re


def get_response_rates_by_date(date):
    response_rates = {}

    responses = CensusResponse.objects()
    year = date[-4:]

    for resp in responses:
        rate = resp.rates[year][date]
        response_rates[resp.tract_id] = rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]


def get_response_rates_by_year(year):
    response_rates = {}

    responses = CensusResponse.objects()

    for resp in responses:
        rates = resp.rates[year]
        end_rate = rates[max(rates, key=str)]
        response_rates[resp.tract_id] = end_rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]


def get_response_rates_by_state(state, date):
    response_rates = {}

    regex = re.compile("^{}.*".format(state))
    logger.info(regex)
    responses = CensusResponse.objects(tract_id=regex)
    year = date[-4:]

    for resp in responses:
        rate = resp.rates[year][date]
        response_rates[resp.tract_id] = rate

    return [{"tract_id": tid, "rate": rate} for tid, rate in response_rates.items()]
