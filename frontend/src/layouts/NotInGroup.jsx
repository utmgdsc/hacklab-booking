import {
    Container,
    Typography,
    useTheme,
} from "@mui/material";

import { SubPage } from "./SubPage";
import { THEME } from "../theme/theme";
import { Link } from "../components";
import SadMascot from "../assets/img/sad-mascot.png";
import SadMascotDark from "../assets/img/sad-mascot_dark.png";

/**
 * Shown when a user is trying to create a booking but is not in a group.
 * @param {string} name The name of the page.
 * @returns {JSX.Element}
 */
export const NotInGroup = ({name = "Cannot create booking"}) => {
    const theme = useTheme();

    return (
        <SubPage name={name} showHead={false}>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "nowrap",
                    marginTop: "2em",
                    gap: "1em",
                }}
            >

                <img width="300" src={theme.palette.mode === THEME.DARK ? SadMascotDark : SadMascot} alt={"Sparkle Mascot"} />

                <Typography variant="h1" gutterBottom sx={{ marginTop: "1em" }}>{name}</Typography>
                <Typography variant="body1">
                    Please{" "}
                    <Link isInternalLink href="/group">
                        create a group
                    </Link>{" "}
                    before making or editing a booking request.
                </Typography>
            </Container>
        </SubPage>
    );
}
