import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";

import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";
import { Calendar } from "./pages/Calendar";
import { CreateBooking } from "./pages/CreateBooking";
import { Group } from "./pages/Group/Group";
import { GroupDirectory } from "./pages/Group/GroupDirectory";
import { Admin } from "./pages/Admin";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { useEffect, useState } from "react";
import { UserContext } from "./contexts/UserContext";
import { ErrorBoundary } from "./components";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { GoogleTheme } from "./theme/theme";

function App() {
  let [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/accounts/info")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
      });
  }, []);

  console.log(userInfo);

  return (
    <UserContext.Provider value={userInfo}>
      <ThemeProvider theme={GoogleTheme}>
        <ErrorBoundary>
          <CssBaseline enableColorScheme />
          <Router>
            <Routes>
              <Route exact path="/" element={<Dashboard />} />
              <Route exact path="/settings" element={<Settings />} />
              <Route exact path="/calendar/" element={<Calendar />} />
              <Route exact path="/book/" element={<CreateBooking />} />
              <Route exact path="/group/" element={<GroupDirectory />} />
              <Route exact path="/group/:id" element={<Group />} />
              <Route exact path="/admin" element={<Admin />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
