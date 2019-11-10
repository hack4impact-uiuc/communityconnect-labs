from flask import Blueprint, request, jsonify
from api.models import db, Person, Email, CensusResponse
from api.core import create_response, serialize_list, logger

from .populate_db import parse_census_data
from .web_scrap import extract_data_links

main = Blueprint("main", __name__)  # initialize blueprint

# function that is called when you visit /
@main.route("/")
def index():
    # you are now in the current application context with the main.route decorator
    # access the logger with the logger from api.core and uses the standard logging module
    # try using ipdb here :) you can inject yourself
    logger.info("Hello World!")
    return "Hello World!"


# function that is called when you visit /persons
@main.route("/persons", methods=["GET"])
def get_persons():
    persons = Person.objects()
    return create_response(data={"persons": persons})



# Given:
# date in database
# (optional) tract_id in database
#
# Returns all response rates associated to that date (and id)
@main.route("/census_response", methods=["GET"])
def get_census_response():
    responses = CensusResponse.objects()
    response_rates = []
    check_tract_id = False
    tract_id = 0
    date = request.args["date"]
    if "tract_id" in request.args:
        tract_id = request.args["tract_id"]
        check_tract_id = True
    DATE_INDEX = -4
    year = date[DATE_INDEX:]

    for resp in responses:
        if year in resp.rates and date in resp.rates[year]:
            rate = resp.rates[year][date]
            id_and_rate = {"tract_id": resp.tract_id, "rate": rate}
            if check_tract_id:
                if tract_id == resp.tract_id:
                    response_rates.append(id_and_rate)
            else:
                response_rates.append(id_and_rate)

    return create_response(data={"response_rates": response_rates})


# POST request for /persons
@main.route("/persons", methods=["POST"])
def create_person():
    data = request.get_json()

    logger.info("Data recieved: %s", data)
    if "name" not in data:
        msg = "No name provided for person."
        logger.info(msg)
        return create_response(status=422, message=msg)
    if "emails" not in data:
        msg = "No email provided for person."
        logger.info(msg)
        return create_response(status=422, message=msg)

    #  create MongoEngine objects
    new_person = Person(name=data["name"])
    for email in data["emails"]:
        email_obj = Email(email=email)
        new_person.emails.append(email_obj)
    new_person.save()

    return create_response(
        message=f"Successfully created person {new_person.name} with id: {new_person.id}"
    )


@main.route("/census_response", methods=["POST"])
def populate_db():
    data = request.get_json()
    if "parent_link" not in data:
        msg = "No parent link."
        logger.info(msg)
        return create_response(status=442, message=msg)

    parent_link = data["parent_link"]
    logger.info("Populating Census Response Data from {}".format(parent_link))

    files = extract_data_links(parent_link)

    parse2000 = True
    for file, date in files.items():
        responses = parse_census_data(file, date, parse2000)
        parse2000 = False
        for r in responses:
            existing = CensusResponse.objects(tract_id=r.tract_id)
            if len(existing) > 0:
                existing = existing[0]
                existing.update(r)
                existing.save()
            else:
                r.save()

    return create_response(
        message=f"Successfully added {len(responses)} new Census Responses"
    )
