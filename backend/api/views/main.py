from flask import Blueprint, request, jsonify
from api.models import db, Person, Email, CensusResponse
from api.core import create_response, serialize_list, logger

from .populate_db import parse_census_data
from .web_scrap import extract_data_links
from .response_rates import *
import time

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


'''
function that is called when you visit /response_rates
Parameters
    date: date string with the format MMDDYYYY
    year: year string with format YY
    optional tract_id: 11-digit tract id string
    optional state: two digit id string
Either date or year is required.
'''
@main.route("/response_rates", methods=["GET"])
def get_response_rates():
    responses_rate = None
    
    tract_id = request.args.get("tract_id", None)
    date = request.args.get("date", None)
    year = request.args.get("year", None)
    state = request.args.get("state", None)

    if date:
        response_rates = get_response_rates_by_date(date, tract_id, state)
    elif year:
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
    t_old = time.time()

    files = extract_data_links(parent_link)

    parse2000 = True
    dates = list(files.values())
    dates.sort()
    date_initial = dates[0]
    objs = {}
    t_total = time.time()
    num_files = 5
    for file, date in files.items():
        num_files -= 1
        if num_files == -1:
            break
        t_new = time.time()
        print(t_new-t_old)
        t_old = t_new
        print(date)
        responses = parse_census_data(file, date, date_initial, parse2000) # 8 sec
        # print("parse time: ")
        # t_new = time.time()
        # print(t_new-t_old)
        # t_old = t_new
        parse2000 = False
        count = 0
        # print(len(responses))
        for r in responses: # 3 sec
            if r.tract_id in objs:
                existing = objs[r.tract_id]
                r.update(existing)
                objs[r.tract_id] = r
            else:
                objs[r.tract_id] = r
        # print(len(objs.values()))
    t_new = time.time()
    print(t_new-t_total)

    t_new = time.time()
    t_old = t_new
    count = 0
    for r in objs.values():
        count += 1
        if count % 1000 == 1:
            t_new = time.time()
            print(t_new-t_old)
            t_old = t_new
        try:
            existing = CensusResponse.objects.get(tract_id=r.tract_id)
        except:
            existing = []
        if len(existing) > 0:
            existing.update(r)
            existing.save()
        else:
            r.save()

        # for r in responses:
        #     count += 1
        #     if count % 500 == 0: # 1.8 sec per 500
        #         t_new = time.time()
        #         print(t_new-t_old)
        #         t_old = t_new
        #     try:
        #         existing = CensusResponse.objects.get(tract_id=r.tract_id)
        #     except:
        #         existing = []
        #     if len(existing) > 0:
        #         existing.update(r)
        #         objs[r.tract_id] = existing
        #     else:
        #         objs[r.tract_id] = r
        # t_new = time.time()
        # print(t_new-t_old)
        # t_old = t_new
        # print(len(objs.values()))

        #     count += 1
        #     if count % 500 == 0: # 2.3 sec per 500
        #         t_new = time.time()
        #         print(t_new-t_old)
        #         t_old = t_new
        #     try:
        #         existing = CensusResponse.objects.get(tract_id=r.tract_id)
        #     except:
        #         existing = []
        #     if len(existing) > 0:
        #         existing.update(r)
        #         existing.save()
        #         # filtered_resps.append(existing)
        #     else:
        #         objs[r.tract_id] = existing
        #         # filtered_resps.append(r)
        # CensusResponse.objects.insert(filtered_resps)
            # count += 1
            # if count % 500 == 0: # 3.5 sec per 500
            #     t_new = time.time()
            #     print(t_new-t_old)
            #     t_old = t_new
            # existing = CensusResponse.objects(tract_id=r.tract_id)
            # if len(existing) > 0:
            #     existing = existing[0]
            #     existing.update(r)
            #     existing.save()
            # else:
            #     r.save()


    return create_response(
        message=f"Successfully added {len(responses)} new Census Responses"
    )
