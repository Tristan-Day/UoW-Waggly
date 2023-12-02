import './App.css'

import { Amplify } from 'aws-amplify'
import awsExports from "./aws-exports"

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, createContext, useState } from 'react'

import { getAccount } from './data/User'
import { Home, Search, Signup, Account } from './pages'

Amplify.configure(awsExports)
export const AccountContext = createContext()

function App() {
  const [accountData, setAccountData] = useState(null)

  useEffect(() => {
    async function checkContextAvailability() {
      try {
        setAccountData(await getAccount())
      }
      catch (error) {
        return
      }
    }
    checkContextAvailability()
  }, [])

  return (
    <AccountContext.Provider value={[accountData, setAccountData]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          {/* <Route path="/pets" element={<Account />} /> */}
        </Routes>
      </BrowserRouter>
    </AccountContext.Provider>
  )
}

export default App
