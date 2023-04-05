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

const data = {
    title: "Machine Learning Workshop",
    date: new Date(),
    location: "DH 2014 (Hacklab)",
    status: 0,
    hasTCardAccess: true,
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
export const ActiveRequestCard = ({ title, date, location, teamName, status }) => {
    const convertStatus = () => {
        switch (status) {
            case "pending":
                return 0;
            case "approved":
                return 1;
            case "t_card_access":
                return 2;
            case "completed":
                return 3;
            default:
                return 0;
        }
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div" fontWeight={600}>
                    { title }
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <ConvertDate date={ date }/> • { location } • { teamName }
                </Typography>

                <Stepper activeStep={ convertStatus } orientation="vertical">
                    <Step>
                        <StepLabel>Request Sent</StepLabel>
                        <StepContent>
                            <Typography>
                                Your request has been sent to { data.approver } for approval.
                            </Typography>
                        </StepContent>
                    </Step>
                    <Step>
                        <StepLabel>Request Approved</StepLabel>
                        <StepContent>
                            <Typography>
                                { data.approver } has approved your request.
                            </Typography>
                        </StepContent>
                    </Step>
                    {
                        data.hasTCardAccess ? null : (
                            <Step>
                                <StepLabel>Request Submitted for T-Card approval</StepLabel>
                                <StepContent>
                                    <Typography>
                                        Your request has been submitted to { data.t_card_gatekeeper } for approval.
                                    </Typography>
                                </StepContent>
                            </Step>
                        )
                    }
                    <Step>
                        <StepLabel>Request Completed</StepLabel>
                        <StepContent>
                            <Typography>
                                Your request has been completed.
                            </Typography>
                        </StepContent>
                    </Step>
                </Stepper>
            </CardContent>

        </Card>
    );
}
