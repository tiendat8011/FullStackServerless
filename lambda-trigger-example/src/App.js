import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import './App.css'
function App() {
  const [user, updateUser] = useState(null)
  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => updateUser(user))
      .catch(err => console.log(err));
  }, [])

  let isAdmin = false
  if (user) {
    const { signInUserSession: { idToken: { payload } } } = user
    console.log('payload: ', payload)
    if (
      payload['cognito:groups'] &&
      payload['cognito:groups'].includes('Admin')
    ) {
      isAdmin = true
    }
  }
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="App">
          <header>
            <h1>Hello World</h1>
            {isAdmin && <p>Welcome, Admin</p>}
            {console.log(isAdmin)}
          </header>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}
export default withAuthenticator(App)