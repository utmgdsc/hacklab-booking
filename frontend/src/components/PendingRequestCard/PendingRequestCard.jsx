import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography
} from '@mui/material';
import { ConvertDate } from "../../components"
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

/**
 * A card that displays a pending request
 * TODO: fetch data from backend via GUID instead of passing in props
 * @param {string} name the name of the user who sent the request
 * @param {string} utorid the utorid of the user who sent the request
 * @param {string} title the title of the request
 * @param {Date} date the date of the request
 * @param {string} description the description of the request
 * @param {string} location the location of the request
 */
export const PendingRequestCard = ({ name, utorid, title, date, description, location }) => {
    return (
        <Card
            sx={{
                width: "100%",
                margin: "1em 0",
                backgroundColor: "#f5f5f5"
            }}
        >
            <CardContent
                sx={{
                    padding: "1.25em 1.25em 0"
                }}
            >
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Request from {name} ({utorid})
                </Typography>
                <Typography variant="h5" component="div" fontWeight={600}>
                    {title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <ConvertDate date={date}/> • {location}
                </Typography>

                <Typography variant="p">{description}</Typography>
            </CardContent>
            <CardActions
                sx={{
                    padding: "1.25em"
                }}
            >
                <Button variant="contained" color="success" startIcon={<DoneIcon />}>Approve</Button>
                <Button variant="outlined" color="error" startIcon={<CloseIcon />}>Deny</Button>
            </CardActions>
        </Card>
    );
}
