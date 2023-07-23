import { Box, Typography, useTheme } from '@mui/material';
import SparkleMascot from '../../assets/img/sparkle-mascot.png';
import SparkleMascotDark from '../../assets/img/sparkle-mascot_dark.png';
import { THEME } from '../../theme/theme';

interface NoRequestsPlaceholderProps {
    /** the text to display in the placeholder */
    text: string;
}

/**
 * Placeholder for when there are no requests
 * @returns {JSX.Element} the placeholder
 */
export const NoRequestsPlaceholder = ({
    text,
}: NoRequestsPlaceholderProps): JSX.Element => {
    /** mui theme object */
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '4em',
                marginTop: '4em',
            }}
        >
            <img width="200" src={
                theme.palette.mode === THEME.LIGHT ? SparkleMascot : SparkleMascotDark
            } alt="" aria-hidden="true" />
            <Typography variant="gray" sx={{ marginTop: '2em' }}>
                {text}
            </Typography>
        </Box>
    );
};
