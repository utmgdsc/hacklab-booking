import { React, useState } from "react";
import {
    Button,
    TextField,
    Box,
    Stepper,
    StepLabel,
    Step
} from "@mui/material";

import { SubPage } from "../../layouts/SubPage";
import SearchIcon from '@mui/icons-material/Search';

export const CreateBooking = () => {
    const steps = ['Reason', 'Details', 'Date & Time'];
    const [activeStep, setActiveStep] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const handleNext = () => {
        setActiveStep(activeStep+1);
    }

    const handleBack = () => {
        setActiveStep(activeStep-1);
    }

    return (
        <SubPage name="Create a booking">
            <Box sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "nowrap",
                marginBottom: "4em"
            }}
            >
                <Stepper activeStep={activeStep}>
                    {steps.map((step) => (
                        <Step>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            <Box sx={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "nowrap",
                marginBottom: "4em"
            }}
            >
                null
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
