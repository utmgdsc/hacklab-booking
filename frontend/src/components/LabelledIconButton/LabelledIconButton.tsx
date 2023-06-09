import { ButtonBase, Theme, Typography, useTheme } from '@mui/material';

interface LabelledIconButtonProps {
    /** the icon to render */
    icon: JSX.Element;
    /** the label to render */
    label: string;
    /** the color of the icon */
    color: string;
}

/**
 * A rounded icon button with a tooltip and a ripple effect.
 */
export const LabelledIconButton = ({ icon, label, color, ...props }: LabelledIconButtonProps): JSX.Element => {
    const theme: Theme = useTheme();

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
