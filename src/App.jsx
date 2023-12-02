import './App.css';

import { get } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';

import { Amplify } from 'aws-amplify';
import awsExports from "./aws-exports";

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, createContext, useState } from 'react';

import Home from './pages/Home'

import Search from './pages/Search'
import Signup from './pages/Signup';
import Account from './pages/Account';

Amplify.configure(awsExports);
export const AccountContext = createContext();

function App() {
  const [accountData, setAccountData] = useState(null);

  const accountContextHandle = async (username) => {
    try {
      const operation = get
        ({
          apiName: "UserService",
          path: "/users/" + username
        })

      const { body } = await operation.response;
      setAccountData((await body.json()));
    }
    catch (error) {
      console.log("User has no associated Dynamo data");
    }
  }

  useEffect(() => {
    async function checkContextAvailability() {
      try {
        const user = await getCurrentUser()
        accountContextHandle(user.username);
      }
      catch (error) {
        return;
      }
    }
    checkContextAvailability();
  }, []);

  return (
    <AccountContext.Provider value={[accountData, setAccountData]}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </AccountContext.Provider>
  )
}

export default App;
