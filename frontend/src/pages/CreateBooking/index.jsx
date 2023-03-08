import { React, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Stepper,
    StepLabel,
    Step,
    RadioGroup,
    FormControl,
    FormLabel,
    FormControlLabel,
    Radio,
    Container
} from "@mui/material";
import { SubPage } from "../../layouts/SubPage";
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
// import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import ScheduleSelector from 'react-schedule-selector'



export const CreateBooking = () => {
    const steps = ['Reason', 'Details', 'Date & Time'];
    const [activeStep, setActiveStep] = useState(0);
    const [reason, setReason] = useState('club');
    const [details, setDetails] = useState('');
    const [detailError, setDetailError] = useState(false);
    const [date, setDate] = useState(null);

    const handleNext = () => {
        if (activeStep === 0) setActiveStep(activeStep + 1);
        if (activeStep === 1) {
            if (details === '') setDetailError(true);
            else setActiveStep(activeStep + 1);
        }
    }

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    }

    const handleDetails = (e) => {
        setDetails(e.target.value);
    }

    const handleDate = (e) => {
        setDate(e.target.value);
        console.log(date);
    }

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
                    <FormControl>
                        <FormLabel>What is the purpose of this booking?</FormLabel>
                        <RadioGroup
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <FormControlLabel value={'club'} control={<Radio />} label="Club Related" />
                            <FormControlLabel value={'academic'} control={<Radio />} label="Academic Related" />
                        </RadioGroup>
                    </FormControl>
                }

                {activeStep === 1 &&
                    <TextField
                        label="Please provide an explanation"
                        required
                        onChange={handleDetails}
                        value={details}
                        error={detailError}
                    />
                }
                {activeStep === 2 &&
                    <Container>
                        <LocalizationProvider dateAdapter={AdapterDayjs}></LocalizationProvider>
                            <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
                        <LocalizationProvider/>

                        <ScheduleSelector
                            // selection={this.state.schedule}
                            numDays={5}
                            minTime={8}
                            maxTime={22}
                            hourlyChunks={2}
                            // onChange={this.handleChange}
                        />
                    </Container>
                }
            </Box>

            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Button
                    onClick={handleBack}
                    variant="contained"
                    disabled={activeStep === 0}
                >
                    Back
                </Button>
                <Button
                    onClick={handleNext}
                    variant="contained"
                >
                    Next
                </Button>
            </Box>
        </SubPage>
    );
};
