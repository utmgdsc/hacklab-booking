import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ErrorPage } from '../../layouts/ErrorPage';
import { Link } from '../Link/Link';

/**
 * A component that will only render its children if the user has the specified role
 * @param {UserRoles[]} props.role the list role(s) that the user must have one of to render the children
 * @param {React.ReactNode} props.children the children to protect with the role
 * @returns {React.ReactNode} the children if the user has the role, otherwise a 404 page
 */
export const RequireRole = (props: { role: UserRoles[]; children: React.ReactNode }) => {
    const { userInfo } = useContext(UserContext);
    if (props.role.includes(userInfo.role)) {
        return <>{props.children}</>;
    } else {
        return (
            <ErrorPage
                name="Sawwy >~<"
                message={
                    <>
                        konna ooki na diamondo mita koto naideshou? ageru neeeeeeeeeeee -{' '}
                        <Link href="/">Time to twirl to the dashboard</Link>.
                    </>
                }
            />
        );
    }
};
