import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import SettingsIcon from '@mui/icons-material/Settings';
import { LabelledIconButton } from "../../components";
import { Typography, Box, Container } from "@mui/material";

export const Home = () => {
    return (
        <Container sx={{ py: 8 }} maxWidth="md" component="main">
            <Typography variant="h5">Welcome,</Typography>
            <Typography variant="h3">Hatsune Miku</Typography>
            <Typography variant="h5">0 pending request, 0 active requests</Typography>

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
            <Typography variant="h5">Your Pending Requests</Typography>
        </Container>
    );
};
