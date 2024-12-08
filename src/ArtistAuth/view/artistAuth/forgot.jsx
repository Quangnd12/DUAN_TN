import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Alert, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { sendPasswordResetEmail } from "../../../redux/slice/artistAuthSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onChange"
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      await dispatch(sendPasswordResetEmail(data.email)).unwrap();
      setSuccessMessage("Password reset email sent successfully! Please check your inbox.");
      reset();
    } catch (error) {
      let errorMsg = "Failed to send reset email. Please try again.";
      if (error.message && error.message.includes("không tồn tại")) {
        errorMsg = "Email address not found in our system.";
      } else if (error.message && error.message.includes("không hợp lệ")) {
        errorMsg = "Please enter a valid email address.";
      }
      setErrorMessage(errorMsg);
      console.error("Error sending password reset email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black/30 backdrop-blur-lg shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl text-white mb-6">Forgot Password</h2>

        {successMessage && (
          <Alert 
            severity="success" 
            className="mb-4"
            sx={{
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: '#4caf50',
              '& .MuiAlert-icon': {
                color: '#4caf50'
              }
            }}
          >
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert 
            severity="error" 
            className="mb-4"
            sx={{
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff5252',
              '& .MuiAlert-icon': {
                color: '#ff5252'
              }
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#9c27b0' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                  '& .MuiOutlinedInput-input': { color: 'white' },
                  '& .MuiFormHelperText-root': { color: '#ff5252' },
                }}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            disabled={loading}
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
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Email'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
