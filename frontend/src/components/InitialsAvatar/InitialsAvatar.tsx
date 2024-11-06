import { Avatar } from '@mui/material';
import { colorHash } from '..';
interface InitialsAvatarProps {
    /** the name to get the initials of */
    name?: string;
}

/**
 * Given a name get the initials of the name up to 2 characters into an avatar
 * @returns {JSX.Element} the avatar with the initials
 */
export const InitialsAvatar = ({ name = '', ...props }: InitialsAvatarProps): JSX.Element => {
    return (
        <Avatar alt={name} style={{ backgroundColor: colorHash({ name }), color: 'white' }} {...props}>
            {name
                .match(/(^\S\S?|\s\S)?/g)
                .map((v) => v.trim())
                .join('')
                .match(/(^\S|\S$)?/g)
                .join('')
                .toLocaleUpperCase()}
        </Avatar>
    );
};
