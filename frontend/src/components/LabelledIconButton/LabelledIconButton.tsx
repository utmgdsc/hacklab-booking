import { ButtonBase, Theme, Typography, useTheme } from '@mui/material';
import { THEME } from '../../theme/theme';

interface LabelledIconButtonProps {
    /** the icon to render */
    icon: JSX.Element;
    /** the label to render */
    label: string;
    /** the color of the icon */
    color: string;
    /** the hover color of the icon */
    hover?: string;
}

/**
 * A rounded icon button with a tooltip and a ripple effect.
 */
export const LabelledIconButton = ({ icon, label, color, hover, ...props }: LabelledIconButtonProps): JSX.Element => {
    const theme: Theme = useTheme();

    return (
        <>
            <ButtonBase
                aria-label={label}
                sx={{
                    color: theme.palette.mode === THEME.LIGHT ? 'white' : theme.palette.text.primary,
                    borderRadius: '25%',
                    margin: '0.5em',
                    background: color,
                    transition: 'background 0.3s ease',
                    width: '7em',
                    height: '7em',
                    '&:hover': {
                        background: hover ? hover : color,
                    },
                }}
                {...props}
            >
                {icon}
            </ButtonBase>
            <Typography
                sx={{
                    color: theme.palette.text.primary,
                    display: 'block',
                    overflowWrap: 'anywhere',
                    textAlign: 'center',
                    width: '6.5em',
                }}
            >
                {label}
            </Typography>
        </>
    );
};
