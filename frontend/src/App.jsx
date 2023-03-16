import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Track } from './pages/Track';
import { CreateBooking } from './pages/CreateBooking';
import { Group } from './pages/Group';


import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';

import { useEffect, useState, createContext } from 'react';

import {
  CssBaseline,
  ThemeProvider
} from '@mui/material';

import { GoogleTheme } from './theme/theme';

function App() {
  let [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + '/api/accounts/user')
      .then(res => res.json())
      .then(data => setUserInfo(data));
  }, []);

  return (
      <ThemeProvider theme={GoogleTheme}>
        <CssBaseline enableColorScheme />
        <Router>
          <Routes>
            <Route exact path="/" element={<Dashboard />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/track/:id" element={<Track />} />
            <Route exact path="/track/" element={<Track />} />
            <Route exact path="/book/" element={<CreateBooking />} />
            <Route exact path="/group/" element={<Group />} />
          </Routes>
        </Router>
      </ThemeProvider>
  );
}

export default App;
