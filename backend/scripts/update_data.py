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
    with open('chartData.csv') as f:
        for resp in CensusResponse.objects:
            for
            r = CensusResponse(
                    tract_id=resp.tract_id,
                    county=resp.county,
                    rates={"2020P": {str(days_after): [float(row[mean_rate_idx]), float(row[sd_idx]), days_after]}},
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
            if count % 100 == 0:
                print(count)
            try:
                existing = CensusResponse.objects.get(tract_id=r.tract_id)
                existing.update(r)
                existing.save()
            except:
                r.save()


if __name__ == "__main__":
    init()
    main()