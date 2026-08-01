import FormGroup from '../components/FormGroup'
import '../styles/register.scss'
import { Link } from 'react-router'


const Register = () => {
  return (
    <main className='register-page'>
      <div className="form-container">
        <h1>Register</h1>
        <form>
          <FormGroup label="Email" placeholder="Enter your email" />
          <FormGroup label="Username" placeholder="Enter your Username" />
          <FormGroup label="Password" placeholder="Enter your password" />
          <FormGroup label="Confirm Password" placeholder="Confirm your password" />
          <button className='button' type="submit">Register</button>
        </form>
        <div className="link-container">
          <p>Already have an account?</p>         <Link to="/login">Login</Link>
        </div>
      </div>
    </main>
  )
}

export default Register