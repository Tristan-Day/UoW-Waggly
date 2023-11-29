// clang-format off

import logo from './logo.svg';

import './App.css';

import { Amplify } from 'aws-amplify';
import { get, post, put } from 'aws-amplify/api';

import awsExports from "./aws-exports";

import { Authenticator } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';


Amplify.configure(awsExports);

async function setAccountDetails()
{
  try
  {
    const operation = post
    ({
      apiName: "UserService",
      path: "/users",
      options: 
      {
        body: {"TYPE" : "owner", "FIRST_NAME" : "Tristan", "LAST_NAME": "Day"}
      }
    });

    const { body } = await operation.response;
    console.log(await body.json());
  }
  catch (error)
  {
    console.error(error);
  }
}

async function getAccountDetails()
{
  try
  {
    const operation = get
    ({
      apiName: "UserService",
      path: "/users"
    })

    const { body } = await operation.response;
    console.log(await body.json());
  }
  catch (error)
  {
    console.error(error);
  }
}

async function getWalkerDetails()
{
  try
  {
    const operation = get
    ({
      apiName: "UserService",
      path: "/users/search?location=Winchester&maximum=50&minimum=40"
    })

    const { body } = await operation.response;
    console.log(await body.json());
  }
  catch (error)
  {
    console.error(error);
  }
}

async function setPetDetails()
{
  try
  {
    const operation = post
    ({
      apiName: "PetService",
      path: "/pets/Texstar",
      options: 
      {
        body: {"Breed" : "Beagle", "Weight": "4.5", "Description" : "Lively", "Gender": "Male"}
      }
    })

    const { body } = await operation.response;
    console.log(await body.json());
  }
  catch (error)
  {
    console.error(error);
  }
}

async function getPetDetails()
{
  try
  {
    const operation = get
    ({
      apiName: "PetService",
      path: "/pets/Texstar"
    })

    const { body } = await operation.response;
    console.log(await body.json());
  }
  catch (error)
  {
    console.error(error);
  }
}

function App()
{
  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <button onClick={setAccountDetails}>Create User</button>
            <button onClick={getAccountDetails}>Get User</button>
            <button onClick={getWalkerDetails}>Get Walker</button>
            <button onClick={setPetDetails}>Create Pet</button>
            <button onClick={getPetDetails}>Get Pet</button>
            <button onClick={signOut}>Sign out</button>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(App);
