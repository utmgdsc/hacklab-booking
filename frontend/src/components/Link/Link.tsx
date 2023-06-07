import React, { Ref } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { OpenInNew } from '@mui/icons-material';
import { Link as MaterialLink, LinkProps as MaterialLinkProps } from '@mui/material';

interface NonForwardLinkProps extends MaterialLinkProps {
  href: string;
  external?: boolean;
  forwardedRef?: Ref<any>;
  internal?: boolean;
  noIcon?: boolean;
  isInternalLink?: boolean;
}

/**
 * A link
 * @param {Object} props The props
 * @param {React.ReactNode} props.children The link's children
 * @param {string} props.href The link's href
 * @param {boolean} props.external If true, the link will open in a new tab
 * @param {React.Ref} props.forwardedRef A ref to pass to the link
 * @param {boolean} props.internal If true, the link will open in the same tab
 * @param {boolean} props.noIcon If true, the external icon will not be shown
 * @param {Object} props.props Any other props
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
