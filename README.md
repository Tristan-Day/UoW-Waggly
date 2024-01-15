# UoW Waggly

This repository contains code submitted for Software Engineering Module (BS3221). The web application, built in a cloud-native approach with React and Express, allows dog walkers to advertise their services and owners to register their animals and find nearby walkers.

The application is hosted on Amazon Web Services using Amplify, Lambda, DynamoDB and API Gateway to facilitate a full-stack deployment. Currently, the master branch is configured with continuous deployment and integration.

## Features

* Manage a public listing, advertising price and location for walker services.
* Search public listings matching a specific location and defined price range.
* Register and view animals.

## Live Deployment

A live version of the application can be found at:\
https://master.d21auoazgq6mrv.amplifyapp.com

*```Note: This URL will only be active for the assessment period. ```*

### Search Tips

As of publication, several dummy listings have been added to the database to demonstrate search functionality.

These can be found by entering a **full postcode** with the following prefix:
```
SO23
SO16
BN11
```

Alternatively, you can find walkers by entering the following locations:
```
Southampton
Winchester
Worthing
```

# Deploying the Application on the Cloud

To deploy this application, you will require the following:

* Node Package Manager v10.2.4 or later
* Amplify Node Package v12.8.2 or later
* An Amazon Web Services IAM role with appropriate Amplify Access Permissions

To deploy the application 

1. Use `amplify configure` to setup your AWS profile configuration.
2. Delete `team-provider-info.json` from the `amplify` directory.
3. Run `amplify init` specifying your AWS profile.
4. Use `amplify push` to upload the stack to your AWS account.

*`Note: This process has not been tested by the author and relies on publically available information. Should the process fail, please see 'Running the Application Locally'`*

# Running the Application Locally

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To run the application locally, you must first install project dependencies with

`npm install`

Then run the application using

`npm start`

This will run the application in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
