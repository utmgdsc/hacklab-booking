import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.css";

import { Admin } from "./pages/Admin";
import { AllRequests } from "./pages/Admin/AllRequests";
import { RoomManager } from "./pages/Admin/RoomManager";
import { Calendar } from "./pages/Calendar";
import { CreateBooking } from "./pages/CreateBooking";
import { Dashboard } from "./pages/Dashboard";
import { Group } from "./pages/Group/Group";
import { GroupDirectory } from "./pages/Group/GroupDirectory";
import { NotFound } from "./pages/NotFound";
import { Settings } from "./pages/Settings";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { CssBaseline, PaletteMode, Snackbar, ThemeProvider, createTheme, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ErrorBoundary, RequireRole } from "./components";
import { UserContext, defaultUser } from "./contexts/UserContext";
import { SnackbarContext } from "./contexts/SnackbarContext";
import { GoogleTheme, THEME } from "./theme/theme";

import axios from "./axios";

function App() {
  /*
   * user data initialization into context and fetching
   */
  let [userInfo, setUserInfo] = useState<FetchedUser>(defaultUser);

  const fetchUserInfo = async () => {
    const { data } = await axios("/accounts");
    setUserInfo(data);
  }
  useEffect(() => { fetchUserInfo(); }, []);

  /*
   * set theme based on user preference
   */
  const systemTheme = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme(GoogleTheme({
        mode:
          (userInfo.theme === "system" ? (systemTheme ? THEME.DARK : THEME.LIGHT) : userInfo.theme) as PaletteMode
      })),
    [systemTheme, userInfo],
  );

  /*
   * snackbar
   */
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [action, setAction] = useState<JSX.Element>(null);

  const enqueue = (message: string, action?: JSX.Element) => {
    setMessage(message);
    if (action) {
      setAction(action);
    }
    setOpen(true);
  }

  /*
   * rest of the horse
   */
  return !userInfo ? null : (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <UserContext.Provider value={{ userInfo, setUserInfo, fetchUserInfo }}>
          <SnackbarContext.Provider value={{ enqueue }}>
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
                <Route path="/admin/room-manager" element={
                  <RequireRole role={["admin"]}>
                    <RoomManager />
                  </RequireRole>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={(event: React.SyntheticEvent | Event, reason?: string) => {if (reason === 'clickaway') { return; } setOpen(false)}}
              message={message}
              action={action}
            />
          </SnackbarContext.Provider>
        </UserContext.Provider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
