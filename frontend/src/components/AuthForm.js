import React, { useState } from "react"

// import styles
import "./AuthForm.css"

const AuthForm = ({ formData, handleChange, handleSubmit, type }) => {
  const isSignup = type === "signup"
  const [emailError, setEmailError] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleEmailChange = (e) => {
    handleChange(e)
    setEmailError(validateEmail(e.target.value) ? "" : "Invalid email address")
  }

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h1 className="login-title">{isSignup ? "Signup" : "Login"}</h1>

      {isSignup && (
        <>
          <section className="input-box">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              value={formData.first_name}
              required
            />
            <i className="bx bxs-user"></i>
          </section>

          <section className="input-box">
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              value={formData.last_name}
              required
            />
            <i className="bx bxs-user"></i>
          </section>
        </>
      )}

      <section className="input-box">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleEmailChange}
          value={formData.email}
          required
        />
        <i className="bx bxs-user"></i>
      </section>

      <section className="input-box">
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <i className="bx bxs-lock-alt"></i>
      </section>

      {isSignup && (
        <section className="input-box">
          <input
            type="password"
            name="password_confirmation"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={formData.password_confirmation}
            required
          />
          <i className="bx bxs-lock-alt"></i>
        </section>
      )}

      <section className="remember-forgot-box">
        <div className="remember-me">
          <input type="checkbox" name="remember-me" id="remember-me" />
          <label htmlFor="remember-me">
            <h5>Remember me</h5>
          </label>
        </div>
        <a className="forgot-password" href="/login">
          <h5>Forgot password?</h5>
        </a>
      </section>

      <button className="login-button" type="submit">
        {isSignup ? "Sign Up" : "Login"}
      </button>

      <h5 className="dont-have-an-account">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <a href="/login">
              <b className="forgot-password">Login</b>
            </a>
          </>
        ) : (
          <>
            Don't have an account?{" "}
            <a href="/signup">
              <b className="forgot-password">Register</b>
            </a>
          </>
        )}
      </h5>
    </form>
  )
}

export default AuthForm
