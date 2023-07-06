import React, { Ref } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { OpenInNew } from '@mui/icons-material';
import { Link as MaterialLink, LinkProps as MaterialLinkProps } from '@mui/material';

interface NonForwardLinkProps extends MaterialLinkProps {
    /** The link's href */
    href: string;
    /**
     * Override the default behavior of opening in a new tab.
     * By default, the link will open in a new tab if it is external.
     * @default !internal
     */
    openInNewTab?: boolean;
    /** A ref to pass to the link */
    forwardedRef?: Ref<any>;
    /** If true, the link will use the ReactRouter component */
    internal?: boolean;
}

/**
 * A link
 * @param {Object} props The props
 * @returns {JSX.Element} A link
 */
const NonForwardLink = ({
    children,
    href,
    forwardedRef,
    internal = false,
    openInNewTab = !internal,
    ...props
}: NonForwardLinkProps) => {
    return (
        <MaterialLink
            href={href}
            ref={forwardedRef}
            rel={openInNewTab ? 'noopener noreferrer' : ''}
            target={openInNewTab ? '_blank' : ''}
            component={internal ? RouterLink : 'a'}
            {...(internal ? { to: href } : { href })}
            {...props}
        >
            {children}
            {openInNewTab && (
                <OpenInNew
                    fontSize="inherit"
                    color="inherit"
                    titleAccess="Opens in new tab"
                    sx={{
                        height: '0.8em',
                        marginLeft: '0.3em',
                        opacity: 0.8,
                        width: '0.8em',
                        '&:hover': {
                            opacity: 1,
                        },
                    }}
                />
            )}
        </MaterialLink>
    );
};

export const Link = React.forwardRef((props: NonForwardLinkProps, ref: Ref<any>) => (
    <NonForwardLink {...props} forwardedRef={ref} />
));
