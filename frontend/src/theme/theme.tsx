import { PaletteMode, ThemeOptions } from '@mui/material';
import { grey } from '@mui/material/colors';

/**
 * enum for theme types
 * @readonly
 * @enum {string}
 */
export const THEME = {
    /** Light theme
     * @type {PaletteMode}
     */
    LIGHT: 'light' as PaletteMode,
    /** Dark theme
     * @type {PaletteMode}
     */
    DARK: 'dark' as PaletteMode,
    /** System default theme
     * @type {string}
     */
    DEFAULT: 'system',
};

/*
 * Typescript declarations for custom theme properties
 */
declare module '@mui/material/styles' {
    interface TypographyVariants {
        gray: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        gray?: React.CSSProperties;
    }

    interface PaletteOptions {
        app_colors?: {
            red?: string;
            blue?: string;
            green?: string;
            yellow?: string;
            purple?: string;
            hover?: {
                red?: string;
                blue?: string;
                green?: string;
                yellow?: string;
                purple?: string;
            };
        };
        gray?: {
            main?: string;
        };
    }

    interface Palette {
        app_colors?: {
            red?: string;
            blue?: string;
            green?: string;
            yellow?: string;
            purple?: string;
            hover?: {
                red?: string;
                blue?: string;
                green?: string;
                yellow?: string;
                purple?: string;
            };
        };
        gray?: {
            main?: string;
        };
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        gray: true;
    }
}

export const GoogleTheme = ({ mode }: { mode: PaletteMode }): ThemeOptions => {
    return {
        palette: {
            mode: mode,
            primary: {
                main: '#4285f4',
            },
            error: {
                main: '#ea4335',
            },
            warning: {
                main: '#fbbc04',
            },
            info: {
                main: '#4285f4',
            },
            success: {
                main: '#0f9d58',
            },
            // action: {
            //     light: {
            //         active: "#000",
            //         disabled: "#5f6368",
            //     }
            // },
            background: {
                default: mode === THEME.DARK ? '#222' : '#fff',
                paper: mode === THEME.DARK ? '#222' : '#fff',
            },
            gray: {
                main: mode === THEME.DARK ? '#c5d3e3' : '#5f6368',
            },
            text: {
                primary: mode === THEME.DARK ? 'rgba(255,255,255,.87)' : '#202124',
                secondary: mode === THEME.DARK ? 'rgba(255,255,255,.60)' : '#5f6368',
                disabled: mode === THEME.DARK ? 'rgba(255,255,255,.38)' : '#5f6368',
            },
            app_colors: {
                red: mode === THEME.DARK ? '#4d3a3a' : '#f35325',
                blue: mode === THEME.DARK ? '#3b4552' : '#05a6f0',
                green: mode === THEME.DARK ? '#3f4d3f' : '#81bc06',
                yellow: mode === THEME.DARK ? '#525238' : '#ffb900',
                purple: mode === THEME.DARK ? '#533953' : '#7b00ff',
                hover: {
                    red: mode === THEME.DARK ? '#745e5e' : '#cc451f',
                    blue: mode === THEME.DARK ? '#697380' : '#0389c7',
                    green: mode === THEME.DARK ? '#6b836b' : '#6c9c03',
                    yellow: mode === THEME.DARK ? '#86866d' : '#ce9803',
                    purple: mode === THEME.DARK ? '#836a83' : '#6000c7',
                },
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
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'sans-serif',
            ].join(','),
            h1: {
                fontSize: '2.5em',
                fontWeight: 500,
                lineHeight: 1.2,
                letterSpacing: '-0.00833em',
            },
            h2: {
                fontSize: '2em',
                fontWeight: 500,
                lineHeight: 1.2,
                letterSpacing: '-0.00833em',
            },
            h3: {
                fontSize: '1.75em',
                fontWeight: 500,
                lineHeight: 1.2,
                letterSpacing: '-0.00833em',
            },
            h4: {
                fontSize: '1.5em',
                fontWeight: 500,
                lineHeight: 1.2,
                letterSpacing: '-0.00833em',
            },
            h5: {
                fontSize: '1.25em',
                lineHeight: 1.2,
                letterSpacing: '-0.00833em',
            },
            gray: {
                color: grey[600],
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: '1em',
                        borderColor: mode === THEME.LIGHT ? '#e8eaed' : '#404040',
                    },
                },
            },
            MuiCardContent: {
                styleOverrides: {
                    root: {
                        padding: '1.25em 1.25em 0',
                    },
                },
            },
            MuiCardActions: {
                styleOverrides: {
                    root: {
                        padding: '1.25em',
                        borderTop: '1px solid',
                        borderColor: mode === THEME.LIGHT ? '#e8eaed' : '#404040',
                        marginTop: '1.25em',
                        gap: '2em',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: '1.25em',
                    },
                },
            },
        },
    };
};
