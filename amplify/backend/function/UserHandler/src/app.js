/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const middleware = require("aws-serverless-express/middleware")
const bodyParser = require("body-parser")

// Dynamo DB Initalisation
const dynamo = new DynamoDBClient({region : process.env.TABLE_REGION});
const client = DynamoDBDocumentClient.from(dynamo);

let tableName = "UserData";
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

const PATH = "/users";

/******************************************
 * HTTP GET - Retreives a list of Walkers *
 ******************************************/

app.get(PATH + "/search/:LOCATION", async function(request, response)
{
  var parameters = {
    TableName: tableName
  }

  // Regex Pattern Matching against Postcodes
  const regex = /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/;
  if (regex.test(request.params.LOCATION))
  {
    parameters["IndexName"] = "PostcodeIndex";
    parameters["KeyConditionExpression"] = "POSTCODE = :postcode";
    parameters["ExpressionAttributeValues"] = {":postcode" : request.params.LOCATION};
  }
  else
  {
    parameters["IndexName"] = "CityIndex";
    parameters["KeyConditionExpression"] = "CITY = :city";
    parameters["ExpressionAttributeValues"] = {":city" : request.params.LOCATION};
  }

  // Apply filter for Minimum and Maximum Price
  const minimum = request.query.minimum;
  const maximum = request.query.maximum;

  if (!(typeof minimum === "undefined" || minimum === null))
  {
    parameters["FilterExpression"] = "RATE > :minimum";
    parameters["ExpressionAttributeValues"][":minimum"] = parseInt(minimum);
  }
  
  if (!(typeof maximum === "undefined" || maximum === null))
  {
    if ("FilterExpression" in parameters)
    {
      parameters["FilterExpression"] = "RATE BETWEEN :minimum AND :maximum";
    }
    else
    {
      parameters["FilterExpression"] = "RATE < :maximum";
    }
    parameters["ExpressionAttributeValues"][":maximum"] = parseInt(maximum);
  }

  // Query the Database
  try
  {
    const data = await client.send(new QueryCommand(parameters))

    response.status(200).json(data.Items);
  }
  catch (error)
  {
    response.status(500).json({text : "Failed to Process Request", error : error});
  }  
});

/***************************************************
 * HTTP GET - Retreives a User based on Cognito ID *
 ***************************************************/

app.get(PATH + "/:IDENTIFIER", async function(request, response) 
{
    const parameters = 
    {
      TableName : tableName,
      Key : {IDENTIFIER : request.params.IDENTIFIER}
    };

    // Query the Database
    try
    {
      const data = await client.send(new GetCommand(parameters))

      if (data.Item)
      {
        response.status(200).json(data.Item);
      }
      else
      {
        response.status(404).json({error : "Requested account not found"});
      }
    }
    catch (error)
    {
      response.status(500).json({text : "Failed to Process Request", error : error});
    }
});

/***************************************
 * HTTP POST - Create or Update a User *
 ***************************************/

app.post(PATH + "/:IDENTIFIER", async function(request, response) 
{
    if (!(request.body["TYPE"]))
    {
      response.status(400).json({error : "Missing required field 'TYPE'", body: request.body});
      return;
    }

    var requiredFields;

    // Determine required fields
    switch (request.body["TYPE"])
    {
    case "owner":
      requiredFields = [ "FIRST_NAME", "LAST_NAME" ];
      break;

    case "walker":
      requiredFields = [ "FIRST_NAME", "LAST_NAME", "CITY", "POSTCODE", "DESCRIPTION", "RATE" ];
      break;

    default:
      response.status(400).json({error : `"${request.body["TYPE"]}" is not a valid user type`});
      return;
    }

    const missingFields = checkMissingFields(request.body, requiredFields);
    if (missingFields.length != 0)
    {
      response.status(400).json({error : "Missing required field(s)", missingFields});
      return;
    }

    // Filter request fields
    var user = 
    {
      IDENTIFIER: request.params.IDENTIFIER,
      TYPE: request.body["TYPE"].toLowerCase()
    };

    Object.keys(request.body).forEach(key => 
    {
      if (requiredFields.includes(key))
      {
          user[key] = request.body[key];
      }
    });

    const parameters = 
    {
      TableName : tableName, 
      Item : user
    };

    // Query the Database
    try
    {
      await client.send(new PutCommand(parameters));
      response.status(200).json({message : "User Sucessfully Updated"});
    }
    catch (error)
    {
      response.status(500).json({text : "Failed to Process Request", error : error});
    }
});

/*************************************************
 * HTTP DELETE - Remove a User from the Database *
 *************************************************/

app.delete(PATH + "/:IDENTIFIER", async function(request, response)
{
  const parameters = 
  {
    TableName : tableName,
    Key : {IDENTIFIER : request.params.IDENTIFIER}
  };

  // Query the Database
  try
  {
    await client.send(new DeleteCommand(parameters))

    response.status(200).json({text : "User Sucessfully Removed"});
  }
  catch (error)
  {
    response.status(500).json({text : "Failed to Process Request", error : error});
  }
})

app.listen(3000, function() 
{
    console.log("App started")
});

module.exports = app
