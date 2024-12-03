import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../../redux/slice/artistAuthSlice";
import {
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams(); // Lấy token từ URL
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = watch("password");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(
        resetPassword({
          token,
          password: data.password,
        })
      ).unwrap();

      setResetSuccess(true);
      setTimeout(() => {
        navigate("/artist-portal/auth"); // Chuyển về trang đăng nhập sau 2 giây
      }, 2000);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl text-white mb-6">Reset Password</h2>

        {resetSuccess && (
          <Alert
            severity="success"
            className="mb-4"
            sx={{
              backgroundColor: "rgba(46, 125, 50, 0.1)",
              color: "#4caf50",
              "& .MuiAlert-icon": {
                color: "#4caf50",
              },
            }}
          >
            Password reset successful! Redirecting to login...
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        className="text-white"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiOutlinedInput-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "#ff5252" },
                }}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                        className="text-white"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
                  },
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiOutlinedInput-input": { color: "white" },
                  "& .MuiFormHelperText-root": { color: "#ff5252" },
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            sx={{
                background: 'linear-gradient(to right, #9333EA, #4F46E5)',
                marginTop: '16px',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                '&:hover': {
                  background: 'linear-gradient(to right, #7E22CE, #4338CA)',
                  transform: 'scale(1.02)',
                },
                transition: 'all 0.3s ease'
              }}
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
