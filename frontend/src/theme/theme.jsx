import { createTheme } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

/**
 * @return {boolean} true if the user has set their OS to dark mode
 */
export const prefersDarkMode = () => {
    // if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    //     return true;
    // }
    return false;
}

export const GoogleTheme = createTheme({
    palette: {
        mode: prefersDarkMode() ? "dark" : "light",
        primary: {
            main: "#4285f4",
        },
        error: {
            main: "#ea4335",
        },
        warning: {
            main: "#fbbc04",
        },
        info: {
            main: "#4285f4",
        },
        success: {
            main: "#0f9d58",
        },
        action: {
            light: {
                active: "#000",
                disabled: "#5f6368",
            }
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
    typography: {
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            "Segoe UI",
            "Roboto",
            "Helvetica Neue",
            "Arial",
            "sans-serif"
        ].join(","),
        h1: {
            fontSize: "2.5em",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.00833em",
        },
        h2: {
            fontSize: "2em",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.00833em",
        },
        h3: {
            fontSize: "1.75em",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.00833em",
        },
        h4: {
            fontSize: "1.5em",
            fontWeight: 500,
            lineHeight: 1.2,
            letterSpacing: "-0.00833em",
        },
        h5: {
            fontSize: "1.25em",
            lineHeight: 1.2,
            letterSpacing: "-0.00833em",
        },
        gray: {
            color: grey[600]
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    width: "100%",
                    margin: "1em 0",
                    borderRadius: "1em",
                    border: "1px solid #e8eaed",
                    boxShadow: "unset"
                }
            },

        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: "1.25em 1.25em 0",
                }
            }
        },
        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: "1.25em",
                    borderTop: "1px solid #e8eaed",
                    marginTop: "1.25em",
                    gap: "2em"
                }
            }
        }
    }
});