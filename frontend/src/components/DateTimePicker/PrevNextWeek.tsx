import { ArrowBackIos as ArrowBackIcon, ArrowForwardIos as ArrowForwardIcon } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { GetMonday } from '..';

/**
 * controls the previous and next week buttons, and the date picker.
 *
 * it also handles for the blocked dates
 *
 * @returns the previous and next week buttons, and the date picker
 */
export const PrevNextWeek = ({
    calendarDate = dayjs(),
    setDate,
    handleBlockedDates,
}: {
    /** the current calendar date to show on the picker */
    calendarDate: Dayjs;
    /** a function that is called when the date has to be set */
    setDate: (date: Dayjs) => void;
    /** a function that is called to set the array of dates that are blocked */
    handleBlockedDates: (date: Date | Dayjs) => void;
}) => {
    return (
        <Grid container sx={{ marginBottom: '1em' }}>
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'start',
                    alignItems: 'center',
                    gap: '1em',
                }}
            >
                <Box>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setDate(dayjs());
                            handleBlockedDates(calendarDate);
                        }}
                        sx={{
                            textTransform: 'none',
                        }}
                    >
                        Today
                    </Button>
                </Box>
                <Box>
                    <Tooltip title="Previous week">
                        <span>
                            <IconButton
                                onClick={() => {
                                    setDate(calendarDate.subtract(7, 'day'));
                                    handleBlockedDates(calendarDate);
                                }}
                                disabled={calendarDate.subtract(7, 'day').isBefore(dayjs(), 'day')}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Next week">
                        <span>
                            <IconButton
                                onClick={() => {
                                    setDate(calendarDate.add(7, 'day'));
                                    handleBlockedDates(calendarDate);
                                }}
                                disabled={calendarDate.isAfter(dayjs().add(1, 'year'), 'day')}
                            >
                                <ArrowForwardIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
                <Typography component="p" variant="h5">
                    {GetMonday(calendarDate).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </Typography>
            </Grid>
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'end',
                    my: {
                        xs: '2em',
                        md: '0',
                    },
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select a day"
                        value={calendarDate}
                        onChange={(newDate) => {
                            if (newDate) {
                                setDate(newDate);
                            }
                            handleBlockedDates(calendarDate);
                        }}
                        disablePast
                        maxDate={dayjs().add(1, 'year')}
                    />
                </LocalizationProvider>
            </Grid>
        </Grid>
    );
};
