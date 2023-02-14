import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

import { Home } from './pages/Home';

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
          </Routes>
    </Router>
  );
}

export default App;
