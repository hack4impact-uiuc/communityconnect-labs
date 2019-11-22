from flask import Blueprint, request, jsonify
from api.models import db, CensusResponse
from api.core import create_response, serialize_list, logger

from .populate_db import parse_census_data
from .web_scrap import extract_data_links
from .response_rates import *

main = Blueprint("main", __name__)  # initialize blueprint

"""
function that is called when you visit /rate
Parameters
    year: year string with format YYYY
    optional tract_id: 11-digit tract id string
    optional state: two digit id string
"""


@main.route("/rate", methods=["GET"])
def get_response_rates():
    year = request.args.get("year", None)
    tract_id = request.args.get("tract_id", None)
    state = request.args.get("state", None)

    if year:
        response_rates = get_last_response_rates_by_year(year, tract_id, state)
    else:
        return create_response(status=422, message="Missing request parameters")

    return create_response(data={"response_rates": response_rates})


"""
function that is called when you visit /rates_per_period
Parameters
    year: year string with format YYYY
    optional tract_id: 11-digit tract id string
    optional state: two digit id string
"""


@main.route("/rates_per_period", methods=["GET"])
def get_response_rates_per_period():
    year = request.args.get("year", None)
    tract_id = request.args.get("tract_id", None)
    state = request.args.get("state", None)

    if year:
        response_rates = get_response_rates_by_year(year, tract_id, state)
    else:
        return create_response(status=422, message="Missing request parameters")

    return create_response(data={"response_rates": response_rates})


@main.route("/census_response", methods=["POST"])
def populate_db():
    data = request.get_json()
    if "parent_link" not in data:
        msg = "No parent link."
        logger.info(msg)
        return create_response(status=422, message=msg)

    parent_link = data["parent_link"]
    logger.info("Populating Census Response Data from {}".format(parent_link))

    files = extract_data_links(parent_link)

    parse2000 = True
    dates = list(files.values())
    dates.sort()
    date_initial = dates[0]
    responses = {}
    for file, date in files.items():  # 300 sec total
        one_date_responses = parse_census_data(
            file, date, date_initial, parse2000
        )  # 8 sec
        parse2000 = False
        for r in one_date_responses:  # 3 sec
            if r.tract_id in responses:
                existing = responses[r.tract_id]
                r.update(existing)
                responses[r.tract_id] = r
            else:
                responses[r.tract_id] = r

    for r in responses.values():
        try:
            existing = CensusResponse.objects.get(tract_id=r.tract_id)
        except:
            existing = []
        if len(existing) > 0:
            existing.update(r)
            existing.save()
        else:
            r.save()

    return create_response(
        message=f"Successfully added {len(responses)} new Census Responses"
    )
