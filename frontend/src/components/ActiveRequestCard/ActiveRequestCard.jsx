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
  Tooltip
} from "@mui/material";
import { ConvertDate } from "..";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
 *
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
  end,
  location,
  teamName,
  status,
  approver,
  ownerHasTCard,
  owner,
  edit,
  cancel,
  viewOnly = false
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

  const handleCancel = () => {
    cancel(reqID);
  };

  const getTime = () => {
    let startHour = new Date(date);
    startHour = startHour.getHours();
    let endHour = new Date(end);
    endHour = endHour.getHours();
    return `${startHour}:00 - ${endHour}:00`;
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
          <Box>
            <Typography variant="h5" component="div" fontWeight={600}>
              {title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              <ConvertDate date={date} /> from {getTime()} • {location} • {teamName} • {owner}
            </Typography>
          </Box>
          {!viewOnly && (
            <Box
              sx={{
                display: "flex",
                gap: "1rem",
                height: "100%",
                justifyContent: "space-between",
              }}
            >
              <Tooltip title="Edit this Request">
                <IconButton
                  aria-label="edit"
                  component="label"
                  onClick={handleEdit}
                  disabled={!(status === "pending")}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel this Request">
                <IconButton
                  aria-label="cancel"
                  component="label"
                  onClick={handleCancel}
                  disabled={!(status === "pending") && !status === "approval"}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

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
