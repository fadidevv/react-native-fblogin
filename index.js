import React, { Component } from 'react'
import {
  Modal,
  WebView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text
} from 'react-native'
import Axios from 'axios'

var keyParent = 1
class Facebook extends Component {
  _graphURL = 'https://graph.facebook.com'
  _errorsMessages = {
    whenPropsIsInvalid: 'Please provide missing required props correctly'
  }

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
    randomUrl: '',
    ready: false
  }

  _onNavigationStateChange = event => {
    const { onLoginFailure } = this.props
    const { authTokenUrl } = this.state.url
    let getEvent = event
    if (getEvent.title.includes('Error')) {
      this._openCloseModal(false, () => {
        onLoginFailure(this._errorsMessages.whenPropsIsInvalid)
        throw new Error(this._errorsMessages.whenPropsIsInvalid)
      })
    } else {
      if (Platform.OS === 'ios') {
        if (
          getEvent.url.includes('login_success.html?code=') &&
          getEvent.jsEvaluationValue === '' &&
          getEvent.loading === false
        ) {
          if (getEvent.url.includes('code=')) {
            let decodeURL = getEvent.url
              .substr(50, 350)
              .replace('#', '')
              .replace('code=', '')
            const urlFinal = authTokenUrl + decodeURL
            this.setState({ randomUrl: urlFinal.toString() }, () => {
              this._openCloseModal(false, () => {
                this._requester(this.state.randomUrl)
              })
            })
          }
        }
      } else {
        if (
          getEvent.url.includes('login_success.html?code=') &&
          getEvent.title !== '' &&
          getEvent.loading === false
        ) {
          if (getEvent.url.includes('code=')) {
            let decodeURL = getEvent.url
              .substr(50, 350)
              .replace('#', '')
              .replace('code=', '')
            const urlFinal = authTokenUrl + decodeURL
            this.setState({ randomUrl: urlFinal.toString() }, () => {
              this._openCloseModal(false, () => {
                this._requester(this.state.randomUrl)
              })
            })
          }
        }
      }
    }
  }

  _onLoad = () => {
    return 'Nothing to execute'
  }

  _Indicator = () => {
    return (
      <ActivityIndicator
        color='#3b5998'
        size='large'
        style={styles.indicator}
      />
    )
  }

  _openCloseModal(status, what = null) {
    return this.setState({ visible: status }, what)
  }

  _injectJS = () => {
    return `
        document.getElementById('m_login_password').addEventListener('click', () =>  window.postMessage(window.scrollTo(0, 100)))
    `
  }

  _commander = readyToInvoke => {
    if (readyToInvoke) {
      return (
        <SafeAreaView>
          <Modal
            animationType='slide'
            transparent={false}
            visible={this.state.visible}
            onRequestClose={() => this._openCloseModal(false)}
          >
            <WebView
              style={styles.webView}
              javaScriptEnabled
              startInLoadingState
              source={{ uri: this.state.url.authLoginUrl }}
              onNavigationStateChange={this._onNavigationStateChange}
              injectedJavaScript={
                Platform.OS === 'android' ? this._injectJS() : ''
              }
              renderLoading={this._Indicator}
              onLoad={this._onLoad}
            />
            <SafeAreaView style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => this._openCloseModal(false)}>
                <SafeAreaView style={styles.closeButtonWithWrapper}>
                  <SafeAreaView style={styles.closeTextWrapper}>
                    <Text style={styles.closeText}>Cancel</Text>
                  </SafeAreaView>
                </SafeAreaView>
              </TouchableOpacity>
            </SafeAreaView>
          </Modal>
        </SafeAreaView>
      )
    }
  }

  async _requester(url) {
    try {
      const { status, data } = await Axios.get(url)
      if (status === 200) {
        this.setState({ loginData: data }, () => {
          this._setAccessToken()
          this._setInformations()
        })
      }
    } catch (error) {
      const { onLoginFailure } = this.props
      this._openCloseModal(false, () => {
        onLoginFailure(error.message)
      })
    }
  }

  _setAccessToken = async () =>
    (global.GET_ACCESS_TOKEN = this.state.loginData)

  async _setInformations(
    endpoint = '/me',
    fields = this.props.getMyInformations[0]
  ) {
    try {
      const { status, data } = await Axios.get(
        this._graphURL +
          endpoint +
          '?fields=' +
          fields +
          '&access_token=' +
          this.state.loginData.access_token
      )
      if (status === 200) {
        this.setState({ ready: true }, () => {
          global.INFORMATIONS = data
          this.props.onLoginSuccess({
            isLoggedIn: this.state.ready,
            ...getAccessToken(),
            ...getMyInformations()
          })
          global.ready = this.state.ready
        })
      }
    } catch (error) {
      const { onLoginFailure } = this.props
      this._openCloseModal(false, () => {
        onLoginFailure(error.message)
      })
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
  secretKey = '',
  onLoginSuccess = data => console.log(data),
  onLoginFailure = error => console.log(error)
}) => {
  const _CLIENT_VARS = [
    'REPLACE_WITH_YOUR_APP_ID',
    'REPLACE_WITH_YOUR_SECRET_KEY'
  ]
  if (
    clientId &&
    secretKey &&
    clientId !== _CLIENT_VARS[0] &&
    secretKey !== _CLIENT_VARS[1]
  ) {
    global.ready = false
    ++keyParent
    return (
      <Facebook
        isInvoke={login}
        redirectUrl={redirectUrl}
        getMyInformations={getMyInformationsFields}
        clientId={clientId}
        secretKey={secretKey}
        key={keyParent}
        onLoginSuccess={onLoginSuccess}
        onLoginFailure={onLoginFailure}
      />
    )
  } else {
    const whenPropsIsMissing = 'Please provide missing required props'
    throw new Error(whenPropsIsMissing)
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

export const getUsername = async () => {
  if (global.ready) {
    try {
      const _settingsURL = 'https://mbasic.facebook.com/settings'
      const { status, data } = await Axios.get(_settingsURL)
      if (status === 200) {
        return {
          username: data
            .match(/<a[^>]*/g)[2]
            .split('?')[0]
            .replace('<a href=', '')
            .replace('"/', '')
        };
      }
    } catch (error) {
      return error.message
    }
  } else {
    return {
      message:
        'Please login first with this component in your Facebook account',
      status: false
    }
  }
}

export const logout = () => {
  if (global.GET_ACCESS_TOKEN && global.INFORMATIONS) {
    (global.GET_ACCESS_TOKEN = ''), (global.INFORMATIONS = '')
    return { message: 'Successfully logout.', status: true }
  } else {
    return { message: 'Nothing to logout.', status: false }
  }
}

const styles = StyleSheet.create({
  webView: {
    marginTop: Platform.OS === 'ios' ? 35 : 0
  },
  indicator: {
    flex: 1,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
  },
  buttonContainer: {
    marginVertical: 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  closeButtonWithWrapper: {
    backgroundColor: '#4267b2',
    width: Dimensions.get('screen').width,
    height: 40,
    borderWidth: 1,
    borderColor: '#4267b2'
  },
  closeTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6
  },
  closeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
})

export default Facebook