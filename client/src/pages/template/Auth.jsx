import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";

import {
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  LoginOutlined,
  PersonAddOutlined,
  ShieldOutlined,
} from "@mui/icons-material";

import { authStyles as s } from "../style/AuthStyle.js";
import { login, register } from "../logic/Auth.js";

function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const result = await login(
      form.username,
      form.password
    );

    setLoading(false);

    if (!result?.success) {
      setAlert({
        type: "error",
        message: result?.message || "Something went wrong",
      });
    }
  };

  return (
    <Box>
      {alert && (
        <Alert severity={alert.type} sx={s.alert} variant="filled">
          {alert.message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Username"
        value={form.username}
        onChange={handleChange("username")}
        sx={s.textField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange("password")}
        sx={s.textField}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock />
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePassword}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={s.submitBtn}
        startIcon={
          loading ? (
            <CircularProgress size={16} />
          ) : (
            <LoginOutlined />
          )
        }
      >
        {loading ? "Signing in..." : "Login"}
      </Button>

      <Divider sx={s.divider}>or</Divider>

      <Box sx={s.footerText}>
        Don't have an account?
        <Box component="span" onClick={onSwitch}>
          Sign up now
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Register Form
// ─────────────────────────────────────────────────────────────

function RegisterForm({ onSwitch }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  const handleChange = (field) => (e) => {
    setForm({
      ...form,
      [field]: e.target.value,
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  const handleSubmit = async () => {
    setLoading(true);

    const result = await register(
      form.username,
      form.email,
      form.password,
      form.confirmPassword
    );

    setLoading(false);

    if (!result?.success) {
      setAlert({
        type: "error",
        message: result?.message || "Something went wrong",
      });
    } else {
      setAlert({
        type: "success",
        message: "Đăng ký thành công",
      });
    }
  };

  return (
    <Box>
      {alert && (
        <Alert severity={alert.type} sx={s.alert} variant="filled">
          {alert.message}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Username"
        value={form.username}
        onChange={handleChange("username")}
        sx={s.textField}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange("email")}
        sx={s.textField}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={handleChange("password")}
        sx={s.textField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePassword}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        value={form.confirmPassword}
        onChange={handleChange("confirmPassword")}
        sx={s.textField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={toggleConfirm}
                edge="end"
                size="small"
              >
                {showConfirm ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        sx={s.submitBtn}
        startIcon={
          loading ? (
            <CircularProgress size={16} />
          ) : (
            <PersonAddOutlined />
          )
        }
      >
        {loading ? "Creating account..." : "Create Account"}
      </Button>

      <Divider sx={s.divider}>or</Divider>

      <Box sx={s.footerText}>
        Don't have an account?
        <Box component="span" onClick={onSwitch}>
          Sign in
        </Box>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function AuthTemplate() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={s.pageWrapper}>
      <Paper elevation={0} sx={s.card}>
        <Box sx={s.logoBox}>
          <ShieldOutlined
            sx={{
              color: "#ddd",
              fontSize: "1.6rem",
            }}
          />
        </Box>

        <Typography variant="h5" sx={s.title}>
          {tab === 0
            ? "Welcome back!"
            : "Create your account"}
        </Typography>

        <Typography sx={s.subtitle}>
          {tab === 0
            ? "Sign in to continue your experience"
            : "Fill in the information below before to get started"}
        </Typography>

        <Box sx={s.tabsRoot}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
        </Box>

        {tab === 0 ? (
          <LoginForm onSwitch={() => setTab(1)} />
        ) : (
          <RegisterForm onSwitch={() => setTab(0)} />
        )}
      </Paper>
    </Box>
  );
}