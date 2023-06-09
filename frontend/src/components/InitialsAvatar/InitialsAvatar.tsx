import { Avatar } from "@mui/material";

interface ColorHashProps {
    /** the name to get the hash of */
    name?: string;
    /** the lightness of the color */
    lightness?: number;
}

/**
 * get a hash of a string that is also a color code
 * @param {string} name the name to get the hash of
 * @param {number} lightness the lightness of the color
 * @returns {string} the color code in hsl format
 */
const colorHash = ({ name = "", lightness = 50 }: ColorHashProps): string => {
    let hash = 95;

    // use djb2 algorithm to get a hash of the name
    for (let i = 0; i < name.length; i++) {
        // ascii + hash * 33
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 120);
    const saturation = Math.abs(hash % 100);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

interface InitialsAvatarProps {
    /** the name to get the initials of */
    name?: string;
}

/**
 * Given a name get the initials of the name up to 2 characters into an avatar
 * @param {string} name the name to get the initials of
 * @returns {JSX.Element} the avatar with the initials
 */
export const InitialsAvatar = ({ name = "", ...props }: InitialsAvatarProps): JSX.Element => {
    return (
        <Avatar alt={name} style={{ backgroundColor: colorHash({ name }), color: "white" }} {...props}>
            { name.match(/(^\S\S?|\s\S)?/g).map(v => v.trim()).join("").match(/(^\S|\S$)?/g).join("").toLocaleUpperCase()}
        </Avatar>
    );
};
