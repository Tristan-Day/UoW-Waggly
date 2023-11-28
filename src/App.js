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

async function createUser(identifier)
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

function App()
{
  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <button onClick={() => {
            createUser(user.userId)}}>Create User</button>
            <button onClick={signOut}>Sign out</button>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(App);
