import datetime
import requests

from api.models import CensusResponse

DELIM = " ||"
NAME = "Tract"
COUNTY = "County"


def validate_data(i, name, t, rate):
    if name != NAME:
        return False
    if rate < 0 or rate > 1:
        return False
    return True


def is_county(t):
    return t == COUNTY


def parse_census_data(link, date, date_initial, parse2000=False):
    result = requests.get(link).text
    rows = result.strip().split("\n")
    responses = []
    id_to_county = {}
    date_initial_obj = datetime.datetime.strptime(date_initial, "%m%d%Y").date()

    rows.sort() # might be needed later because current code assumes counties are placed before tracts
    for row in rows:
        columns = row.split(DELIM)
        i = columns[0]
        name = columns[1]
        t = columns[2]
        rates = [float(r) for r in columns[3:]]

        if is_county(t):
            id_to_county[i] = name
            continue

        county_id = i[:5]

        if validate_data(i, name, t, rates[-1]):
            date_obj = datetime.datetime.strptime(date, "%m%d%Y").date()
            delta = date_obj - date_initial_obj
            censusResp = CensusResponse(
                tract_id=i,
                county=id_to_county[county_id],
                rates={"2010": {date: [rates[-1], delta.days]}},
            )
            responses.append(censusResp)

        elif parse2000 and validate_data(i, name, t, rates[0]):
            date_obj = datetime.date(2000, 1, 1)
            delta = date_obj - date_initial_obj
            censusResp = CensusResponse(
                tract_id=i,
                county=id_to_county[county_id],
                rates={"2000": {date: [rates[0], delta.days]}},
            )
            responses.append(censusResp)

    return responses


if __name__ == "__main__":
    responses = parse_census_data(link, "03252010", parse2000=True)
