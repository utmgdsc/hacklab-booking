import {
    Container,
    Typography,
    useTheme,
} from "@mui/material";

import { SubPage } from "../../layouts/SubPage";
import { THEME } from "../../theme/theme";
import { Link } from "../../components";
import SadMascot from "../../assets/img/sad-mascot.png";
import SadMascotDark from "../../assets/img/sad-mascot_dark.png";

/**
 * Shown when a user is trying to create a booking but is not in a group.
 * @returns {JSX.Element}
 */
export const NotInGroup = () => {
    const theme = useTheme();

    return (
        <SubPage name="Cannot create booking" showHead={false}>
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

                <Typography variant="h1" gutterBottom sx={{ marginTop: "1em" }}>Cannot Create Booking</Typography>
                <Typography variant="body1">
                    Please{" "}
                    <Link isInternalLink href="/group">
                        create a group
                    </Link>{" "}
                    before making a booking request.
                </Typography>
            </Container>
        </SubPage>
    );
}
