import './styles/Navigation.css';

import Icon from '@mdi/react';
import { mdiMagnify, mdiHeart, mdiAccountCircle } from '@mdi/js';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCurrentUser } from 'aws-amplify/auth';

async function getAccountContext() {
  try {
    await getCurrentUser();
    return <h1>Your Account</h1>
  }
  catch (error) {
    return <h1>Sign In</h1>
  }
}

export default function Navigation() {
  const navigate = useNavigate();
  const [accountContext, setAccountContext] = useState(null);

  useEffect(() => {
    getAccountContext().then((content) => {
      setAccountContext(content);
    });
  }, []);

  return (
    <div className="Header">
      <nav>
        <img src="./logo.svg" className="Logo" onClick={() => navigate("/")} />
        <div className="Item" onClick={() => navigate("/search")}>
          <Icon path={mdiMagnify} size={1.2} color="#F8F8F8" />
          <h1>Search Walkers</h1>
        </div>
        <div className="Item" onClick={() => navigate("/signup")}>
          <Icon path={mdiHeart} size={1.2} color="#F8F8F8" />
          <h1>Become a Walker</h1>
        </div>
        <div className="Account" onClick={() => navigate("/account")}>
          <Icon path={mdiAccountCircle} size={1.2} color="#F8F8F8" />
          {accountContext}
        </div>
      </nav>
    </div>
  )
}