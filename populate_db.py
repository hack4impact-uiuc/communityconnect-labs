import requests

link = 'https://www2.census.gov/programs-surveys/decennial/2010/data/participation-rates-states/participationrates2010.txt'
DELIM = " ||"

DB_LINK = 'http://0.0.0.0:5000/census_response'

class CensusResponse:
    def __init__(self, id, name, t, response2000, response2010):
        self.id = id
        self.name = name
        self.type = t
        self.response2000 = response2000
        self.response2010 = response2010

    def __str__(self):
        return f"ID: {self.id}\tName: {self.name}\tType: {self.type}\tResponse rate 2000: {self.response2000}\tResponse rate 2010: {self.response2010}"

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "type": self.type,
            "rate2000": self.response2000,
            "rate2010": self.response2010
        }

def parse_census_data(link):
    result = requests.get(link).text
    rows = result.strip().split("\n")
    responses = []

    for row in rows:
        i, name, t, rr2000, rr2010 = row.split(DELIM)
        censusResp = CensusResponse(i, name, t, float(rr2000), float(rr2010))
        responses.append(censusResp)

    return responses

if __name__ == '__main__':
    responses = parse_census_data(link)

    result = requests.post(DB_LINK, json=[r.json() for r in responses[]])
    print(result.text)
