import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { createTodoItem, updateTodoItem} from "../logic/TodoForm.js";
import { styles, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../style/TodoFormStyle.js";

// ── Tính initial form từ editItem, không dùng useEffect ───────────────────
const buildInitialForm = (editItem) => {
  if (!editItem) {
    return {
      title:       "",
      description: "",
      dueDate:     "",
      dueTime:     "",
      priority:    "Low",
      status:      "Pending",
    };
  }
  return {
    title:       editItem.title       ?? "",
    description: editItem.description ?? "",
    dueDate:     editItem.dueDate ? editItem.dueDate.slice(0, 10) : "",
    dueTime:     editItem.dueDate ? editItem.dueDate.slice(11, 16) : "",
    priority:    editItem.priority ?? "Low",
    status:      editItem.status   ?? "Pending",
  };
};

// ── component ──────────────────────────────────────────────────────────────
export default function TodoForm({ open, onClose, editItem, onCreated, onUpdated }) {
  const isEditMode = !!editItem;

  // key={editItem?.id ?? "new"} ở Dialog đảm bảo component unmount/remount
  // mỗi khi đổi giữa thêm mới và sửa → useState tự reset
  const [form, setForm]       = useState(() => buildInitialForm(editItem));
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Tiêu đề không được để trống";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);

    const dueDateISO = form.dueDate
      ? new Date(`${form.dueDate}T${form.dueTime || "00:00"}:00`).toISOString()
      : null;

    const { title, description, priority, status } = form;

    if (isEditMode) {
      const result = await updateTodoItem(
        editItem.id,
        title.trim(),
        description.trim(),
        dueDateISO,
        priority,
        status
      );
      if (result.success) {
        onUpdated?.({ ...editItem, title, description, dueDate: dueDateISO, priority, status });
         
        onClose();
      } else {
        setErrors({ submit: result.message });
      }
    } else {
      const result = await createTodoItem(
        title.trim(),
        description.trim(),
        dueDateISO,
        priority,
        status
      );
      if (result.success) {
        onCreated?.(result.data);
        
        onClose();
      } else {
        setErrors({ submit: result.message });
      }
    }

    setLoading(false);
  };

  return (
    // key thay đổi → Dialog unmount rồi remount → useState chạy lại buildInitialForm
    <Dialog open={open} onClose={onClose} sx={styles.dialog}>

      {/* Header */}
<Box sx={styles.dialogTitle}>
  <Typography sx={styles.titleText}>
    {isEditMode ? "Edit Task" : "Add Task"}
  </Typography>
  <IconButton size="small" onClick={onClose} sx={styles.closeBtn}>
    <CloseIcon sx={styles.closeIcon} />
  </IconButton>
</Box>

{/* Body */}
<Box sx={styles.dialogContent}>

  {/* Title */}
  <Box>
    <Typography sx={styles.fieldLabel}>
      Title
      <Typography component="span" sx={styles.requiredStar}>*</Typography>
    </Typography>
    <TextField
      fullWidth
      size="small"
      placeholder="Add task title"
      value={form.title}
      onChange={(e) => setField("title", e.target.value)}
      error={!!errors.title}
      sx={styles.textField}
    />
    {errors.title && (
      <Box sx={styles.errorText}>
        <ErrorOutlineIcon sx={styles.errorIcon} />
        {errors.title}
      </Box>
    )}
  </Box>

  {/* Description */}
  <Box>
    <Typography sx={styles.fieldLabel}>Description</Typography>
    <TextField
      fullWidth
      multiline
      rows={3}
      size="small"
      placeholder="Add optional notes..."
      value={form.description}
      onChange={(e) => setField("description", e.target.value)}
      sx={styles.textField}
    />
  </Box>

  {/* Date + Time */}
  <Box sx={styles.twoCol}>
    <Box>
      <Typography sx={styles.fieldLabel}>Due Date</Typography>
      <TextField
        fullWidth
        size="small"
        type="date"
        value={form.dueDate}
        onChange={(e) => setField("dueDate", e.target.value)}
        InputProps={{
          startAdornment: (
            <CalendarTodayIcon sx={{ fontSize: 14, color: "grey.600", mr: 0.75 }} />
          ),
        }}
        sx={styles.textField}
      />
    </Box>

    <Box>
      <Typography sx={styles.fieldLabel}>Due Time</Typography>
      <TextField
        fullWidth
        size="small"
        type="time"
        value={form.dueTime}
        onChange={(e) => setField("dueTime", e.target.value)}
        InputProps={{
          startAdornment: (
            <AccessTimeIcon sx={{ fontSize: 14, color: "grey.600", mr: 0.75 }} />
          ),
        }}
        sx={styles.textField}
      />
    </Box>
  </Box>

  {/* Priority */}
  <Box>
    <Typography sx={styles.fieldLabel}>Priority</Typography>
    <Box sx={styles.priorityGroup}>
      {PRIORITY_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          onClick={() => setField("priority", opt.value)}
          sx={styles.priorityBtn(form.priority === opt.value, opt.value)}
        >
          {opt.label}
        </Button>
      ))}
    </Box>
  </Box>

  {/* Status */}
  <Box>
    <Typography sx={styles.fieldLabel}>Status</Typography>
    <Select
      fullWidth
      size="small"
      value={form.status}
      onChange={(e) => setField("status", e.target.value)}
      sx={styles.select}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: "#1e1c24",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        },
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <MenuItem key={opt.value} value={opt.value} sx={styles.menuItem}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </Box>

  {/* Submit Error */}
  {errors.submit && (
    <Box sx={styles.errorText}>
      <ErrorOutlineIcon sx={styles.errorIcon} />
      {errors.submit}
    </Box>
  )}
</Box>

{/* Footer */}
<Box sx={styles.dialogFooter}>
  <Button variant="outlined" onClick={onClose} sx={styles.cancelBtn}>
    Cancel
  </Button>

  <Button
    variant="contained"
    onClick={handleSubmit}
    disabled={loading}
    sx={styles.submitBtn}
    startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
  >
    {loading ? "Saving..." : "Save Task"}
  </Button>
</Box>
    </Dialog>
  );
}