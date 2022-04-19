import React from 'react'
import './App.css'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

function Profile() {
    return (
        <div style={containerStyle}>
            <Authenticator>
                {({ signOut, user }) => (
                    <div className="App">
                        <button onClick={signOut}>Sign out</button>
                    </div>
                )}
            </Authenticator>
        </div>
    );
}
const containerStyle = {
    width: 400,
    margin: '20px auto'
}
export default withAuthenticator(Profile)