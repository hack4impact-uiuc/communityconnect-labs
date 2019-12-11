import csv
import os
from flask import Flask, request
from flask_migrate import Migrate

import sys
sys.path.append("..")

from api.models import CensusResponse

from dotenv import load_dotenv
load_dotenv()

def init():
    app = Flask(__name__)
    user = os.environ.get("MONGO_USER")
    password = os.environ.get("MONGO_PASSWORD")
    db = os.environ.get("MONGO_DB")
    app.config["MONGODB_SETTINGS"] = {
        "db": db,
        "host": "mongodb+srv://%s:%s@ccl-census-c9iza.gcp.mongodb.net/test?retryWrites=true&w=majority" % (user, password),
    }
    from api.models import db

    db.init_app(app)  # initialize Flask MongoEngine with this flask app
    Migrate(app, db)

def main():
    responses = {}
    count = 0
    for resp in CensusResponse.objects:
        count += 1
        if count % 1000 == 0:
            print(count)
        if "2020" not in resp.rates:
            continue
        print(resp.tract_id)
        old_2020_rates = resp.rates["2020"]
        # print(old_2020_rates)
        # print(type(old_2020_rates))
        for days_after, data in old_2020_rates.items():
            r = CensusResponse(
                    tract_id=resp.tract_id,
                    county=resp.county,
                    rates={"2020P": {days_after: [float(data[0]/100), float(data[1]/100), days_after]}},
                )
            if r.tract_id in responses:
                existing = responses[r.tract_id]
                r.update(existing)
                responses[r.tract_id] = r
            else:
                responses[r.tract_id] = r
    
    print(len(responses.values()))
    count = 0
    for r in responses.values():
        count += 1
        if count % 1000 == 0:
            print(count)
        try:
            existing = CensusResponse.objects.get(tract_id=r.tract_id)
            if "2020" not in existing.rates:
                continue
            existing.update(r)
            rates = existing.rates
            del rates["2020"]
            existing.rates = rates
            existing.save()
        except:
            # print()
            w = 2
            # r.save()

def del_extras():
    for resp in CensusResponse.objects:
        if "2020P" in resp.rates:
            # print(resp.rates["2020"])
            print(resp.tract_id)
            resp.delete()


if __name__ == "__main__":
    init()
    # del_extras()
    main()