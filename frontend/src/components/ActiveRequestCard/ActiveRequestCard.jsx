import {
  Card,
  CardActions,
  CardContent,
  Button,
  Box,
  Stepper,
  IconButton,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from "@mui/material";
import { ConvertDate } from "..";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";

const data = {
  title: "Machine Learning Workshop",
  date: new Date(),
  location: "DH 2014 (Hacklab)",
  status: 0,
  hasTCardAccess: true,
  approver: "Michael Liut",
  t_card_gatekeeper: "Andrew Wang",
};

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
export const ActiveRequestCard = ({
  reqID,
  title,
  date,
  location,
  teamName,
  status,
  approver,
  ownerHasTCard,
  owner,
  edit
}) => {
  const convertStatus = (status) => {
    switch (status) {
      case "pending":
        return 0;
      case "approval":
        return 1;
      case "tcard":
        return 2;
      case "completed":
        return 3;
      default:
        return 0;
    }
  };

  const handleEdit = () => {
    edit(reqID);
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" component="div" fontWeight={600}>
            {title}
          </Typography>

          <IconButton aria-label="edit" component="label" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Box>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          <ConvertDate date={date} /> • {location} • {teamName} • {owner}
        </Typography>

        <Stepper activeStep={convertStatus(status)} orientation="vertical">
          <Step>
            <StepLabel>Request Sent</StepLabel>
            <StepContent>
              <Typography>
                Your request has been sent to {approver} for approval.
              </Typography>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Request Approved</StepLabel>
            <StepContent>
              <Typography>{approver} has approved your request.</Typography>
            </StepContent>
          </Step>
          {ownerHasTCard ? null : (
            <Step>
              <StepLabel>Request Submitted for T-Card approval</StepLabel>
              <StepContent>
                <Typography>
                  Your request has been submitted for T-Card access.
                </Typography>
              </StepContent>
            </Step>
          )}
          <Step>
            <StepLabel>Request Completed</StepLabel>
            <StepContent>
              <Typography>Your request has been completed.</Typography>
            </StepContent>
          </Step>
        </Stepper>
      </CardContent>
    </Card>
  );
};
