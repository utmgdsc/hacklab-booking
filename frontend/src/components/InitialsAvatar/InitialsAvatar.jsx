import { Avatar } from "@mui/material";

/**
 * get a hash of a string that is also a color code
 */
const colorHash = ({name}) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};

/**
 * Given a name get the initials of the name up to 2 characters into an avatar
 * @param {string} name the name to get the initials of
 */
export const InitialsAvatar = ({ name }) => {
    return (
        <Avatar alt={name} style={{
            backgroundColor: colorHash({name}),
        }}>
            { name.split(" ").map((word) => word[0]).slice(0, 2).join("").toUpperCase() }
        </Avatar>

    );
};
