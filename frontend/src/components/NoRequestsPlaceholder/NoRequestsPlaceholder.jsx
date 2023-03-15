import { Box, Typography } from '@mui/material';
import SparkleMascot from "../../assets/img/sparkle-mascot.png";

/**
 * Placeholder for when there are no requests
 * @param {string} text the text to display in the placeholder
 * @param {string} image [optional] the image to display in the placeholder
 * @param {string} alt [optional] the alt text for the image
 * @returns {JSX.Element} the placeholder
 */
export const NoRequestsPlaceholder = ({ text, image = SparkleMascot, alt = "Sparkle Mascot" }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "4em"
            }}
        >
            <img width="200" src={image} alt={alt} />
            <Typography variant="gray" sx={{ marginTop: "2em" }}>
                { text }
            </Typography>
        </Box>
    );
}
