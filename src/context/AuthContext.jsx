"use client"

import { createContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import axios from 'axios'
import axiosSecure from '../lib/axiosInstance' // 👈 adjust path to wherever this file actually lives

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [dbUser, setDbUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const registerUser = async (name, email, password, photo, role = 'tenant') => {
    setLoading(true)
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(result.user, { displayName: name, photoURL: photo })

    const res = await axios.post(`${apiUrl}/auth/register`, {
      name, email, photo, role
    })

    localStorage.setItem('token', res.data.token)
    setDbUser(res.data.user)
    return result
  }

  const loginUser = async (email, password) => {
    setLoading(true)
    const result = await signInWithEmailAndPassword(auth, email, password)

    const res = await axios.post(`${apiUrl}/auth/login`, {
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL
    })

    localStorage.setItem('token', res.data.token)
    setDbUser(res.data.user)
    return result
  }

  const googleLogin = async () => {
    setLoading(true)
    const result = await signInWithPopup(auth, googleProvider)

    const res = await axios.post(`${apiUrl}/auth/login`, {
      name: result.user.displayName,
      email: result.user.email,
      photo: result.user.photoURL
    })

    localStorage.setItem('token', res.data.token)
    setDbUser(res.data.user)
    return result
  }

  const logoutUser = () => {
    localStorage.removeItem('token')
    setDbUser(null)
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)

      if (currentUser) {
        const token = localStorage.getItem('token')
        if (token) {
          try {
            const res = await axiosSecure.get(`/users/${currentUser.email}`)
            setDbUser(res.data)
          } catch (error) {
            console.log('Error fetching db user:', error.message)
          }
        }
        // if no token yet, loginUser/googleLogin/registerUser will set dbUser themselves
      } else {
        setDbUser(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [apiUrl])

  const authInfo = {
    user,
    dbUser,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser
  }

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider