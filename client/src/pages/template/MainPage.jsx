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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { differenceInCalendarDays, parseISO, isToday, format } from "date-fns";

import { getTodoItems, createTodoItem, deleteTodoItem } from "../logic/MainPage.js";
import { styles, FILTERS, SORT_OPTIONS, SECTION_ORDER, SECTION_LABELS, PRIORITY_CONFIG } from "../style/MainPageStyle.js";

// ── helpers ────────────────────────────────────────────────────────────────
const toDate = (d) => (typeof d === "string" ? parseISO(d) : d);

const isOverdue = (item) => {
  if (!item.dueDate || item.status==="Completed") return false;
  return differenceInCalendarDays(toDate(item.dueDate), new Date()) < 0;
};

const isDueToday = (item) => {
  if (!item.dueDate || item.status==="Completed") return false;
  return isToday(toDate(item.dueDate));
};

// ── component ──────────────────────────────────────────────────────────────
export default function MainPage({ onAddNew, onEdit }) {
  const [todoItems, setTodoItems]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortIndex, setSortIndex]       = useState(0);
  const [snackbar, setSnackbar]         = useState({ open: false, message: "", severity: "success" });

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
  }, []);

  // ── counts ───────────────────────────────────────────────────────────────
  
 const counts = useMemo(() => ({
  all: todoItems.length,

  doing: todoItems.filter(
    (t) => t.status === "InProgress"
  ).length,

  done: todoItems.filter(
    (t) => t.status === "Completed"
  ).length,

  overdue: todoItems.filter(isOverdue).length,
}), [todoItems]);

  // ── filtered + sorted ────────────────────────────────────────────────────
const filtered = useMemo(() => {
  let list = todoItems.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  if (activeFilter === "doing") {
    list = list.filter(
      (t) => t.status === "InProgress"
    );
  }

  if (activeFilter === "done") {
    list = list.filter(
      (t) => t.status === "Completed"
    );
  }

  if (activeFilter === "overdue") {
    list = list.filter(isOverdue);
  }

  if (sortIndex === 1) {
    list = [...list].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return toDate(a.dueDate) - toDate(b.dueDate);
    });
  }

  if (sortIndex === 2) {
    const order = {
      High: 0,
      Medium: 1,
      Low: 2,
    };

    list = [...list].sort(
      (a, b) =>
        (order[a.priority] ?? 1) -
        (order[b.priority] ?? 1)
    );
  }

  return list;
}, [todoItems, search, activeFilter, sortIndex]);

  // ── grouped sections ─────────────────────────────────────────────────────
  const sections = useMemo(() => {
    const groups = { today: [], overdue: [], upcoming: [], done: [] };
   filtered.forEach((t) => {
  if (t.status === "Completed")
    groups.done.push(t);

  else if (isOverdue(t))
    groups.overdue.push(t);

  else if (isDueToday(t))
    groups.today.push(t);

  else
    groups.upcoming.push(t);
});
    return groups;
  }, [filtered]);

  // ── handlers ─────────────────────────────────────────────────────────────
  // const handleToggle = async (id, isCompleted) => {
  //   setTodoItems((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted } : t)));
  //   const result = await toggleTodoComplete(id, isCompleted);
  //   if (!result.success) {
  //     setTodoItems((prev) => prev.map((t) => (t.id === id ? { ...t, isCompleted: !isCompleted } : t)));
  //     showSnackbar("Cập nhật thất bại", "error");
  //   }
  // };

  const handleCreateItem = async (title, description, dueDate, priority, status) => {
    const result = await createTodoItem(title, description, dueDate, priority, status);
    if (result.success) {
      setTodoItems((prev) => [result.data, ...prev]);
      console.log(result.data);
      showSnackbar("Thêm công việc thành công");
    } else {
      showSnackbar(result.message || "Thêm công việc thất bại", "error");
    }
  };

 const handleDeleteConfirm = async (item) => {
  const result = await deleteTodoItem(item.id);

  if (result.success) {
    setTodoItems((prev) => prev.filter((t) => t.id !== item.id));
    showSnackbar("Đã xóa công việc");
  } else {
    showSnackbar("Xóa thất bại", "error");
  }
};

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const cycleSort = () =>
    setSortIndex((prev) => (prev + 1) % SORT_OPTIONS.length);

  // ── render 1 dòng task ────────────────────────────────────────────────────
  const renderTask = (item) => {
    const priority = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.Medium;
    const overdue = isOverdue(item);

    const renderDueDate = () => {
      if (!item.dueDate) return null;
      const date = toDate(item.dueDate);
      const diffDays = differenceInCalendarDays(date, new Date());
      if (item.status!=="Completed" && diffDays < 0) {
        return (
          <Chip
            icon={<ErrorOutlineIcon sx={styles.overdueIcon} />}
            label={`Quá hạn ${Math.abs(diffDays)} ngày`}
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
          <Typography variant="body2" sx={styles.taskTitle(item.status==="Completed")}>
            {item.title}
          </Typography>
          <Box sx={styles.taskMeta}>
            <Chip
              label={priority.label}
              size="small"
              sx={styles.priorityChip(priority.sx)}
            />
            {renderDueDate()}
          </Box>
        </Box>

        <Box className="action-btns" sx={styles.actionBox}>
          <Tooltip title="Sửa">
            <IconButton size="small" onClick={() => onEdit(item)} sx={styles.editBtn}>
              <EditIcon sx={styles.actionIcon} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xóa">
            <IconButton size="small" onClick={() => handleDeleteConfirm(item)} sx= {styles.deleteBtn}>
              <DeleteIcon sx={styles.actionIcon} />
            </IconButton>
          </Tooltip>
        </Box>
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
            Danh sách công việc
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => onAddNew(handleCreateItem)}
            sx={styles.addButton}
          >
            Thêm mới
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Tìm kiếm công việc..."
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
          SECTION_ORDER.map((key) => {
            const items = sections[key];
            if (!items.length) return null;
            return (
              <Box key={key} sx={styles.sectionBox}>
                <Typography variant="caption" sx={styles.sectionLabel(key === "overdue")}>
                  {SECTION_LABELS[key]}
                </Typography>

                {items.map((item) => renderTask(item))}

                <Divider sx={styles.divider} />
              </Box>
            );
          })
        )}
      </Box>

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