import React, { Component } from 'react'
import {
  WebView,
  Modal,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import Axios from 'axios'

var keyParent = 1
class Facebook extends Component {
  _graphURL = 'https://graph.facebook.com'

  state = {
    url: {
      authLoginUrl: `https://www.facebook.com/dialog/oauth?client_id=${
        this.props.clientId
      }&redirect_uri=${this.props.redirectUrl}&scope=email`,
      authTokenUrl: `https://graph.facebook.com/oauth/access_token?client_id=${
        this.props.clientId
      }&redirect_uri=${this.props.redirectUrl}&client_secret=${
        this.props.secretKey
      }&code=`
    },
    loginData: '',
    visible: true,
    randomUrl: ''
  }

  _onNavigationStateChange = event => {
    const { authTokenUrl } = this.state.url
    let getEvent = event
    if (getEvent.url.includes('code=')) {
      let decodeURL = getEvent.url
        .substr(50, 350)
        .replace('#', '')
        .replace('code=', '')
      var urlFinal = authTokenUrl + decodeURL
      return decodeURL.length >= 344
        ? this.setState({ randomUrl: urlFinal.toString() })
        : null
    }
  }

  _onLoad = () => {
    if (this.state.randomUrl) {
      this.setState({ visible: false }, () => {
        this._requester(this.state.randomUrl)
      })
    }
  }

  _Indicator = () => {
    return (
      <ActivityIndicator
        color='#3b5998'
        size='large'
        style={{
          flex: 1,
          marginVertical: 30,
          justifyContent: 'center',
          alignItems: 'center',
          height: 80
        }}
      />
    )
  }

  _commander = readyToInvoke => {
    if (readyToInvoke) {
      return (
        <SafeAreaView>
          <Modal
            animationType='slide'
            transparent={false}
            visible={this.state.visible}
            onRequestClose={() => this.setState({ visible: false })}
          >
            <WebView
              startInLoadingState
              source={{ uri: this.state.url.authLoginUrl }}
              onNavigationStateChange={this._onNavigationStateChange}
              javaScriptEnabled
              renderLoading={this._Indicator}
              onLoad={this._onLoad}
            />
          </Modal>
        </SafeAreaView>
      )
    }
  }

  async _requester(url) {
    const { status, data } = await Axios.get(url)
    if (status === 200) {
      this.setState({ loginData: data }, () => {
        this._setAccessToken()
        this._setInformations()
      })
    }
  }

  _setAccessToken = async () =>
    (global.GET_ACCESS_TOKEN = this.state.loginData)

  async _setInformations(
    endpoint = '/me',
    fields = this.props.getMyInformations[0]
  ) {
    const { status, data } = await Axios.get(
      this._graphURL +
        endpoint +
        '?fields=' +
        fields +
        '&access_token=' +
        this.state.loginData.access_token
    )
    if (status === 200) {
      global.INFORMATIONS = data
    }
  }

  render = () =>
    this.props.isInvoke ? this._commander(this.props.isInvoke) : null
}

export const loginInWithPermissions = ({
  login = true,
  redirectUrl = 'https://facebook.com/connect/login_success.html',
  getMyInformationsFields = 'id,first_name,last_name,name,email,picture',
  clientId = '',
  secretKey = ''
}) => {
  if (clientId && secretKey) {
    ++keyParent
    return (
      <Facebook
        isInvoke={login}
        redirectUrl={redirectUrl}
        getMyInformations={getMyInformationsFields}
        clientId={clientId}
        secretKey={secretKey}
        key={keyParent}
      />
    )
  } else {
    throw new Error('Please provide missing required props')
  }
}

export const getAccessToken = () =>
  global.GET_ACCESS_TOKEN
    ? global.GET_ACCESS_TOKEN
    : { message: 'No access token found in store yet.', status: false }

export const getMyInformations = () =>
  global.INFORMATIONS
    ? global.INFORMATIONS
    : { message: 'No information found in store yet.', status: false }

export const logout = () => {
  if (global.GET_ACCESS_TOKEN && global.INFORMATIONS) {
    (global.GET_ACCESS_TOKEN = ''), (global.INFORMATIONS = '')
    return { message: 'Successfully logout.', status: true }
  } else {
    return { message: 'Nothing to logout.', status: false }
  }
}

export default Facebook
