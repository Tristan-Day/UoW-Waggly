import './App.css';

import { Amplify } from 'aws-amplify';
import awsExports from "./aws-exports";

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home'

import Search from './pages/Search'
import Signup from './pages/Signup';
import Account from './pages/Account';

Amplify.configure(awsExports);

function App()
{
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/search" element={<Search/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/account" element={<Account/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
