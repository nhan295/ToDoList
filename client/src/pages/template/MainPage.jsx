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
import { differenceInCalendarDays, parseISO, isToday, format } from "date-fns";
import { getTodoItems, deleteTodoItem } from "../logic/MainPage.js";
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

const isDueToday = (item) => {
  if (!item.dueDate || item.status === "Completed") return false;
  return isToday(toDate(item.dueDate));
};

// ── component ──────────────────────────────────────────────────────────────
export default function MainPage({ onAddNew, onEdit, refreshKey }) {
  const [todoItems, setTodoItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortIndex, setSortIndex] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // State cho confirm delete dialog
  const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
  const [deleting, setDeleting] = useState(false);

  // ── fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTodoItems = async () => {
      setLoading(true);
      setError(null);
      const result = await getTodoItems();
      if (result.success) {
        setTodoItems(result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };
    fetchTodoItems();
  }, [refreshKey]); // re-fetch khi refreshKey thay đổi

  // ── counts ───────────────────────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      all: todoItems.length,
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
    } else if (activeFilter === "overdue") {
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
    const groups = { today: [], overdue: [], upcoming: [], noDate: [], done: [] };

    filtered.forEach((t) => {
      if (t.status === "Completed") {
        groups.done.push(t);
      } else if (isOverdue(t)) {
        groups.overdue.push(t);
      } else if (isDueToday(t)) {
        groups.today.push(t);
      } else if (!t.dueDate) {
        // FIX: tách riêng task không có dueDate thay vì gộp vào "Sắp tới"
        groups.noDate.push(t);
      } else {
        groups.upcoming.push(t);
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

        {/* Header */}
        <Box sx={styles.header}>
          <Typography variant="h6" sx={styles.headerTitle}>
            To Do List - Classic and Respect 
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => onAddNew?.()}
            sx={styles.addButton}
          >
            New
          </Button>
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
            <Typography sx={styles.emptyText}>Không có công việc nào</Typography>
          </Box>
        ) : (
          <>
            {renderSection("overdue", sections.overdue, SECTION_LABELS.overdue, true)}
            {renderSection("today", sections.today, SECTION_LABELS.today)}
            {renderSection("upcoming", sections.upcoming, SECTION_LABELS.upcoming)}
            {renderSection("noDate", sections.noDate, "Chưa có hạn")}
            {renderSection("done", sections.done, SECTION_LABELS.done)}
          </>
        )}
      </Box>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa công việc{" "}
            <strong>"{deleteDialog.item?.title}"</strong> không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={deleting}>
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {deleting ? "Đang xóa..." : "Xóa"}
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