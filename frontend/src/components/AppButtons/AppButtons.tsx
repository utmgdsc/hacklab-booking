import { LabelledIconButton } from '..';
import { Link } from 'react-router-dom';
import { Box, Tooltip } from '@mui/material';

/**
 * An object that contains the information needed to render a
 * LabelledIconButton, including the icon to render,
 */
export interface AppButton {
    /** the icon to render */
    icon: JSX.Element;
    /** the color of the icon */
    color: string;
    /** the hover color of the icon */
    hover?: string;
    /** the label to render */
    label: string;
    /** the href to link to */
    href: string;
    /** the title to display on hover */
    title: string;
    /** whether or not to render the button */
    hidden?: boolean;
}

interface AppButtonsProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [x: string]: any; // for the map function
    /** the array of objects to render */
    ButtonsToRender: AppButton[];
}

/**
 * Renders a list of LabelledIconButtons
 *
 * @property {AppButton[]} ButtonsToRender the array of objects to render
 * @returns the rendered list of LabelledIconButtons
 */
export const AppButtons = ({ ButtonsToRender }: AppButtonsProps): JSX.Element => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'row',
            flexGrow: 1,
            flexWrap: 'no-wrap',
            height: 'auto',
            marginBottom: '2em',
            marginTop: '2em',
            overflowX: 'auto',
        }}
    >
        {ButtonsToRender.map((button: AppButton) =>
            button.hidden ? null : (
                <Tooltip title={button.title} arrow placement="top" key={button.href}>
                    <Link to={button.href} style={{ textDecoration: 'none' }}>
                        <LabelledIconButton
                            icon={button.icon}
                            color={button.color}
                            label={button.label}
                            hover={button.hover}
                        />
                    </Link>
                </Tooltip>
            ),
        )}
    </Box>
);
