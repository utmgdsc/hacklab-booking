import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";

import { Admin } from "./pages/Admin";
import { AllRequests } from "./pages/Admin/AllRequests";
import { Calendar } from "./pages/Calendar";
import { CreateBooking } from "./pages/CreateBooking";
import { Dashboard } from "./pages/Dashboard";
import { Group } from "./pages/Group/Group";
import { GroupDirectory } from "./pages/Group/GroupDirectory";
import { NotFound } from "./pages/NotFound";
import { Settings } from "./pages/Settings";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { CssBaseline, PaletteMode, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary, RequireRole } from "./components";
import { UserContext, defaultUser } from "./contexts/UserContext";

import axios from "./axios";
import { GoogleTheme, THEME } from "./theme/theme";

function App() {
  let [userInfo, setUserInfo] = useState<FetchedUser>(defaultUser);
  const fetchUserInfo = async () => {
    const { data } = await axios("/accounts");
    setUserInfo(data);
  }
  useEffect(() => {
    fetchUserInfo();
  }, []);

  console.log(userInfo);

  const systemTheme = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme(GoogleTheme({
        mode:
          (userInfo.theme === "system" ? (systemTheme ? THEME.DARK : THEME.LIGHT) : userInfo.theme) as PaletteMode
      })),
    [systemTheme, userInfo],
  );

  return !userInfo ? null : (
    <UserContext.Provider value={{ userInfo, setUserInfo, fetchUserInfo }}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <CssBaseline enableColorScheme />
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/calendar/" element={<Calendar />} />
              <Route path="/book/" element={<CreateBooking />} />
              <Route path="/group/" element={<GroupDirectory />} />
              <Route path="/group/:id" element={<Group />} />
              <Route path="/admin" element={
                <RequireRole role={["admin"]}>
                  <Admin />
                </RequireRole>
              } />
              <Route path="/admin/all-requests" element={
                <RequireRole role={["admin"]}>
                  <AllRequests />
                </RequireRole>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
