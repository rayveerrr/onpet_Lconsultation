import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>Page not found. <Link to='/'>Go back to Homepage</Link></div>
  )
}

export default NotFound