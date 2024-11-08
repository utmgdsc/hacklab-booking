import { ArrowBackIos } from '@mui/icons-material';
import { Box, Breakpoint, Button, Container, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../components';
import { UserContext } from '../contexts/UserContext';

interface SubPageProps {
    /** title of the page */
    name: string;
    /** content of the page */
    children: React.ReactNode;
    /** the maximum width of the page */
    maxWidth?: Breakpoint;
    /** the vertical padding of the page */
    py?: number;
    /** whether to show the header */
    showHead?: boolean;
    /** other props */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const { fetchUserInfo } = React.useContext(UserContext);
    const nav = useNavigate();

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
                <Button
                    onClick={() => {
                        nav(-1);
                        fetchUserInfo();
                    }}
                >
                    <ArrowBackIos /> Back
                </Button>
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
