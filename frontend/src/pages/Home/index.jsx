import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import { LabelledIconButton } from "../../components";
import { Typography, Box, Container } from "@mui/material";
import { Avatar } from "@mui/material";
import SparkleMascot from "../../assets/img/sparkle-mascot.png";

export const Home = () => {
    return (
        <Container sx={{ py: 8 }} maxWidth="md" component="main">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginTop: "2em",
                    marginBottom: "2em"
                }}
            >
                <Box>
                    <Typography variant="h5">Welcome,</Typography>
                    <Typography variant="h3"><strong>Hatsune Miku</strong></Typography>
                    <Typography variant="h5">0 pending request, 0 active requests</Typography>
                </Box>
                <Avatar>HM</Avatar>
            </Box>


            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "left",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginTop: "2em",
                    marginBottom: "2em"
                }}
            >
                <LabelledIconButton icon={<InventoryIcon />} color="black" label="Track" />
                <LabelledIconButton icon={<CalendarTodayIcon />} color="black" label="Book" />
                <LabelledIconButton icon={<SettingsIcon />} color="black" label="Settings" />
            </Box>

            <Typography variant="h5">Your Active Requests</Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "4em"
                }}
            >
                <img width="200" src={SparkleMascot} alt="Sparkle Mascot" />
                <Typography color="grey" sx={{ marginTop: "2em" }}>
                    You don't have any active requests. Hooray!
                </Typography>
            </Box>
            <Typography variant="h5">Your Pending Requests</Typography>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                    marginBottom: "4em"
                }}
            >
                <img width="200" src={SparkleMascot} alt="Sparkle Mascot" />
                <Typography color="grey" sx={{ marginTop: "2em" }}>
                    You don't have any pending requests. Click the "Book" button to get started!
                </Typography>
            </Box>
        </Container>
    );
};
