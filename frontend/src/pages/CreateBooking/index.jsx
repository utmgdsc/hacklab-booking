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

const monthNames = ["January", "February", "March", "April", "May", "June", "July",
     "August", "September", "October", "November", "December"];

const getDateString = (scheduleDate) => {
    var d = new Date(scheduleDate);
    return `${monthNames[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const getTimeString = (scheduleDates) => {
    var dStart = new Date(scheduleDates[0]);
    var dEnd = new Date(scheduleDates[scheduleDates.length - 1]);
    return `from ${dStart.getHours()}:00 to ${dEnd.getHours()}:00`
}

export const CreateBooking = () => {
    const steps = ['Reason', 'Details', 'Date & Time'];
    const [activeStep, setActiveStep] = useState(0);
    const [reason, setReason] = useState('club');
    const [details, setDetails] = useState('');
    const [detailError, setDetailError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [calendarDate, setDate] = useState(null);
    const [scheduleDates, setScheduleDates] = useState([]);
    const [validDate, setValidDate] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);

    const handleNext = () => {
        if (activeStep === 0) setActiveStep(activeStep + 1);
        if (activeStep === 1 || activeStep === 2) {
            if (details === '') setDetailError(true);
            else setActiveStep(activeStep + 1);

            // disable the finish button
            if (activeStep === 1) setValidDate(true);
        }
        // submit to API
        if (activeStep === 3) {
            // compile into json object
            const booking = {
                reason: reason,
                details: details,
                date: calendarDate,
                startTime: scheduleDates[0],
                endTime: scheduleDates[-1]
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

    const handleScheduleDate = (dates) => {
        var currDate = 0;
        setDateError(false);
        for (var i = 0; i < dates.length; i++){
            var d = new Date(dates[i]);
            if (d.getDate() !== currDate && i > 0){
                setDateError(true);
                return;
            }
            // console.log(`Day: ${d.getDate()}, Hour: ${d.getHours()}`);
            currDate = d.getDate();
        }
        if (dates.length > 0) setValidDate(false);
        else setValidDate(true);

        const newDates = dates.map((date) => {return date})
        setScheduleDates(newDates);
    };

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
                                marginTop: "1em",
                                marginBottom: "2em",
                                gap: "5vw"
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
                                <DatePicker label="Select a day" value={calendarDate} onChange={(newDate) => {
                                    setDate(newDate);
                                    setShowSchedule(true);
                                    }} />
                            </LocalizationProvider>
                        </Container>
                        {showSchedule &&
                            <>
                            <ScheduleSelector
                            selection={scheduleDates}
                            numDays={5}
                            minTime={8}
                            maxTime={22}
                            hourlyChunks={1}
                            startDate={ getMonday(calendarDate) }
                            onChange={ handleScheduleDate }
                            />
                            {dateError &&
                                <Typography
                                component="p"
                                color="error"
                                sx={{ marginTop: "1em" }}
                                >
                                    * please only select one day
                                </Typography>
                            }
                            </>
                        }
                    </Box>
                }

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
                        <Typography component="p" variant="h5">Date: { getDateString(scheduleDates[0]) }</Typography>
                        <Typography component="p" variant="h5">Time: { getTimeString(scheduleDates) }</Typography>
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
                            disabled={validDate}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </>
                }
            </Box>
        </SubPage>
    );
};
