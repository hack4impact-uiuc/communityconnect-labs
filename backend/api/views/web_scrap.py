import re
import requests


def extract_data_links(link):
    html = requests.get(link).text
    pattern = r"href\=\"(.*?dat)\""
    files = re.findall(pattern, html)

    links = {}

    for file in files:
        absolute_link = f"{link}{file}"
        date = re.findall(r".*_(\d\d\d\d\d\d\d\d).dat", absolute_link)[0]
        links[absolute_link] = date

    return links


if __name__ == "__main__":
    link = "https://www2.census.gov/programs-surveys/decennial/2010/program-management/4-release/mail-participation-rate/"
    links = extract_data_links(link)
    print(links)
