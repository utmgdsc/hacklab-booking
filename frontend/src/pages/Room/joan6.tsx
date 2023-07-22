import { Box, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"


export const Joan6 = () => {
    const [CurrentDateTime, setCurrentDateTime] = useState(new Date().toLocaleString());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date().toLocaleString());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Grid container>
            <Grid item xs={7}>
                <Box sx={{ height: "100vh" }}>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        padding: "2em",
                    }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                            <Typography variant="gray" sx={{ fontSize: "1.25em" }}>Hacklab • DH2014</Typography>
                            <Typography variant="gray" sx={{ fontSize: "1.25em" }}>{CurrentDateTime}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h3" component="p" sx={{ fontWeight: 400, opacity: 0.5 }}>Booked by CSSC</Typography>
                            <Typography variant="h1" sx={{ fontSize: "4em", fontWeight: 700 }}>Maid Café</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 400 }}>3:00 - 7:00 PM</Typography>
                            <Typography variant="gray" sx={{ fontSize: "1.15em" }}>Join us for our annual maid café! Michael Liut himself will be wearing the fit and will be personally serving you lattes with DIY milk!</Typography>
                        </Box>
                        <Box>
                            <Typography variant="h1" sx={{ fontWeight: 700, fontSize: "4em" }} component="h2">Busy</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 400, opacity: 0.5 }}>Will be free at 2pm</Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
            <Grid item xs={5}>
                <Box sx={{ background: "#f5f5f5", height: "100vh" }}>
                    <Typography variant="h2">Joan6</Typography>
                </Box>
            </Grid>
        </Grid>
    )
}
