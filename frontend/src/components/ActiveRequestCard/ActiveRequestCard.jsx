import {
    Card,
    CardActions,
    CardContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Typography
} from '@mui/material';
import { ConvertDate } from ".."
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { requests } from "../../strings/en_ca";

const data = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    title: "Machine Learning Workshop",
    date: new Date(),
    location: "DH 2014 (Hacklab)",
    status: 0,
    approver: "hatsunem",
    t_card_gatekeeper: "kagaminr"
}

/**
 * A card that displays a active request
 * TODO: fetch data from backend via GUID instead of passing in props
 * @param {string} name the name of the user who sent the request
 * @param {string} utorid the utorid of the user who sent the request
 * @param {string} title the title of the request
 * @param {Date} date the date of the request
 * @param {string} description the description of the request
 * @param {string} location the location of the request
 */
export const ActiveRequestCard = ({ title, date, location, status }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div" fontWeight={600}>
                    { data.title }
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <ConvertDate date={ data.date }/> • { data.location }
                </Typography>

                <Stepper activeStep={ data.status } orientation="vertical">
                    <Step>
                        <StepLabel>Request Sent</StepLabel>
                        <StepContent>
                            <Typography>
                                { requests.request_sent }
                            </Typography>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Request Approved</StepLabel>
                        <StepContent>
                            <Typography>
                                { requests.professor_approval }
                            </Typography>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Request Submitted for T-Card approval</StepLabel>
                        <StepContent>
                            <Typography>
                                { requests.t_card_pending }
                            </Typography>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Request Completed</StepLabel>
                        <StepContent>
                            <Typography>
                                { requests.request_completed }
                            </Typography>
                        </StepContent>
                    </Step>
                </Stepper>
            </CardContent>

        </Card>
    );
}
