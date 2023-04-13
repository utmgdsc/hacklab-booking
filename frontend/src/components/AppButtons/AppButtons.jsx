import {
    LabelledIconButton
} from "../../components";

import {
    Link,
    Tooltip,
} from "@mui/material";

/**
 * Renders a list of LabelledIconButtons given an array of objects with the following properties
 *  - icon: the icon to render
 *  - color: the color of the icon
 *  - label: the label to render
 *  - href: the href to link to
 *  - title: the title to display on hover
 *  - hidden [optional]: whether or not to render the button
 *
 * @param {icon: JSX.Element, color: string, label: string, href: string, title: string, hidden: boolean} ButtonsToRender - the array of objects to render
 * @returns {JSX.Element} - the rendered list of LabelledIconButtons
 */
export const AppButtons = ({ ButtonsToRender }) =>
    ButtonsToRender.map((button) => button["hidden"] ? null : (
        <Tooltip title={button["title"]} arrow placement="top" key={button["href"]}>
            <Link href={button["href"]} isInternalLink>
                <LabelledIconButton
                    icon={button["icon"]}
                    color={button["color"]}
                    label={button["label"]}
                />
            </Link>
        </Tooltip>
    ))
