import React, { Ref } from 'react';
// import { NavLink as RouterLink } from 'react-router-dom';
import { OpenInNew } from '@mui/icons-material';
import { Link as MaterialLink, LinkProps as MaterialLinkProps } from '@mui/material';

interface NonForwardLinkProps extends MaterialLinkProps {
  /** The link's href */
  href: string;
  /** If true, the link will open in a new tab */
  external?: boolean;
  /** A ref to pass to the link */
  forwardedRef?: Ref<any>;
  /** If true, the link will open in the same tab */
  internal?: boolean;
  /** If true, the external icon will not be shown */
  noIcon?: boolean;
  /** If true, the link will use the ReactRouter component */
  isInternalLink?: boolean;
}

/**
 * A link
 * @param {Object} props The props
 * @returns {JSX.Element} A link
 */
const NonForwardLink = ({
  children,
  href,
  external,
  forwardedRef,
  isInternalLink,
  noIcon,
  ...props
}: NonForwardLinkProps): JSX.Element => {
  return (
    <MaterialLink
      href={href}
      ref={forwardedRef}
      rel={external ? "noopener noreferrer" : ""}
      target={external ? "_blank" : ""}
      {...props}
    >
      {children}
      {external && !noIcon && (
        <OpenInNew
          fontSize="inherit"
          color="inherit"
          titleAccess="Opens in new tab"
          sx={{
            height: "0.8em",
            marginLeft: "0.3em",
            opacity: 0.8,
            width: "0.8em",
            "&:hover": {
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
