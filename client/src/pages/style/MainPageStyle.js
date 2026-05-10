export const FILTERS = [
  { key: "all",     label: "All" },
  { key: "doing",   label: "Doing" },
  { key: "done",    label: "Done" },
  { key: "overdue", label: "Overdue" },
];

export const SORT_OPTIONS = ["Default", "Due Date", "Priority"];

export const SECTION_ORDER = ["today", "overdue", "upcoming", "done"];

export const SECTION_LABELS = {
  today:    "Today",
  overdue:  "Overdue",
  upcoming: "Upcoming",
  done:     "Done",
};

export const PRIORITY_CONFIG = {
  High:   { label: "High",  sx: { bgcolor: "#3d1a1a", color: "#f87171", fontWeight: 600 } },
  Medium: { label: "Medium",  sx: { bgcolor: "#3d2e0d", color: "#fbbf24", fontWeight: 600 } },
  Low:    { label: "Low", sx: { bgcolor: "#1a3020", color: "#4ade80", fontWeight: 600 } },
};

export const styles = {
  // ── layout ────────────────────────────────────────────────────────────────
  wrapper: {
    bgcolor: "#1a1a1f",
    minHeight: "100vh",
    color: "grey.100",
    p: { xs: 2, sm: 3 },
  },

  container: {
    maxWidth: 720,
    mx: "auto",
  },

  // ── header ────────────────────────────────────────────────────────────────
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 2.5,
  },

  headerTitle: {
    fontWeight: 600,
    fontSize: 18,
    color: "grey.100",
  },

  addButton: {
    borderColor: "rgba(255,255,255,0.18)",
    color: "grey.200",
    textTransform: "none",
    fontWeight: 500,
    fontSize: 13.5,
    borderRadius: 2,
    px: 2,
    "&:hover": {
      borderColor: "rgba(255,255,255,0.35)",
      bgcolor: "rgba(255,255,255,0.05)",
    },
  },

  // ── search ────────────────────────────────────────────────────────────────
  searchField: {
    mb: 1.5,
    "& .MuiOutlinedInput-root": {
      bgcolor: "rgba(255,255,255,0.04)",
      borderRadius: 2,
      fontSize: 13.5,
      color: "grey.200",
      "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
      "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.3)" },
    },
    "& input::placeholder": { color: "grey.600", opacity: 1 },
  },

  searchIcon: {
    fontSize: 18,
    color: "grey.600",
  },

  // ── filter row ────────────────────────────────────────────────────────────
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    mb: 2.5,
    flexWrap: "wrap",
  },

  filterChip: (isActive) => ({
    fontSize: 12.5,
    fontWeight: isActive ? 600 : 400,
    height: 30,
    cursor: "pointer",
    bgcolor: isActive ? "rgba(99,102,241,0.25)" : "rgba(255,255,255,0.05)",
    color: isActive ? "#a5b4fc" : "grey.400",
    border: "1px solid",
    borderColor: isActive ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.09)" },
  }),

  sortButton: {
    ml: "auto",
    color: "grey.400",
    textTransform: "none",
    fontSize: 12.5,
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 2,
    px: 1.5,
    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
  },

  sortIcon: { fontSize: 15 },

  // ── states ────────────────────────────────────────────────────────────────
  loadingBox: {
    display: "flex",
    justifyContent: "center",
    pt: 6,
  },

  loadingSpinner: { color: "grey.500" },

  errorAlert: { bgcolor: "#2d1515", color: "#f87171" },

  emptyBox: { textAlign: "center", pt: 6, color: "grey.600" },

  emptyText: { fontSize: 14 },

  // ── sections ──────────────────────────────────────────────────────────────
  sectionBox: { mb: 1.5 },

  sectionLabel: (isOverdue) => ({
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: isOverdue ? "#f87171" : "grey.600",
    mb: 0.75,
    mt: 0.5,
  }),

  divider: { borderColor: "rgba(255,255,255,0.05)", mt: 1 },

  // ── task row ──────────────────────────────────────────────────────────────
  taskRow: (isOverdue) => ({
    display: "flex",
    alignItems: "center",
    gap: 1,
    px: 1.5,
    py: 1,
    borderRadius: 2,
    border: "1px solid",
    borderColor: isOverdue ? "#5c2020" : "rgba(255,255,255,0.06)",
    bgcolor: isOverdue ? "rgba(93,32,32,0.15)" : "rgba(255,255,255,0.02)",
    mb: 0.75,
    transition: "border-color 0.15s, background 0.15s",
    "&:hover": {
      borderColor: isOverdue ? "#7a2e2e" : "rgba(255,255,255,0.14)",
      bgcolor: isOverdue ? "rgba(93,32,32,0.22)" : "rgba(255,255,255,0.04)",
      "& .action-btns": { opacity: 1 },
    },
  }),

  checkbox: { p: 0.5 },

  checkboxIcon: { fontSize: 18, color: "grey.600" },

  checkboxCheckedIcon: { fontSize: 18, color: "#4ade80" },

  taskTitle: (isCompleted) => ({
    fontSize: 13.5,
    fontWeight: 500,
    color: isCompleted ? "grey.600" : "grey.100",
    textDecoration: isCompleted ? "line-through" : "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }),

  taskMeta: {
    display: "flex",
    alignItems: "center",
    gap: 0.8,
    mt: 0.4,
    flexWrap: "wrap",
  },

  priorityChip: (sx) => ({
    ...sx,
    fontSize: 11,
    height: 20,
    borderRadius: 1,
  }),

  // ── due date ──────────────────────────────────────────────────────────────
  dueDateBox: {
    display: "flex",
    alignItems: "center",
    gap: 0.4,
    color: "grey.500",
  },

  dueDateIcon: { fontSize: 12 },

  dueDateText: { fontSize: 11 },

  overdueChip: {
    bgcolor: "#3d1a1a",
    color: "#f87171",
    fontWeight: 600,
    fontSize: 11,
    height: 22,
    "& .MuiChip-icon": { color: "#f87171", ml: "6px" },
  },

  overdueIcon: { fontSize: 13 },

  // ── action buttons ────────────────────────────────────────────────────────
  actionBox: {
    display: "flex",
    gap: 0.5,
    transition: "opacity 0.15s",
    flexShrink: 0,
  },

  editBtn: {
    color: "grey.500",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 1.5,
    width: 30,
    height: 30,
    "&:hover": { color: "grey.200", borderColor: "rgba(255,255,255,0.2)" },
  },

  deleteBtn: {
    color: "grey.500",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 1.5,
    width: 30,
    height: 30,
    "&:hover": { color: "#f87171", borderColor: "#5c2020" },
  },

  actionIcon: { fontSize: 18 },

  // ── snackbar ──────────────────────────────────────────────────────────────
  snackbarAlert: { fontSize: 13 },
};