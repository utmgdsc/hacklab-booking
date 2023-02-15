import { ButtonBase, Typography } from '@mui/material';

/**
 * A rounded icon button with a tooltip and a ripple effect
 */
export const LabelledIconButton = ({ icon, label, color, ...props }) => {
    return (
        <ButtonBase
            aria-label={label}
            sx={{
                color: color,
                backgroundColor: "color",
                borderRadius: "25%",
                margin: "0.5em",
                background: "#d9d9d9", // TODO: make this a theme color
                width: "7em",
                height: "7em",
                marginBottom: "2em",
            }}
            {...props}
        >
            {icon}
            <Typography
                sx={{
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
