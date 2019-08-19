# React Native FB Login
[![npm version](https://img.shields.io/npm/v/@fadidev/react-native-fblogin.svg?style=flat)](https://www.npmjs.com/package/@fadidev/react-native-fblogin)
[![npm downloads](https://img.shields.io/npm/dm/@fadidev/react-native-fblogin.svg?style=flat-square)](https://www.npmjs.com/package/@fadidev/react-native-fblogin)

React Native FB Login is fully IOS and Android compatible component without using any Facebook Native/Web SDK, allowing for Facebook Login integration in [React Native](https://facebook.github.io/react-native/) apps and it also supports responses like `username` which deprecated by Facebook. To use this component developers don't need to install any native sdks also don't need to import or link any sdks in IOS and Android from Facebook. This component is fully compatible and tested with all [React Native](https://facebook.github.io/react-native/) versions no more errors like other components and it is very easy to use.

We use direct Facebook Graph API to prevent importing/linking Native SDK steps from Facebook.

> 🚨**Update**: Fresh <b>v1.0.5</b> with many new features is ready 📹 https://bit.ly/33HxQ2J, please upgrade now if you haven't via `npm or yarn`

## IOS/Android Preview

<img src="https://i.imgflip.com/37yyol.gif" alt="preview-ios" /> <img src="https://i.imgflip.com/37yyzb.gif" alt="preview-android" />

---
## Setup Facebook Login App

You will need to create [Facebook Login App](https://developers.facebook.com/apps/) to use with this component and +add [Click to see Link](https://facebook.com/connect/login_success.html) in your redirect-url Facebook Login App Settings in `Valid OAuth Redirect URIs` input field, this link is required in Facebook Login App as it will get use when redirection will occurs when user will logged-in from your application, also you can control this redirect-url from this component as a prop `redirectUrl='YOUR_REDIRECT_URL'` for server-side scriptings like `PHP, JSP, nodeJS` to store user information like `token,first_name,last_name` when user will logged-in but it's optional. If you have created already Facebook Login App then you can skip all steps except adding redirect-url in your Facebook Login App Settings in `Valid OAuth Redirect URIs` input field. When everything is done you just need to grab `clientId` and `secretKey` from your Facebook Login App, this component will need these props later.

**Note**: When you create new `Facebook Login App` by default App mode always set to `development` and this component works fine with it, but when you are ready to upload your React Native app to the appstores do not forget to submit your `Facebook Login App` for reviewing to change it's status from `development` to `public` mode.

## Installation

install the `react-native-fblogin` package in your project or clone [Example](https://github.com/fadidevv/react-native-fblogin/tree/master/example) project:

```bash
yarn add @fadidev/react-native-fblogin
```

> Or, if using npm:

```bash
npm install @fadidev/react-native-fblogin
```

## Usage

### loginInWithPermissions()
| Prop | Type | Default Description |
| :--- | :--- | :--- | 
| `runNow` | `boolean` | This prop will tell component to call login API |
| `redirectUrl` | `string` | This prop will get use when user logins success |
| `getMyInformationsFields` | `array` | This prop will hold admin required fb permissions |
| `clientId` | `string` |  **Required**. This prop will hold Facebook Login App Client/App Id |
| `secretKey` | `string` | **Required**. This prop will hold Facebook Login App SecretKey |
| `onLoginSuccess` | `function` | This prop will take callback and return {...data} when login success |
| `onLoginFailure` | `function` | This prop will take callback and return {...error} when something fails |

This needs to call when `Login` button in your React Native App is clicked

```js
import React, { Component } from 'react'
import { View, Button } from 'react-native'
import { loginInWithPermissions } from '@fadidev/react-native-fblogin'

export default class App extends Component {
  state = {
    login: false
  }
  
  /*
     runNow: default is TRUE you can skip this prop, (optional)
     redirectUrl: default is https://facebook.com/connect/login_success.html, 
                  you can skip or replace with your URL, (optional)
     getMyInformationsFields: default is id,first_name,last_name,name,email,picture 
                  you can skip it or add more, (optional)
     clientId: default is null and its required
     secretKey: default is null and its required
     onLoginSuccess: default returns console.log({...data}) when login success
     onLoginFailure: default returns console.log({...error}) when something fails
  */
  
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
      <View style={{
        flex: 1, 
        justifyContent: 'space-evenly', 
        width: '50%', 
        alignSelf: 'center', 
        marginVertical: '10%'}}>
      <Button onPress={() => this.setState({ login: true })} title='Login'/>
        {loginIn()} // mounting the component when button clicked
      </View>
    )
  }
}
```

## Response:

```javascript
{
   access_token: string,
   email: string,
   expires_in: integer,
   first_name: string,
   id: string,
   isLoggedIn: boolean,
   last_name: string,
   name: string,
   picture: {
        data: {
            height: integer,
            is_silhouette: boolean,
            url: string,
            width: integer
        }
   },
   token_type: string
}
```

### ⚡ getUsername()
This will give you the `username` when user will logged-in and this `deprecated by Facebook long back` but here its available, can access in any component

```js
import React, { Component } from 'react'
import { View, Button } from 'react-native'
import { getUsername } from '@fadidev/react-native-fblogin'

export default class App extends Component {

  render() {
    return (
      <View style={{
        flex: 1, 
        justifyContent: 'space-evenly', 
        width: '50%', 
        alignSelf: 'center', 
        marginVertical: '10%'}}>
      <Button
          onPress={() => {
            getUsername()
              .then(username => console.log(username))
              .catch(error => console.log(error))
          }}
          title='getUsername'
        />
      </View>
    )
  }
}
```

## Response:

```javascript
{ 
   username: string
}
```

### getAccessToken()
This will give you the `user_token` when user will logged-in, can access in any component

```js
import React, { Component } from 'react'
import { View, Button } from 'react-native'
import { getAccessToken } from '@fadidev/react-native-fblogin'

export default class App extends Component {

  render() {
    return (
      <View style={{
        flex: 1, 
        justifyContent: 'space-evenly', 
        width: '50%', 
        alignSelf: 'center', 
        marginVertical: '10%'}}>
      <Button onPress={() => alert(JSON.stringify(getAccessToken()))} title='getAccessToken'/>
      </View>
    )
  }
}
```

## Response:

```javascript
{ accessToken: string, expiresIn: string, status: boolean }
```

### getMyInformations()
This will give you the `first_name,last_name,id,picture` like details, can access in any component

```js
import React, { Component } from 'react'
import { View, Button } from 'react-native'
import { getMyInformations } from '@fadidev/react-native-fblogin'

export default class App extends Component {

  render() {
    return (
      <View style={{
        flex: 1, 
        justifyContent: 'space-evenly', 
        width: '50%', 
        alignSelf: 'center', 
        marginVertical: '10%'}}>
      <Button onPress={() => alert(JSON.stringify(getMyInformations()))} title='getMyInformations'/>
      </View>
    )
  }
}
```

## Response:

```javascript 
{ 
   id: double, 
   first_name: string, 
   last_name: string, 
   name: string, 
   email: string, 
   picture: object, 
   token_type: string 
}
```

### logout()

This enough for flushing user data in your application, can access in any component

```js
import React, { Component } from 'react'
import { View, Button } from 'react-native'
import { logout } from '@fadidev/react-native-fblogin'

export default class App extends Component {

  render() {
    return (
      <View style={{
        flex: 1, 
        justifyContent: 'space-evenly', 
        width: '50%', 
        alignSelf: 'center', 
        marginVertical: '10%'}}>
      <Button onPress={() => alert(JSON.stringify(logout()))} title='logout'/>
      </View>
    )
  }
}
```

## Response:

```javascript
{ message: string, status: boolean }
```

## Contributing
Just submit a pull request!

## Copyright and license

Code and documentation copyright 2019 @FadiDev. Code released under [the MIT license](https://github.com/magus/react-native-fblogin/blob/master/LICENSE).
