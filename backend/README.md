# Flask Boilerplate [![CircleCI](https://circleci.com/gh/tko22/flask-boilerplate/tree/master.svg?style=svg&circle-token=:circle-token)](https://circleci.com/gh/tko22/flask-boilerplate/tree/master) <a href="https://github.com/ambv/black"><img alt="Code style: black" src="https://img.shields.io/badge/code%20style-black-000000.svg"></a>

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/tko22/flask-boilerplate&env=DATABASE_URL)

This is based off of [Flask Boilerplate](https://github.com/tko22/flask-boilerplate), but repurposed for MongoDB using MongoEngine.

We use [black](https://github.com/ambv/black) for code formatting, and [mypy](http://mypy-lang.org/) for optional static typing.

![](../master/docs/flask.gif)

## Setup

### MongoDB

First, install [MongoDB](https://docs.mongodb.com/manual/administration/install-community/), and start it:

Linux:
```
$ sudo service mongod start
$ mongo
```

IOS:
```
$ sudo mongod --config /usr/local/etc/mongod.conf
$ mongo
```
OR
```
$ brew services start mongodb-community@4.2
$ mongo
```

Then, within Mongo, run:
```
> use communityconnect-labs
```
You will not need to run `mongo` after setup- you'll just need to start the service.

### Server Setup

Make sure you have [Python3](https://realpython.com/installing-python/) and `pip3` installed.

Start your virtual environment:

```
$ pip3 install virtualenv
$ virtualenv venv
$ source venv/bin/activate
```
Now, install the python dependencies and run the server:
```
(venv) $ pip install -r requirements.txt
(venv) $ pip install -r requirements-dev.txt
(venv) $ python manage.py recreate_db
(venv) $ python manage.py runserver
```

To exit the virtual environment:
```
(venv) $ deactivate
$
```

### Verifying

Install [Postman](https://www.getpostman.com/downloads/) or your app of choice for testing API calls, and [Compass](https://www.mongodb.com/download-center/compass) to view the contents of the database.

Then, make Postman calls to verify that the server works:
1. `GET localhost:5000/` should return "Hello World"
2. `POST localhost:5000/persons` with a JSON body (in Postman as raw JSON) of:
```json
{
    "name": "Hack4Impact",
    "emails": [
        "hack4impact@illinois.edu",
        "contact@hack4impact.org",
        "uiuc@hack4impact.org"
    ]
}
```
3. `GET localhost:5000/persons` should return a result similar to:
```json
{
  "message": "",
  "result": {
    "persons": [
      {
        "_id": {
          "$oid": "5dacf1047d915d954f8e4291"
        },
        "emails": [
          {
            "email": "hack4impact@illinois.edu"
          },
          {
            "email": "contact@hack4impact.org"
          },
          {
            "email": "uiuc@hack4impact.org"
          }
        ],
        "name": "Hack4Impact"
      }
    ]
  },
  "success": true
}
```

You can also view the contents of your database by connecting to it in Mongo Compass using the default settings!

## Repository Contents

- `api/views/` - Holds files that define your endpoints
- `api/models/` - Holds files that defines your database schema
- `api/__init__.py` - What is initially ran when you start your application
- `api/utils.py` - utility functions and classes - explained [here](https://github.com/tko22/flask-boilerplate/wiki/Conventions)
- `api/core.py` - includes core functionality including error handlers and logger
- `tests/` - Folder holding tests

#### Others

- `config.py` - Provides Configuration for the application. There are two configurations: one for development and one for production using Heroku.
- `manage.py` - Command line interface that allows you to perform common functions with a command
- `requirements.txt` - A list of python package dependencies the application requires
- `runtime.txt` & `Procfile` - configuration for Heroku
- `Dockerfile` - instructions for Docker to build the Flask app
- `docker-compose.yml` - config to setup this Flask app and a Database
- `migrations/` - Holds migration files – doesn't exist until you `python manage.py db init` if you decide to not use docker

### MISC

If you're annoyed by the **pycache** files

```
find . | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf
```

### Additional Documentation

- [Flask](http://flask.pocoo.org/) - Flask Documentation
- [Flask Tutorial](http://flask.pocoo.org/docs/1.0/tutorial/) - great tutorial. Many patterns used here were pulled from there.
- [Flask SQLAlchemy](http://flask-sqlalchemy.pocoo.org/2.3/) - the ORM for the database
- [Heroku](https://devcenter.heroku.com/articles/getting-started-with-python#introduction) - Deployment using Heroku
- [Learn Python](https://www.learnpython.org/) - Learning Python3
- [Relational Databases](https://www.ntu.edu.sg/home/ehchua/programming/sql/Relational_Database_Design.html) - Designing a database schema
- [REST API](http://www.restapitutorial.com/lessons/restquicktips.html) - tips on making an API Restful
- [Docker Docs](https://docs.docker.com/get-started/) - Docker docs
