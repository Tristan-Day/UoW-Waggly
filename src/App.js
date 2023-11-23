import logo from './logo.svg';
import './App.css';

import { Amplify } from 'aws-amplify';
import awsExports from "./aws-exports";

import { Authenticator } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsExports);

function App() {
  return (
    <div className="App">
      <Authenticator>
        {({ signOut, user }) => (
          <div>
            <p>Welcome {user.username}</p>
            <button onClick={signOut}>Sign out</button>
          </div>
        )}
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(App);
