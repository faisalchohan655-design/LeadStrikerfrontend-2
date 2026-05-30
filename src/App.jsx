import { useState, useEffect } from 'react'

function App() {
  const [page, setPage] = useState('login')
  const [email, setEmail] = useState('')
  const [totalLeads, setTotalLeads] = useState(0)

  // Backend سے leads لینے والا code
  useEffect(() => {
    fetch('https://leadscraper-production.up.railway.app/api/leads', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => setTotalLeads(data.length))
    .catch(err => console.log('Error:', err));
  }, []);

  const handleLogin = (e) => {
    e.preventDefault()
    setPage('dashboard')
  }

  if (page === 'dashboard') {
    return (
      <div style={{padding: '40px', textAlign: 'center', background: '#f0f2f5', minHeight: '100vh'}}>
        <h1>LeadChaser Dashboard 🚀</h1>
        <p>Welcome {email}</p>
        <div style={{marginTop: '30px', padding: '40px', background: 'white', borderRadius: '8px', display: 'inline-block'}}>
          {/* Comment change کر دو: leads کی تعداد یہاں سے آ رہی ہے */}
          <h2>Total Leads: {totalLeads}</h2>
          <p>Backend سے real leads آ رہے ہیں اب</p>
        </div>
        <br/>
        <button onClick={() => setPage('login')} style={{marginTop: '20px', padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px'}}>
          Logout
        </button>
      </div>
    )
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5'}}>
      <form onSubmit={handleLogin} style={{padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'}}>
        <h2 style={{textAlign: 'center'}}>LeadChaser Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc'}} required/>
        <input type="password" placeholder="Password" style={{width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc'}} required/>
        <button type="submit" style={{width: '100%', padding: '10px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '5px'}}>Login</button>
      </form>
    </div>
  )
}

export default App
