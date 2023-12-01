import { Authenticator } from '@aws-amplify/ui-react';
import { withAuthenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

import Navigation from '../components/Navigation';

function Account() {
  return (
    <Authenticator>
      <Navigation />
    </Authenticator>
  )
}

export default withAuthenticator(Account);