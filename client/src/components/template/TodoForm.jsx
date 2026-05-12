import { useState,useEffect } from "react";
import {Controller, useForm} from 'react-hook-form';
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

//component 
export default function TodoForm({ open, onClose, editItem, onCreated, onUpdated }) {
  const isEditMode = !!editItem;

  const{
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: {errors},
  } = useForm({ defaultValues:  buildInitialForm(editItem)});

  const[loading,setLoading] = useState(false);
  useEffect(()=>{
    reset( buildInitialForm(editItem))
  },[editItem,reset]);

  
  const onSubmit = async (form) => {
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
        setError({ submit: result.message });
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
        setError({ submit: result.message });
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
        error={!!errors.title}
        sx={styles.textField}
        {...register("title",{required:"Tieu de khong duoc bo trong"})}
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
      sx={styles.textField}
      {...register("description")}
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
        InputProps={{
          startAdornment: (
            <CalendarTodayIcon sx={{ fontSize: 14, color: "grey.600", mr: 0.75 }} />
          ),
        }}
        sx={styles.textField}
        {...register("dueDate")}
      />
    </Box>

    <Box>
      <Typography sx={styles.fieldLabel}>Due Time</Typography>
      <TextField
        fullWidth
        size="small"
        type="time"
        InputProps={{
          startAdornment: (
            <AccessTimeIcon sx={{ fontSize: 14, color: "grey.600", mr: 0.75 }} />
          ),
        }}
        sx={styles.textField}
        {...register("dueTime")}
      />
    </Box>
  </Box>

  {/* Priority */}
  <Box>
    <Typography sx={styles.fieldLabel}>Priority</Typography>
    <Controller
    name="priority"
    control={control}
    render={({field})=>(
      <Box sx={styles.priorityGroup}>
        {PRIORITY_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            onClick={() => field.onChange(opt.value)}
            sx={styles.priorityBtn(field.value === opt.value, opt.value)}
          >
            {opt.label}
          </Button>
      ))}
    </Box>
  )}
    />
  </Box>

  {/* Status */}
  <Box>
    <Typography sx={styles.fieldLabel}>Status</Typography>
    <Controller
    name="status"
    control={control}
    render={({ field }) => (
              <Select
                {...field}
                fullWidth
                size="small"
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
  )}
  />
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
    onClick={handleSubmit(onSubmit)}
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