import { useState } from "react";
import {useForm} from "react-hook-form";
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
  
} from "@mui/icons-material";

import { authStyles as s } from "../style/AuthStyle.js";
import { login, signup } from "../logic/Auth.js";


function LoginForm({ onSwitch }) {

  const [showPassword, setShowPassword] = useState(false);


  const [alert, setAlert] = useState(null);

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting}
  }=useForm({defaultValues: {username:"",password:""}})


  const onSubmit = async (form) => {
    setAlert(null)
    const result = await login(
      form.username,
      form.password
    );


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
        error={!!errors.username}
        sx={s.textField}
        helperText={errors.username?.message}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Person />
            </InputAdornment>
          ),
        }}
        {...register("username",{ required: "Username cannot be empty"})}
      />

      

    {/* password */}
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        error={!!errors.email}
        helperText={errors.password?.message}
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
                onClick={()=>setShowPassword((p)=>!p)} edge="end" size="small">
                {showPassword ? (
                  <VisibilityOff fontSize="small" />
                ) : (
                  <Visibility fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...register("password",{required:"Password cannot be empty"})}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        sx={s.submitBtn}
        startIcon={
          isSubmitting ? (
            <CircularProgress size={16} />
          ) : (
            <LoginOutlined />
          )
        }
      >
        {isSubmitting ? "Loging in..." : "Login"}
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


// Register Form

function RegisterForm({ onSwitch }) {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [alert, setAlert] = useState(null);

  const{
    register,
    watch,
    handleSubmit,
    formState:{errors, isSubmitting}
  } = useForm({defaultValues:{username:"",email:"",password:"",confirmPassword:""}})

  const password = watch("password");

  const onSubmit = async (form) => {
    setAlert(null)

    const result = await signup(
      form.username,
      form.email,
      form.password,
      form.confirmPassword
    );

    if (!result?.success) {
      setAlert({
        type: "error",
        message: result?.message || "Something went wrong",
      });
    } else {
      setAlert({
        type: "success",
        message: "Account created successfully! You can now log in.",
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
        sx={s.textField}
        helperText={errors.username?.message}
        {...register("username",{required:"Username cannot be empty"})}
      />

      <TextField
        fullWidth
        label="Email"
        type="email"
        sx={s.textField}
        helperText={errors.email?.message}
        {...register("email",{
          required:"Email cannot be empty",
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không hợp lệ"}
        })}
      />

      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        error={!!errors.password}
        helperText={errors.password?.message}
        sx={s.textField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={() => setShowPassword((p) => !p)}
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
         {...register("password", {
          required: "Password cannot be empty",
          minLength: { value: 8, message: "Password must be at least 8 characters" },
        })}
          
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        helperText={errors.confirmPassword?.message}
        sx={s.textField}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowConfirm((p) => !p)}
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
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) => value === password || "Password does not match",
        })}
      />

      <Button
        fullWidth
        variant="contained"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        sx={s.submitBtn}
        startIcon={
          isSubmitting ? (
            <CircularProgress size={16} />
          ) : (
            <PersonAddOutlined />
          )
        }
      >
        {isSubmitting? "Creating account..." : "Create Account"}
      </Button>

      <Divider sx={s.divider}>or</Divider>

      <Box sx={s.footerText}>
        Don't have an account?
        <Box component="span" onClick={onSwitch}>
          Log In
        </Box>
      </Box>
    </Box>
  );
}


// Main Page

export default function AuthTemplate() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={s.pageWrapper}>
      <Paper elevation={0} sx={s.card}>

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