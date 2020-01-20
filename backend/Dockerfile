# this dockerfile is used for product deployments
FROM python:3.7
LABEL maintainer "Kelley Chau <kelleyc2@illinois.edu>"

COPY requirements.txt requirements.txt
RUN apt-get update -y && \
    apt-get install -y python-pip python-dev

RUN pip install -r requirements.txt

COPY . /app
WORKDIR /app

# for the flask config
ENV FLASK_ENV=dev
ENV MONGO_USER=$MONGO_USER
ENV MONGO_PASSWORD=$MONGO_PASSWORD
ENV MONGO_DB=$MONGO_DB


ENTRYPOINT [ "python" ]

CMD [ "manage.py", "runprod" ]