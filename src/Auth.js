import React, { useEffect, useState } from "react"
import app from './firebase-config'

export const AuthContext = React.createContext();

export function AuthProvider({children}) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        app.auth().onAuthStateChanged(setCurrentUser)
    }, []);
  return (
    <AuthContext.Provider
        value={{currentUser}}
    >
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider