import { React, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Stepper,
    StepLabel,
    Step,
    Container,
    Typography,
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ScheduleSelector from 'react-schedule-selector'
import GroupsIcon from '@mui/icons-material/Groups';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * given any date, return the date of the Monday of that week
 * @param {Date} d the date to get the Monday of
 */
const getMonday = (d) => {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
}

export const CreateBooking = () => {
    const steps = ['Reason', 'Details', 'Date & Time'];
    /*let members = ['User']
    const [memberMap, setMemberMap] = useState(members.map((member) => (
        <Typography component="p" variant="h5" key={member} sx={{
            marginBottom: "1em"
        }}>
            {member}
        </Typography>
    )));
    const [newMember, setNewMember] = useState(''); */
    const [activeStep, setActiveStep] = useState(0);
    const [reason, setReason] = useState('club');
    const [details, setDetails] = useState('');
    const [detailError, setDetailError] = useState(false);
    const [date, setDate] = useState(null);

    const handleNext = () => {
        if (activeStep === 0) setActiveStep(activeStep + 1);
        if (activeStep === 1 || activeStep === 2) {
            if (details === '') setDetailError(true);
            else setActiveStep(activeStep + 1);
        }
        // submit to API
        if (activeStep === 3) {
            // compile into json object
            const booking = {
                reason: reason,
                details: details,
                date: date,
            }
            console.log('submit to API');
        }
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    }

    const handleDetails = (e) => {
        setDetails(e.target.value);
    }

    /*const handleAddMember = () => {
        // check for valid UtorID
        members.push(newMember);
        setMemberMap(members.map((member) => (
            <Typography component="p" variant="h5" key={member} sx={{
                marginBottom: "1em"
            }}>
                {member}
            </Typography>
        )));
    }*/

    return (
        <SubPage name="Create a booking">
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "nowrap",
                marginBottom: "2em"
            }}
            >
                <Stepper activeStep={activeStep}>
                    {steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "nowrap",
                marginBottom: "2em"
            }}
            >
                {activeStep === 0 &&
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center"
                    }}>
                        <Typography component="p" variant="h5" sx={
                            { marginBottom: "1em" }
                        }>What is the purpose of this booking?</Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                marginBottom: "2em",
                                gap: "10vw"
                            }}
                        >
                            <Button
                                size="large"
                                variant="contained"
                                onClick={() => {
                                    setReason('club')
                                    handleNext();
                                }}
                                sx={{
                                    flexDirection: "column",
                                    textTransform: "none"
                                }}
                            >
                                <GroupsIcon
                                    sx={{
                                        fontSize: "5em",
                                    }}
                                />
                                For a club event
                            </Button>
                            <Button
                                size="large"
                                variant="contained"
                                onClick={() => {
                                    setReason('academic');
                                    handleNext();
                                }}
                                sx={{
                                    flexDirection: "column",
                                    textTransform: "none"
                                }}
                            >
                                <SchoolIcon
                                    sx={{
                                        fontSize: "5em",
                                    }}
                                />
                                Academic Related
                            </Button>
                        </Box>
                    </Box>
                }

                {activeStep === 1 &&
                    <TextField
                        label="Please provide an explanation"
                        required
                        onChange={handleDetails}
                        value={details}
                        error={detailError}
                        fullWidth
                        multiline
                        minRows={4}
                        helperText={detailError ? "An explanation is required" : ""}
                        id="explanation-field"
                    />
                }
                {activeStep === 2 &&
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Container sx={{
                            marginBottom: "2em"
                        }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker label="Select a day" value={date} onChange={(newDate) => setDate(newDate)} />
                            </LocalizationProvider>
                        </Container>
                        <ScheduleSelector
                            // selection={this.state.schedule}
                            numDays={5}
                            minTime={8}
                            maxTime={22}
                            hourlyChunks={2}
                            startDate={ getMonday(date) }
                        // onChange={this.handleChange}
                        />
                    </Box>
                }
                {/* {activeStep === 3 &&
                    <Box>
                        <Typography component="p" variant="h4" sx={
                            {marginBottom: "1em"}
                        }>Add others to this booking request</Typography>

                        {memberMap}

                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center"
                        }}>
                            <TextField
                            label="UtorID"
                            onChange={(e) => setNewMember(e.target.value)}
                            value={newMember}
                            fullWidth
                            id="add-member-field"
                            />
                            <Button
                                color="secondary"
                                onClick={handleAddMember}
                                sx={{
                                    marginLeft: "1em"
                                }}
                            >
                                Add
                            </Button>
                        </Box>
                    </Box>
                } */}

                {activeStep === 3 &&
                    <Container sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flexWrap: "nowrap",
                        marginBottom: "2em",
                        gap: "1em"
                    }}>

                        <CheckCircleIcon sx={{
                            fontSize: "10em",
                            color: "green"
                        }} />

                        <Typography component="p" variant="h3">Booking Submitted</Typography>
                        <Typography component="p" variant="h5">Booking for: {reason}</Typography>
                        <Typography component="p" variant="h5">Details: {details}</Typography>
                        <Typography component="p" variant="h5">Date: {date}</Typography>
                    </Container>
                }
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                {activeStep !== 0 && activeStep !== 3 &&
                    <>
                        <Button
                            onClick={handleBack}
                            disabled={activeStep === 0}
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            variant="contained"
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </>
                }
            </Box>
        </SubPage>
    );
};
