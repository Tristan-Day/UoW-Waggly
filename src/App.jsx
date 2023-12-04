import './App.css'

import { Amplify } from 'aws-amplify'
import awsExports from './aws-exports'

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, createContext, useState } from 'react'

import { getAccount } from './data/User'
import { Home, Search, Signup, PetOverview, Settings, AccountOverview } from './pages'

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
          {/* Public Routes */}
          <Route path='*' element={<Home />} />

          {/* Authenticated Routes */}
          <Route path='search' element={<Search />} />
          <Route path='signup' element={<Signup />} />

          {/* Pet Registration and Profile Managment */}
          <Route path='settings' element={<Settings />}>
            <Route path='*' element={<AccountOverview />} />
            <Route path='animals' element={<PetOverview />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AccountContext.Provider>
  )
}

export default App
