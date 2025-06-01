import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <section className='page notfound'>
      <div className="content">
        <img src="/notfound.png" alt="notfound" style={{ maxWidth: '100%', height: 'auto', marginBottom: '2rem' }} />
        <h1 style={{ marginBottom: '1rem', color: '#184235' }}>Page Not Found</h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>The page you are looking for does not exist.</p>
        <Link to={'/'}>RETURN TO HOME PAGE</Link>
      </div>
    </section>
  )
}

export default NotFound
