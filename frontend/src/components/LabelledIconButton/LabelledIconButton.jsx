import { ButtonBase, Typography, useTheme } from '@mui/material';

/**
 * A rounded icon button with a tooltip and a ripple effect
 */
export const LabelledIconButton = ({ icon, label, color, ...props }) => {
    const theme = useTheme();

    return (
        <ButtonBase
            aria-label={label}
            sx={{
                color: "white",
                borderRadius: "25%",
                margin: "0.5em",
                background: color, // TODO: make this a theme color
                width: "7em",
                height: "7em",
                marginBottom: "2em",
            }}
            {...props}
        >
            {icon}
            <Typography
                sx={{
                    color: theme.palette.text.primary,
                    display: "block",
                    position: "absolute",
                    top: "6em",
                }}
            >
                {label}
            </Typography>
        </ButtonBase >
    );
}
