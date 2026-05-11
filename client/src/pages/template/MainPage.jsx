import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { differenceInCalendarDays, parseISO, format } from "date-fns";
import { getTodoItems, deleteTodoItem, getUserInfo,logout} from "../logic/MainPage.js";
import { useNavigate } from "react-router-dom";
import {
  styles,
  FILTERS,
  SORT_OPTIONS,
  SECTION_LABELS,
  PRIORITY_CONFIG,
} from "../style/MainPageStyle.js";

// ── helpers ────────────────────────────────────────────────────────────────
const toDate = (d) => (typeof d === "string" ? parseISO(d) : d);

const isOverdue = (item) => {
  if (!item.dueDate || item.status === "Completed") return false;
  return differenceInCalendarDays(toDate(item.dueDate), new Date()) < 0;
};

// const isDueToday = (item) => {
//   if (!item.dueDate || item.status === "Completed") return false;
//   return isToday(toDate(item.dueDate));
// };

// ── component ──────────────────────────────────────────────────────────────
export default function MainPage({ onAddNew, onEdit, refreshKey}) {
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortIndex, setSortIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [userInfo, setUserInfo] = useState();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);


  // State cho confirm delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  // ── fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
  const fetchAll = async () => {
      setLoading(true);
      setError(null);
 
      const todoResult = await getTodoItems();
      if (todoResult.success) {
        setTodoItems(todoResult.data);
      } else {
        setError(todoResult.message);
      }
 
      setLoading(false);
 
      // Chỉ fetch userInfo 1 lần khi mount (refreshKey === 0)
      if (refreshKey === 0) {
        const userResult = await getUserInfo();
        if (userResult.success) setUserInfo(userResult.data);
      }
    };
 
    fetchAll();
  }, [refreshKey]);

  const handleLogout = () => {
  logout(); // xóa token khỏi localStorage
  navigate("/");
};

  // ── counts ───────────────────────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      all: todoItems.length,
      pending: todoItems.filter((t) => t.status === "Pending").length, 
      doing: todoItems.filter((t) => t.status === "InProgress").length,
      done: todoItems.filter((t) => t.status === "Completed").length,
      overdue: todoItems.filter(isOverdue).length,
    }),
    [todoItems]
  );

  // ── filtered + sorted ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = todoItems.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

    if (activeFilter === "doing") {
      list = list.filter((t) => t.status === "InProgress");
    } else if (activeFilter === "done") {
      list = list.filter((t) => t.status === "Completed");
    }else if (activeFilter === "pending") {
      list = list.filter((t) => t.status === "Pending"); 
    }else if (activeFilter === "overdue") {
      list = list.filter(isOverdue);
    }

    if (sortIndex === 1) {
      // Sort theo ngày tăng dần — FIX: dùng .getTime()
      list = [...list].sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return toDate(a.dueDate).getTime() - toDate(b.dueDate).getTime();
      });
    } else if (sortIndex === 2) {
      const order = { High: 0, Medium: 1, Low: 2 };
      list = [...list].sort(
        (a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
      );
    }

    return list;
  }, [todoItems, search, activeFilter, sortIndex]);

  // ── grouped sections ─────────────────────────────────────────────────────
  const sections = useMemo(() => {
    const groups = { today: [], overdue: [],pending: [], noDate: [], done: [],doing: [] };

     filtered.forEach((t) => {
    if (t.status === "Completed") {
      groups.done.push(t);
    } else if (isOverdue(t)) {
      groups.overdue.push(t);
    } else if (t.status === "InProgress") {
      groups.doing.push(t);
    } else {
      // Pending hoặc bất kỳ status nào còn lại
      groups.pending.push(t);
    }
  });

  return groups;
}, [filtered]);

  // ── delete handlers ───────────────────────────────────────────────────────
  const openDeleteDialog = (item) => setDeleteDialog({ open: true, item });

  const closeDeleteDialog = () => {
    if (deleting) return; // không đóng khi đang xóa
    setDeleteDialog({ open: false, item: null });
  };

  const handleDeleteConfirm = async () => {
    const item = deleteDialog.item;
    if (!item) return;

    setDeleting(true);
    const result = await deleteTodoItem(item.id);
    setDeleting(false);

    if (result.success) {
      setTodoItems((prev) => prev.filter((t) => t.id !== item.id));
      showSnackbar("Deleted successfully");
      setDeleteDialog({ open: false, item: null });
    } else {
      showSnackbar("Delete failed", "error");
    }
  };


  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const cycleSort = () => setSortIndex((prev) => (prev + 1) % SORT_OPTIONS.length);

  // ── render 1 dòng task ────────────────────────────────────────────────────
  const renderTask = (item) => {
    const priority = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.Medium;
    const overdue = isOverdue(item);

    const renderDueDate = () => {
      if (!item.dueDate) return null;
      const date = toDate(item.dueDate);
      const diffDays = differenceInCalendarDays(date, new Date());
      if (item.status !== "Completed" && diffDays < 0) {
        return (
          <Chip
            icon={<ErrorOutlineIcon sx={styles.overdueIcon} />}
            label={`OverDue ${Math.abs(diffDays)} day`}
            size="small"
            sx={styles.overdueChip}
          />
        );
      }
      return (
        <Box sx={styles.dueDateBox}>
          <CalendarTodayIcon sx={styles.dueDateIcon} />
          <Typography variant="caption" sx={styles.dueDateText}>
            {format(date, "dd/MM/yyyy")}
          </Typography>
        </Box>
      );
    };

    return (
      <Box key={item.id} sx={styles.taskRow(overdue)}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" sx={styles.taskTitle(item.status === "Completed")}>
            {item.title}
          </Typography>
          <Box sx={styles.taskMeta}>
            <Chip label={priority.label} size="small" sx={styles.priorityChip(priority.sx)} />
            {renderDueDate()}
          </Box>
          
        </Box>

        <Box className="action-btns" sx={styles.actionBox}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit?.(item)}
              sx={styles.editBtn}
            >
              <EditIcon sx={styles.actionIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => openDeleteDialog(item)}
              sx={styles.deleteBtn}
            >
              <DeleteIcon sx={styles.actionIcon} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  // ── render section ────────────────────────────────────────────────────────
  const renderSection = (key, items, label, isOverdueSection = false) => {
    if (!items.length) return null;
    return (
      <Box key={key} sx={styles.sectionBox}>
        <Typography variant="caption" sx={styles.sectionLabel(isOverdueSection)}>
          {label}
        </Typography>
        {items.map((item) => renderTask(item))}
        <Divider sx={styles.divider} />
      </Box>
    );
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.container}>

<Box sx={styles.header}>
  <Typography variant="h6" sx={styles.headerTitle}>
    To Do List - Classic and Respect
  </Typography>

  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => onAddNew?.()}
      sx={styles.addButton}
    >
      New
    </Button>

    {/* User Info */}
    {userInfo && (userInfo.userName || userInfo.email) && (
  <Box
    sx={{ ...styles.userInfoBox, position: "relative", cursor: "pointer" }}
    onMouseEnter={() => setShowLogout(true)}
    onMouseLeave={() => setShowLogout(false)}
  >
    <Box sx={styles.userAvatar}>
      {(userInfo.userName?.[0] ?? userInfo.email?.[0] ?? "U").toUpperCase()}
    </Box>
    <Box sx={styles.userTextBox}>
      {userInfo.userName && (
        <Typography variant="body2" sx={styles.userName}>
          {userInfo.userName}
        </Typography>
      )}
      {userInfo.email && (
        <Typography variant="caption" sx={styles.userEmail}>
          {userInfo.email}
        </Typography>
      )}
    </Box>

    {/* Logout dropdown */}
    {showLogout && (
      <Box sx={{ position: "absolute", top: "100%", right: 0, pt: "8px" }}>
        <Box onClick={handleLogout} sx={styles.logoutDropdown}>
          Logout
        </Box>
      </Box>
    )}
  </Box>
)}
  </Box>
</Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={styles.searchIcon} />
              </InputAdornment>
            ),
          }}
          sx={styles.searchField}
        />

        {/* Filter chips + Sort */}
        <Box sx={styles.filterRow}>
          {FILTERS.map((f) => (
            <Chip
              key={f.key}
              label={`${f.label} (${counts[f.key]})`}
              onClick={() => setActiveFilter(f.key)}
              sx={styles.filterChip(activeFilter === f.key)}
            />
          ))}
          <Button
            startIcon={<SortIcon sx={styles.sortIcon} />}
            onClick={cycleSort}
            size="small"
            sx={styles.sortButton}
          >
            {SORT_OPTIONS[sortIndex]}
          </Button>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={styles.loadingBox}>
            <CircularProgress size={32} sx={styles.loadingSpinner} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={styles.errorAlert}>
            {error}
          </Alert>
        ) : filtered.length === 0 ? (
          <Box sx={styles.emptyBox}>
            <Typography sx={styles.emptyText}>No tasks found</Typography>
          </Box>
        ) : (
          <>
             {activeFilter === "all" ? (
    <>

      {renderSection(
        "doing",
        sections.doing,
        SECTION_LABELS.doing
      )}

      {renderSection(
        "pending",
        sections.pending,
        SECTION_LABELS.pending
      )}

      {renderSection(
        "done",
        sections.done,
        SECTION_LABELS.done
      )}
      {renderSection(
        "overdue",
        sections.overdue,
        SECTION_LABELS.overdue,
        true
      )}
    </>
  ) : (
    renderSection(
      activeFilter,
      filtered,
      SECTION_LABELS[activeFilter]
    )
  )}
          </>
        )}
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the task{" "}
            <strong>"{deleteDialog.item?.title}"</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={styles.snackbarAlert}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}