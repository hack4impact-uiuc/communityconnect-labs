import requests

from api.models import CensusResponse

DELIM = " ||"
NAME = "Tract"

def validate_data(i, name, t, rate):
    if name != NAME:
        return False
    if rate < 0 or rate > 1:
        return False
    return True

def parse_census_data(link, date, parse2000=False):
    result = requests.get(link).text
    rows = result.strip().split("\n")
    responses = []

    for row in rows:
        columns = row.split(DELIM)
        i = columns[0]
        name = columns[1]
        t = columns[2]
        rates = [float(r) for r in columns[3:]]

        if validate_data(i, name, t, rates[-1]):
            censusResp = CensusResponse(tract_id=i, name="", rates={"2010": {date: rates[-1]}})
            responses.append(censusResp)

        if parse2000 and validate_data(i, name, t, rates[0]):
            censusResp = CensusResponse(tract_id=i, name="", rates={"2000": {"00002000": rates[0]}})
            responses.append(censusResp)

    return responses

if __name__ == '__main__':
    responses = parse_census_data(link, "03252010", parse2000=True)

    # result = requests.post(DB_LINK, json=[r.json() for r in responses[]])
    # print(result.text)
