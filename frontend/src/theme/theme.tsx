import { grey } from '@mui/material/colors';

/**
 * enum for theme types
 * @readonly
 * @enum {string}
 */
export const THEME = {
    /** Light theme
     * @type {string}
     */
    LIGHT: "light",
    /** Dark theme
     * @type {string}
     */
    DARK: "dark",
    /** System default theme
     * @type {string}
     */
    DEFAULT: "system",
}

export const GoogleTheme = ( mode: string ) => {
    return ({
        palette: {
            mode: mode,
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
            gray: {
                main: mode === THEME.DARK ? "#c5d3e3" : "#5f6368",
            },
            text: {
                primary: mode === THEME.DARK ? "rgba(255,255,255,.87)" : "#202124",
                secondary: mode === THEME.DARK ? "rgba(255,255,255,.60)" : "#5f6368",
                disabled: mode === THEME.DARK ? "rgba(255,255,255,.38)" : "#5f6368",
            },
            app_colors: {
                red: mode === THEME.DARK ? "#ea4335" : "#f35325",
                blue: mode === THEME.DARK ? "#4285f4" : "#05a6f0",
                green: mode === THEME.DARK ? "#34a853" : "#81bc06",
                yellow: mode === THEME.DARK ? "#fbbc04" : "#ffb900",
                purple: mode === THEME.DARK ? "#a142f4" : "#7b00ff",
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
                        boxShadow: "unset",
                        border: "1px solid",
                        borderColor: mode === THEME.LIGHT ? "#e8eaed" : "#0a0a0a",
                    }
                }
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
                        borderTop: "1px solid",
                        borderColor: mode === THEME.LIGHT ? "#e8eaed" : "#0a0a0a",
                        marginTop: "1.25em",
                        gap: "2em"
                    }
                }
            }
        }
    })
}
