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
        "host": "mongodb+srv://%s:%s@ccl-census-c9iza.gcp.mongodb.net/test?retryWrites=true&w=majority"
        % (user, password),
    }
    from api.models import db

    db.init_app(app)  # initialize Flask MongoEngine with this flask app
    Migrate(app, db)


def main():
    with open("chartData.csv") as f:
        reader = csv.reader(f)
        rows = list(reader)
        idx_idx = 0
        id_idx = 1
        treat_idx = 3
        mean_rate_idx = 4
        sd_idx = 5
        county_idx = 7
        num_days_idx = 12
        start_days = 10

        responses = {}
        for row in rows:
            if row[treat_idx] == "1" or row[treat_idx] == "treat":
                continue
            row_id = row[id_idx]
            if len(row_id) == 10:
                row_id = "0" + row_id
            days_after = int(row[num_days_idx]) - start_days
            r = CensusResponse(
                tract_id=row_id,
                county=row[county_idx],
                rates={
                    "2020": {
                        str(days_after): [
                            float(row[mean_rate_idx]),
                            float(row[sd_idx]),
                            days_after,
                        ]
                    }
                },
            )
            if r.tract_id in responses:
                existing = responses[r.tract_id]
                r.update(existing)
                responses[r.tract_id] = r
            else:
                responses[r.tract_id] = r

        for r in responses.values():
            try:
                existing = CensusResponse.objects.get(tract_id=r.tract_id)
                existing.update(r)
                existing.save()
            except:
                r.save()


if __name__ == "__main__":
    init()
    main()
