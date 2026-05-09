export const authStyles = {
  // ─────────────────────────────────────────────
  // Page Wrapper
  // ─────────────────────────────────────────────

  pageWrapper: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #151515 0%, #202020 45%, #2b2b2b 100%)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    position: "relative",
    overflow: "hidden",

    px: 2,
    fontFamily: "'DM Sans', sans-serif",
  },

  // ─────────────────────────────────────────────
  // Background Decoration
  // ─────────────────────────────────────────────

  bgDecor: {
    position: "absolute",
    borderRadius: "50%",
    opacity: 0.05,
    pointerEvents: "none",
    filter: "blur(10px)",
  },

  bgDecor1: {
    width: 500,
    height: 500,
    background: "#ffffff",
    top: -150,
    left: -120,
  },

  bgDecor2: {
    width: 350,
    height: 350,
    background: "#8c8c8c",
    bottom: -120,
    right: -80,
  },

  bgDecor3: {
    width: 220,
    height: 220,
    background: "#707070",
    top: "50%",
    left: "58%",
  },

  // ─────────────────────────────────────────────
  // Main Card
  // ─────────────────────────────────────────────

  card: {
    width: "100%",
    maxWidth: 460,

    borderRadius: "24px",

    background: "rgba(255,255,255,0.05)",

    backdropFilter: "blur(24px)",

    border: "1px solid rgba(255,255,255,0.08)",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",

    p: {
      xs: 4,
      sm: 5,
    },

    position: "relative",
    zIndex: 1,
  },

  // ─────────────────────────────────────────────
  // Logo
  // ─────────────────────────────────────────────

  logoBox: {
    width: 56,
    height: 56,

    borderRadius: "16px",

    background:
      "linear-gradient(135deg, #5f5f5f 0%, #9b9b9b 100%)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    mb: 3,

    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  // ─────────────────────────────────────────────
  // Title
  // ─────────────────────────────────────────────

  title: {
    color: "#f5f5f5",

    fontWeight: 700,

    letterSpacing: "-0.5px",

    fontSize: {
      xs: "1.7rem",
      sm: "2rem",
    },

    mb: 0.5,
  },

  subtitle: {
    color: "#9a9a9a",

    fontSize: "0.9rem",

    mb: 3.5,
  },

  // ─────────────────────────────────────────────
  // Tabs
  // ─────────────────────────────────────────────

  tabsRoot: {
    mb: 3.5,

    "& .MuiTabs-root": {
      minHeight: 42,
    },

    "& .MuiTabs-flexContainer": {
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    },

    "& .MuiTab-root": {
      textTransform: "none",

      fontWeight: 600,

      fontSize: "0.92rem",

      color: "#777",

      minHeight: 42,

      transition: "0.25s",

      "&.Mui-selected": {
        color: "#f0f0f0",
      },
    },

    "& .MuiTabs-indicator": {
      background: "#d0d0d0",

      height: 2,

      borderRadius: 999,
    },
  },

  // ─────────────────────────────────────────────
  // Text Field
  // ─────────────────────────────────────────────

  textField: {
    mb: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: "14px",

      background: "rgba(255,255,255,0.04)",

      color: "#f1f1f1",

      fontSize: "0.92rem",

      transition: "0.25s",

      "& fieldset": {
        borderColor: "rgba(255,255,255,0.08)",
      },

      "&:hover fieldset": {
        borderColor: "rgba(255,255,255,0.18)",
      },

      "&.Mui-focused": {
        background: "rgba(255,255,255,0.06)",

        "& fieldset": {
          borderColor: "#bdbdbd",
        },
      },
    },

    "& .MuiInputLabel-root": {
      color: "#8f8f8f",

      fontSize: "0.9rem",

      "&.Mui-focused": {
        color: "#d0d0d0",
      },
    },

    "& .MuiOutlinedInput-input": {
      py: 1.5,
    },

    "& .MuiInputAdornment-root svg": {
      color: "#bdbdbd",
      fontSize: "1.15rem",
      transition: "0.2s",
    },

    "& .Mui-focused .MuiInputAdornment-root svg": {
      color: "#ffffff",
    },

    "& .MuiFormHelperText-root": {
      color: "#ff6b6b",
      fontSize: "0.75rem",
      marginLeft: "2px",
    },
  },

  // ─────────────────────────────────────────────
  // Password Eye Button
  // ─────────────────────────────────────────────

  eyeBtn: {
    color: "#bdbdbd",

    transition: "0.2s",

    "&:hover": {
      color: "#ffffff",
      background: "rgba(255,255,255,0.08)",
    },
  },

  // ─────────────────────────────────────────────
  // Submit Button
  // ─────────────────────────────────────────────

  submitBtn: {
    mt: 1,

    py: 1.45,

    borderRadius: "14px",

    background:
      "linear-gradient(135deg, #666 0%, #8a8a8a 100%)",

    color: "#ffffff",

    textTransform: "none",

    fontWeight: 700,

    fontSize: "0.94rem",

    letterSpacing: "0.3px",

    boxShadow: "0 6px 24px rgba(0,0,0,0.35)",

    transition: "0.25s",

    "&:hover": {
      background:
        "linear-gradient(135deg, #767676 0%, #a0a0a0 100%)",

      transform: "translateY(-1px)",

      boxShadow: "0 8px 28px rgba(0,0,0,0.45)",
    },

    "&:active": {
      transform: "translateY(0)",
    },

    "&.Mui-disabled": {
      background: "rgba(255,255,255,0.08)",
      color: "#555",
    },
  },

  // ─────────────────────────────────────────────
  // Divider
  // ─────────────────────────────────────────────

  divider: {
    my: 3,

    "&::before, &::after": {
      borderColor: "rgba(255,255,255,0.08)",
    },

    "& .MuiDivider-wrapper": {
      color: "#666",
      fontSize: "0.8rem",
    },
  },

  // ─────────────────────────────────────────────
  // Footer Text
  // ─────────────────────────────────────────────

  footerText: {
    textAlign: "center",

    color: "#777",

    fontSize: "0.84rem",

    mt: 2,

    "& span": {
      color: "#d0d0d0",

      cursor: "pointer",

      fontWeight: 600,

      ml: 0.5,

      transition: "0.2s",

      "&:hover": {
        color: "#ffffff",
      },
    },
  },

  // ─────────────────────────────────────────────
  // Alert
  // ─────────────────────────────────────────────

  alert: {
    borderRadius: "12px",

    mb: 2.5,

    fontSize: "0.83rem",

    "& .MuiAlert-icon": {
      fontSize: "1rem",
    },
  },
};