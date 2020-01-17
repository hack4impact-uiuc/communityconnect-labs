# this dockerfile is used for product deployments
FROM python:3.7
LABEL maintainer "Kelley Chau <kelleyc2@illinois.edu>"

COPY requirements.txt requirements.txt
RUN apt-get update -y && \
    apt-get install -y python-pip python-dev

RUN pip install -r requirements.txt

# delete dependencies required to install certain python packages 
# so the docker image size is low enough for Zeit now
# RUN apk del build-deps gcc musl-dev

COPY . /app
WORKDIR /app

# for the flask config
ENV FLASK_ENV=prod

ENTRYPOINT [ "python" ]

CMD ["manage.py", "runserver"]