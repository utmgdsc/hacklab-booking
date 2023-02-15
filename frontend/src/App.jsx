import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

import { Home } from './pages/Home';
import { Settings } from './pages/Settings';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom';


function App() {
  return (
    <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/settings" element={<Settings />} />
          </Routes>
    </Router>
  );
}

export default App;
