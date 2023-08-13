import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './App.css';

import { Admin } from './pages/Admin';
import { RoomManager } from './pages/Admin/RoomManager';
import { RoomViewer } from './pages/Admin/RoomManager/RoomViewer';
import { UserViewer } from './pages/Admin/UserManager/UserViewer';
import { Calendar } from './pages/Calendar';
import { CreateBooking } from './pages/CreateBooking';
import { Dashboard } from './pages/Dashboard';
import { Group } from './pages/Group/Group';
import { GroupDirectory } from './pages/Group/GroupDirectory';
import { NotFound } from './pages/NotFound';
import { Joan6 } from './pages/Room/joan6';
import { Settings } from './pages/Settings';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';

import {
    Alert,
    AlertColor,
    CssBaseline,
    PaletteMode,
    Snackbar,
    ThemeProvider,
    createTheme,
    useMediaQuery,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary, RequireRole } from './components';
import { SnackbarContext, SnackbarQueueItem } from './contexts/SnackbarContext';
import { UserContext, defaultUser } from './contexts/UserContext';
import { GoogleTheme, THEME } from './theme/theme';
import { ApprovedRequestPage } from './pages/ApprovedRequestPage';
import { Webhooks } from './pages/Settings/Webhooks';

import axios, { catchAxiosError } from './axios';

function App() {
    /*
     * user data initialization into context and fetching
     */
    let [userInfo, setUserInfo] = useState<FetchedUser>(defaultUser);

    const fetchUserInfo = async () => {
        await axios('/accounts')
            .then(({ data }) => {
                setUserInfo(data);
            })
            .catch(catchAxiosError('Failed to fetch user info', showSnackSev));
    };

    useEffect(() => {
        fetchUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*
     * set theme based on user preference
     */
    const systemTheme = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = useMemo(
        () =>
            createTheme(
                GoogleTheme({
                    mode: (userInfo.theme === 'system'
                        ? systemTheme
                            ? THEME.DARK
                            : THEME.LIGHT
                        : userInfo.theme) as PaletteMode,
                }),
            ),
        [systemTheme, userInfo],
    );

    /*
     * snackbar
     */
    const [queue, setQueue] = useState<SnackbarQueueItem[]>([]);

    const showSnack = (message: string, action?: JSX.Element, content?: JSX.Element) => {
        // if over 3, remove the first one
        if (queue.length > 3) {
            setQueue((array) => array.slice(1));
        }

        setQueue((array) => [
            ...array,
            {
                open: true,
                message,
                content,
                action,
                _id: Math.random(),
            },
        ]);
    };

    const showSnackSev = (message: string, severity: AlertColor) => {
        showSnack(
            null,
            null,
            <Alert elevation={6} severity={severity}>
                {message}
            </Alert>,
        );
    };

    /*
     * rest of the horse
     */
    return !userInfo ? null : (
        <ThemeProvider theme={theme}>
            <ErrorBoundary>
                <UserContext.Provider value={{ userInfo, setUserInfo, fetchUserInfo }}>
                    <SnackbarContext.Provider value={{ showSnack, showSnackSev }}>
                        <CssBaseline enableColorScheme />
                        <Router>
                            <AppRoutes />
                        </Router>
                        {queue.map((item, index) => (
                            <Snackbar
                                key={item._id}
                                open={item.open}
                                autoHideDuration={3000}
                                onClose={(_event: React.SyntheticEvent | Event, reason?: string) => {
                                    if (reason === 'clickaway') {
                                        return;
                                    }
                                    // close the snackbar
                                    setQueue((array) =>
                                        array.map((e) => {
                                            if (e._id === item._id) {
                                                return { ...e, open: false };
                                            }
                                            return e;
                                        }),
                                    );
                                }}
                                onTransitionEnd={() => {
                                    // cleanup closed snackbars
                                    setQueue((array) => array.filter((e) => e.open));
                                }}
                                message={item.message}
                                action={item.action}
                                sx={{
                                    bottom: index * 60 + 24 + 'px !important',
                                    position: 'fixed !important',
                                }}
                            >
                                {item.content ? item.content : null}
                            </Snackbar>
                        ))}
                    </SnackbarContext.Provider>
                </UserContext.Provider>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

/**
 * Routes are defined here to allow for useLocation hook, needed for transitions
 */
const AppRoutes = () => {
    const location = useLocation();

    return (
        <TransitionGroup component={null}>
            {/* This is no different than other usage of <CSSTransition>, just make sure to pass `location` to `Switch` so it can match the old location as it animates out. */}
            <CSSTransition key={location.key} classNames="fade" timeout={300}>
                <Routes location={location}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/webhooks" element={<Webhooks />} />
                    <Route path="/calendar/" element={<Calendar />} />
                    <Route path="/book/" element={<CreateBooking />} />
                    <Route path="/group/" element={<GroupDirectory />} />
                    <Route path="/group/:id" element={<Group />} />
                    <Route path="/admin/room-manager/:id/joan6" element={<Joan6 />} />
                    <Route
                        path="/admin"
                        element={
                            <RequireRole role={['admin']}>
                                <Admin />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/admin/:id"
                        element={
                            <RequireRole role={['admin']}>
                                <UserViewer />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/admin/room-manager/"
                        element={
                            <RequireRole role={['admin']}>
                                <RoomManager />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/admin/room-manager/:id"
                        element={
                            <RequireRole role={['admin']}>
                                <RoomViewer />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/approve/:id"
                        element={
                            <RequireRole role={['approver', 'admin']}>
                                <ApprovedRequestPage approved={true} />
                            </RequireRole>
                        }
                    />
                    <Route
                        path="/deny/:id"
                        element={
                            <RequireRole role={['approver', 'admin']}>
                                <ApprovedRequestPage approved={false} />
                            </RequireRole>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </CSSTransition>
        </TransitionGroup>
    );
};
export default App;
