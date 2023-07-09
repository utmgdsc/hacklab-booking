import React from 'react';
import { Box, Typography, Container, Button, Breakpoint } from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { ErrorBoundary, Link } from '../components';
import { UserContext } from '../contexts/UserContext';
import { useLocation } from 'react-router-dom';

interface SubPageProps {
    name: string;
    children: React.ReactNode;
    maxWidth?: Breakpoint;
    py?: number;
    showHead?: boolean;
    [key: string]: any;
}

export const SubPage: React.FC<SubPageProps> = ({
    name,
    children,
    maxWidth = 'md',
    py = 8,
    showHead = true,
    ...props
}) => {
    React.useEffect(() => {
        document.title = 'Hacklab Booking - ' + name;
    }, [name]);

    let { fetchUserInfo } = React.useContext(UserContext);
    const location = useLocation();

    /**
     * @returns the previous path
     */
    const previousPath = () => {
        const path = location.pathname.split('/').slice(0, -1).join('/');
        if (path === '') {
            return '/';
        }
        return path;
    }

    return (
        <Container sx={{ py: py }} maxWidth={maxWidth} component="main" {...props}>
            <Typography
                variant="h4"
                sx={{
                    marginTop: {
                        xs: '-2em',
                        sm: '-1em',
                        md: '0em',
                        lg: '1em',
                        xl: '2em',
                    },
                }}
            >
                <Link href={ previousPath() } internal>
                    <Button onClick={() => fetchUserInfo()}>
                        <ArrowBackIos /> Back
                    </Button>
                </Link>
            </Typography>
            {showHead && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginBottom: '4em',
                    }}
                >
                    <Typography variant="h1" gutterBottom sx={{ marginTop: '2em' }}>
                        {name}
                    </Typography>
                </Box>
            )}
            <ErrorBoundary>{children}</ErrorBoundary>
        </Container>
    );
};
