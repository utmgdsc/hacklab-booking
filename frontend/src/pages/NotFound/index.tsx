import { Link } from "../../components";
import { Typography } from "@mui/material";
import { ErrorPage } from "../../layouts/ErrorPage";

export const NotFound = () => {
  return (
    <ErrorPage
      name="Page not found"
      message={
        <Typography>
          The page you are looking for does not exist. Please{" "}
          <Link isInternalLink href="/">
            return to the dashboard
          </Link>
          .
        </Typography>
      }
    />
  );
};
