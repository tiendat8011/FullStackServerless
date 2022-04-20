import React from 'react'

import { withAuthenticator, Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';

import { Auth } from 'aws-amplify'
import { Button } from 'antd'
function Admin() {
    return (
        <div>
            <h1 style={titleStyle}>Admin</h1>
            <Authenticator>
                {({ signOut, user }) => (
                    <button onClick={signOut}>Sign out</button>
                )}
            </Authenticator>
        </div>
    )
}
const titleStyle = {
    fontWeight: 'normal',
    margin: '0px 0px 10px 0px'
}
export default withAuthenticator(Admin)