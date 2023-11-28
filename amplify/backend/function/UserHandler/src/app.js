/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const {DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const {DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand} = require('@aws-sdk/lib-dynamodb');

const middleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')

// Dynamo DB Initalisation
const dynamo = new DynamoDBClient({region : process.env.TABLE_REGION});
const client = DynamoDBDocumentClient.from(dynamo);

let tableName = "UserData";
if (process.env.ENV && process.env.ENV !== "NONE")
{
    tableName = tableName + '-' + process.env.ENV;
}

// Declare a new Express Application
const express = require('express')
const app = express()

app.use(bodyParser.json())
app.use(middleware.eventContext())

// Enable CORS for all methods
app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "*")
    next()
});

function getMissingFields(source, requiredFields)
{
    var missingFields = [];

    for (const field of requiredFields)
    {
        if (!(field in source))
        {
            missingFields.push(field);
        }
    }

    return missingFields;
}

const PATH = "/users";

/***************************************************
 * HTTP GET - Retreives a user based on Cognito ID *
 ***************************************************/

// app.get(PATH + "/:IDENTIFIER", async function(req, res) {
//     const condition = {};
//     condition['IDENTIFIER'] = {
//         ComparisonOperator : 'EQ'
//     }

//     if (req.apiGateway)
//     {
//         condition['IDENTIFIER']['AttributeValueList'] = [ req.apiGateway.event.requestContext.identity.cognitoIdentityId || "UNAUTH" ];
//     }
//     else
//     {
//         try
//         {
//             condition['IDENTIFIER']['AttributeValueList'] = [ convertUrlType(req.params['IDENTIFIER'], partitionKeyType) ];
//         }
//         catch (err)
//         {
//             res.statusCode = 500;
//             res.json({error : 'Wrong column type ' + err});
//         }
//     }

//     let queryParams = {
//         TableName : tableName,
//         KeyConditions : condition
//     }

//     try
//     {
//         const data = await document.send(new QueryCommand(queryParams));
//         res.json(data.Items);
//     }
//     catch (err)
//     {
//         res.statusCode = 500;
//         res.json({error : 'Could not load items: ' + err.error});
//     }
// });

/*************************************
 * HTTP put method for insert object *
 *************************************/

// app.put(PATH, async function(req, res) {
//     req.body['COGNITO_ID'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId || "UNAUTH";

//     let putItemParams = {
//         TableName : tableName,
//         Item : req.body
//     }
//     try
//     {
//         let data = await document.send(new PutCommand(putItemParams));
//         res.json({success : 'put call succeed!', url : req.url, data : data})
//     }
//     catch (err)
//     {
//         res.statusCode = 500;
//         res.json({error : err, url : req.url, body : req.body});
//     }
// });

/*************************************
 * HTTP post method to update a user *
 *************************************/

app.post(PATH, async function(request, response)
{
    Object.keys(request.body).forEach(key => {
        request.body[key].toUpperCase();
    });

    if (!(request.body['TYPE']))
    {
        response.status = 400;
        response.json({error : "Missing required field 'TYPE'"});
        return;
    }

    var requiredFields;

    switch (request.body['TYPE'])
    {
    case 'owner':
        requiredFields = [ 'FIRST_NAME', 'LAST_NAME' ];
        break;

    case 'walker':
        requiredFields = [ 'FIRST_NAME', 'LAST_NAME', 'REGION', 'POSTCODE', 'DESCRIPTION', 'RATE' ];
        break;

    default:
        response.status = 400;
        response.json({error : `'${request.body['TYPE']}' is not a valid user type`});
        return;
    }

    const missingFields = getMissingFields(request.body, requiredFields);
    if (missingFields.length != 0)
    {
        response.status = 400
        response.json({error : "Missing required field(s)", missingFields})
        return;
    }

    // Filter request fields
    var user = {};

    Object.keys(request.body).forEach(key => {
        if (requiredFields.includes(key))
        {
            user[key] = request.body[key];
        }
    });

    // Set identifier field from Cognito Access Key
    user['IDENTIFIER'] = request.apiGateway.event.requestContext.identity.accessKey || "UNAUTH";

    try
    {
        const parameters = {TableName : tableName, Item : user};
        await client.send(new PutCommand(parameters));

        response.status = 200;
        response.json({message : "User Sucessfully Updated"});
    }
    catch (error)
    {
        response.statusCode = 500;
        response.json({text : "Failed to Process Request", error : error});
    }
});

app.listen(3000, function()
{
    console.log("App started")
});

module.exports = app
