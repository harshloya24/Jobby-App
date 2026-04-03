import {Component} from 'react'
import {Navigate, useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaEye, FaEyeSlash} from 'react-icons/fa'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
    showPassword: false, // ✅ added
  }

  demoCredentials = {
    username: 'rahul',
    password: 'rahul@2021',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  // ✅ toggle function
  onTogglePassword = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }))
  }

  onSubmitSuccess = jwtToken => {
    const {navigate} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })

    navigate('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://jobby-backend-kwgu.onrender.com/login'

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onClickDemoLogin = () => {
    const {username, password} = this.demoCredentials

    this.setState(
      {
        username,
        password,
        showSubmitError: false,
      },
      () => {
        this.submitForm({preventDefault: () => {}})
      },
    )
  }

  // ✅ UPDATED PASSWORD FIELD
  renderPasswordField = () => {
    const {password, showPassword} = this.state

    return (
      <>
        <label className="input-label" htmlFor="password">
          PASSWORD
        </label>

        <div className="password-field-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="password-input-field"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
          />

          <span className="eye-icon" onClick={this.onTogglePassword}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={username}
          onChange={this.onChangeUsername}
          placeholder="Username"
        />
      </>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Navigate to="/" replace />
    }

    return (
      <div className="login-form-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            className="login-website-logo"
            alt="website logo"
          />

          <div className="input-container">
            {this.renderUsernameField()}
          </div>

          <div className="input-container">
            {this.renderPasswordField()}
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <button
            type="button"
            className="demo-login-button demo-unique"
            onClick={this.onClickDemoLogin}
          >
            🚀 Try Demo Login
          </button>

          {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

// ✅ wrapper stays same
const LoginWrapper = props => {
  const navigate = useNavigate()
  return <Login {...props} navigate={navigate} />
}

export default LoginWrapper
