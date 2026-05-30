import { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    alert('Login clicked!\nEmail: ' + email + '\nPassword: ' + password)
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <form onSubmit={handleLogin} style={{
        padding: '30px',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        width: '300px'
      }}>
        <h2 style={{textAlign: 'center', marginBottom: '20px'}}>LeadStriker Login</h2>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box'}}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{width: '100%', padding: '10px', marginBottom: '15px', boxSizing: 'border-box'}}
          required
        />
        
        <button type="submit" style={{
          width: '100%',
          padding: '10px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Login
        </button>
      </form>
    </div>
  )
}

export default App
