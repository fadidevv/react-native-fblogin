import React, { Component } from 'react'
import { View, Button } from 'react-native'

import {
  loginInWithPermissions,
  getAccessToken,
  getMyInformations,
  getUsername,
  logout
} from '@fadidev/react-native-fblogin'

export default class App extends Component {
  state = {
    login: false
  }

  loginIn = () => {
    const { login } = this.state
    if (login) {
      return loginInWithPermissions({
        runNow: true,
        redirectUrl: 'https://facebook.com/connect/login_success.html',
        getMyInformationsFields: ['id,first_name,last_name,name,email,picture'],
        clientId: 'REPLACE_WITH_YOUR_APP_ID',
        secretKey: 'REPLACE_WITH_YOUR_SECRET_KEY',
        onLoginSuccess: data => console.log(data),
        onLoginFailure: error => console.log(error)
      })
    }
  }

  render() {
    const { loginIn } = this
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-evenly',
          width: '50%',
          alignSelf: 'center',
          marginVertical: '10%'
        }}
      >
        <Button onPress={() => this.setState({ login: true })} title='Login' />
        <Button
          onPress={() => alert(JSON.stringify(getAccessToken()))}
          title='getAccessToken'
        />
        <Button
          onPress={() => alert(JSON.stringify(getMyInformations()))}
          title='getMyInformations'
        />
        <Button
          onPress={() => {
            getUsername()
              .then(username => console.log(username))
              .catch(error => console.log(error))
          }}
          title='getUsername'
        />
        <Button
          onPress={() => alert(JSON.stringify(logout()))}
          title='Logout'
        />
        {loginIn()}
      </View>
    )
  }
}
