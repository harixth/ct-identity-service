# Crypto Tracker Identity Service - (AWS Serverless)

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/). It responsible for serving the REST endpoints to handle authentication for the system as well as managing indentity

Project is live at: https://1qehdty5i5.execute-api.ap-southeast-1.amazonaws.com/production/hello

## Configuration

> **Requirements**:

1. NodeJS `lts/fermium (v.14.15.0)`. Make sure Node version in local is same with this version.
2. Serverless Framework CLI.

## Installation

```bash
$ npm install
```

## Running the app

Project will be running at http://localhost:5000. Make call to `/dev` path to acccess the serverless endpoints

```bash
# development
$ serverless offline start
```

## Test

Check out the `test.sh` in scripts folder for mock test. You can also use curl to make HTTP request to available endpoints

However, this instance is attached to production DB, any local test will reflect in production

## External services dependencies

Make sure these services are all up before trying to run in your local

1. MongoDB Atlas
