import { LabelledIconButton } from "..";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

/**
 * An object that contains the information needed to render a
 * LabelledIconButton, including the icon to render,
 */
export interface AppButton {
    /** the icon to render */
    icon: JSX.Element;
    /** the color of the icon */
    color: string;
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
    [x: string]: any; // for the map function
    /** the array of objects to render */
    ButtonsToRender: AppButton[];
}

/**
 * Renders a list of LabelledIconButtons
 *
 * @param AppButton[] ButtonsToRender - the array of objects to render
 * @returns {JSX.Element} - the rendered list of LabelledIconButtons
 */
export const AppButtons = ({ ButtonsToRender }: AppButtonsProps): JSX.Element => (
    <>
        {ButtonsToRender.map((button: AppButton) => button.hidden ? null : (
            <Tooltip title={button.title} arrow placement="top" key={button.href}>
                <Link to={button.href}>
                    <LabelledIconButton
                        icon={button.icon}
                        color={button.color}
                        label={button.label}
                    />
                </Link>
            </Tooltip>
        ))}
    </>
);
