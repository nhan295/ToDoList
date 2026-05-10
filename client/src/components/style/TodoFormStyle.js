export const PRIORITY_OPTIONS = [
  { value: "High",   label: "Cao" },
  { value: "Medium", label: "Vừa" },
  { value: "Low",    label: "Thấp" },
];

export const STATUS_OPTIONS = [
  { value: "Pending",    label: "Chờ xử lý" },
  { value: "InProgress", label: "Đang làm" },
  { value: "Completed",  label: "Hoàn thành" },
];

export const styles = {
  // ── dialog shell ──────────────────────────────────────────────────────────
  dialog: {
    "& .MuiDialog-paper": {
      bgcolor: "#1e1c24",
      color: "grey.100",
      borderRadius: 3,
      border: "1px solid rgba(255,255,255,0.08)",
      width: "100%",
      maxWidth: 500,
      m: 2,
    },
  },

  // ── header ────────────────────────────────────────────────────────────────
  dialogTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 3,
    py: 2,
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },

  titleText: {
    fontSize: 15,
    fontWeight: 600,
    color: "grey.100",
  },

  closeBtn: {
    color: "grey.500",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 1.5,
    width: 30,
    height: 30,
    "&:hover": { color: "grey.200", borderColor: "rgba(255,255,255,0.25)" },
  },

  closeIcon: { fontSize: 16 },

  // ── body ──────────────────────────────────────────────────────────────────
  dialogContent: {
    px: 3,
    py: 2.5,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  fieldLabel: {
    fontSize: 12.5,
    fontWeight: 500,
    color: "grey.400",
    mb: 0.75,
    display: "block",
  },

  requiredStar: {
    color: "#f87171",
    ml: 0.3,
    fontSize: 12.5,
  },

  // ── text input ────────────────────────────────────────────────────────────
  textField: {
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(255,255,255,0.04)",
      borderRadius: 2,
      fontSize: 13.5,
      color: "grey.100",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#a5b4fc" },
      "&.Mui-error fieldset": { borderColor: "#f87171" },
    },
    "& input, & textarea": { color: "grey.100" },
    "& input::placeholder, & textarea::placeholder": { color: "grey.700", opacity: 1 },
    // Ẩn icon mặc định của input date/time trên Chrome
    "& input[type='date']::-webkit-calendar-picker-indicator": { filter: "invert(0.5)" },
    "& input[type='time']::-webkit-calendar-picker-indicator": { filter: "invert(0.5)" },
  },

  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 1.5,
  },

  // ── priority buttons ──────────────────────────────────────────────────────
  priorityGroup: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 1,
  },

  priorityBtn: (isActive, value) => {
    const map = {
      High:   { bg: "rgba(248,113,113,0.15)", color: "#f87171", border: "#f87171" },
      Medium: { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24", border: "#fbbf24" },
      Low:    { bg: "rgba(74,222,128,0.15)",  color: "#4ade80", border: "#4ade80" },
    };
    const c = map[value];
    return {
      py: 0.85,
      borderRadius: 2,
      border: "1px solid",
      textTransform: "none",
      fontSize: 13,
      fontWeight: isActive ? 600 : 400,
      bgcolor:     isActive ? c.bg     : "rgba(255,255,255,0.04)",
      color:       isActive ? c.color  : "grey.500",
      borderColor: isActive ? c.border : "rgba(255,255,255,0.1)",
      "&:hover": {
        bgcolor:     isActive ? c.bg    : "rgba(255,255,255,0.07)",
        borderColor: isActive ? c.border : "rgba(255,255,255,0.2)",
      },
    };
  },

  // ── select ────────────────────────────────────────────────────────────────
  select: {
    bgcolor: "rgba(255,255,255,0.04)",
    borderRadius: 2,
    fontSize: 13.5,
    color: "grey.100",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#a5b4fc" },
    "& .MuiSvgIcon-root": { color: "grey.500" },
  },

  menuItem: {
    fontSize: 13.5,
    color: "grey.200",
    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
    "&.Mui-selected": {
      bgcolor: "rgba(99,102,241,0.2)",
      "&:hover": { bgcolor: "rgba(99,102,241,0.28)" },
    },
  },

  // ── error ─────────────────────────────────────────────────────────────────
  errorText: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    fontSize: 12,
    color: "#f87171",
    mt: 0.5,
  },

  errorIcon: { fontSize: 14 },

  // ── footer ────────────────────────────────────────────────────────────────
  dialogFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 1,
    px: 3,
    py: 2,
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },

  cancelBtn: {
    textTransform: "none",
    fontSize: 13.5,
    color: "grey.400",
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 2,
    px: 2.5,
    "&:hover": {
      borderColor: "rgba(255,255,255,0.25)",
      bgcolor: "rgba(255,255,255,0.04)",
    },
  },

  submitBtn: {
    textTransform: "none",
    fontSize: 13.5,
    fontWeight: 600,
    bgcolor: "#4f46e5",
    color: "#fff",
    borderRadius: 2,
    px: 2.5,
    boxShadow: "none",
    "&:hover": { bgcolor: "#4338ca", boxShadow: "none" },
    "&.Mui-disabled": { bgcolor: "rgba(79,70,229,0.4)", color: "rgba(255,255,255,0.4)" },
  },
};