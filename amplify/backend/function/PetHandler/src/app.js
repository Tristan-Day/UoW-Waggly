/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const {DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const {DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");

const middleware = require("aws-serverless-express/middleware")
const bodyParser = require("body-parser")

// Dynamo DB Initalisation
const dynamo = new DynamoDBClient({region : process.env.TABLE_REGION});
const client = DynamoDBDocumentClient.from(dynamo);

let tableName = "PetData";
if (process.env.ENV && process.env.ENV !== "NONE")
{
  tableName = tableName + "-" + process.env.ENV;
}

// Declare a new Express Application
const express = require("express")
const app = express()

app.use(bodyParser.json())
app.use(middleware.eventContext())

// Middleware Chain
app.use(function(request, response, next) 
{
  response.header("Access-Control-Allow-Origin", "*")
  response.header("Access-Control-Allow-Headers", "*")

  if (request.body && typeof request.body === "object")
  {
    Object.keys(request.body).forEach(key => {
      if (!(key.toUpperCase() in request.body))
      {
        request.body[key.toUpperCase()] = request.body[key];
        delete request.body[key];
      }
    });
  }

  next()
});

function checkMissingFields(source, fields)
{
  var missingFields = [];

  for (const field of fields)
  {
    if (!(field in source))
    {
      missingFields.push(field);
    }
  }

  return missingFields;
}

const PATH = "/pets";

/***************************************************************
 * HTTP GET - Retreives a Pet from a given Name and Cognito ID *
 ***************************************************************/

app.get(PATH + "/:NAME", async function(request, response)
{
  const key = 
  {
    NAME: request.params.NAME, 
    USER_IDENTIFIER: request.apiGateway.event.requestContext.identity.cognitoIdentityId || "UNAUTH"
  }

  const parameters = 
  {
    TableName: tableName,
    Key: key
  }

  // Query the Database
  try
  {
    const data = await client.send(new GetCommand(parameters))

    if (data.Item)
    {
      response.status = 200;
      response.json(data.Item);
    }
    else
    {
      response.status = 404
      response.json({error : "Requested pet not found"});
    }
  }
  catch (error)
  {
    response.statusCode = 500;
    response.json({text : "Failed to Process Request", error : error});
  }
})

/**************************************
 * HTTP POST - Create or Update a Pet *
 **************************************/

app.post(PATH + "/:NAME", async function(request, response) 
{
    const requiredFields = ["BREED", "WEIGHT", "DESCRIPTION", "GENDER"]
    const missingFields = checkMissingFields(request.body, requiredFields);

    if (missingFields.length != 0)
    {
      response.status = 400
      response.json({error : "Missing required field(s)", missingFields})
      return;
    }

    // Filter request fields
    var pet = 
    {
      NAME: request.params.NAME,
      USER_IDENTIFIER: request.apiGateway.event.requestContext.identity.cognitoIdentityId || "UNAUTH",
    };

    Object.keys(request.body).forEach(key => 
    {
      if (requiredFields.includes(key))
      {
          pet[key] = request.body[key];
      }
    });

    const parameters = 
    {
      TableName : tableName, 
      Item : pet
    };

    // Query the Database
    try
    {
      await client.send(new PutCommand(parameters));

      response.status = 200;
      response.json({message : "Pet Sucessfully Updated"});
    }
    catch (error)
    {
      response.statusCode = 500;
      response.json({text : "Failed to Process Request", error : error});
    }
});

app.listen(3000, function() {
  console.log("App started")
});

module.exports = app
