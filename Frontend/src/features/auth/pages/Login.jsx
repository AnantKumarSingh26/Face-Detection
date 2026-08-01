import FormGroup from '../components/FormGroup'
import '../styles/login.scss'
import { Link } from 'react-router'

const Login = () => {
  return (
    <main className='login-page'>
      <div className="form-container">
        <h1>Login</h1>
        <form>
          <FormGroup label="Email" placeholder="Enter your email" />
          <FormGroup label="Password" placeholder="Enter your password" />
          <button className='button' type="submit">Login</button>
        </form>
        <div className="link-container">
          <p>Don't have an account?</p>         <Link to="/register">Register</Link>
        </div>
      </div>
    </main>
  )
}

export default Login