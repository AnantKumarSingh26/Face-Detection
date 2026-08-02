import FormGroup from '../components/FormGroup'
import '../styles/register.scss'
import { Link } from 'react-router'
import { useState } from 'react'
import {useAuth} from '../hooks/useAuth'
import { useNavigate } from 'react-router'

const Register = () => {

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const {handleRegister, loading}= useAuth()
  const navigate = useNavigate()


  async function handleSubmit(e) {
    e.preventDefault()
    
    await handleRegister({username, email, password})
    navigate('/')
  }

  return (
    <main className='register-page'>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <FormGroup 
          value={email}
          onChange={(e)=>{setEmail(e.target.value)}}
          label="Email" placeholder="Enter your email" />
          <FormGroup 
          value={username}
          onChange={(e)=>{setUsername(e.target.value)}}
          label="Username" placeholder="Enter your Username" />
          <FormGroup 
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          label="Password" placeholder="Enter your password" />

          {/* <FormGroup label="Confirm Password" placeholder="Confirm your password" /> */}

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