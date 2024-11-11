import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import LockResetIcon from "@mui/icons-material/LockReset";
import TextField from "@mui/material/TextField";
import { useResetPasswordMutation } from "../../../../redux/slice/apiSlice";

const ResetPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [resetSuccess, setResetSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Validate token presence
  useEffect(() => {
    if (!token) {
      setSubmitError("Invalid reset link");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [token, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await resetPassword({
        token,
        newPassword: data.password
      }).unwrap();

      if (result.success) {
        setResetSuccess(true);
        setSubmitError("");
        // Redirect to login after success message
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      setResetSuccess(false);
      setSubmitError(
        error.data?.message || 
        "An error occurred while resetting your password. Please try again."
      );
    }
  };

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Reset Password</title>
          <meta
            name="description"
            content="Reset your password for our music app."
          />
        </Helmet>
        <section className="h-screen bg-zinc-900 flex items-center justify-center">
          <div className="container py-5 h-full flex items-center justify-center">
            <div className="w-full max-w-md">
              <div className="bg-black shadow-lg rounded-md p-5">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Reset Password
                  </h3>
                  {resetSuccess ? (
                    <div className="text-green-500 mb-4">
                      <p>Your password has been reset successfully!</p>
                      <p className="text-sm">Redirecting to login page...</p>
                    </div>
                  ) : (
                    <>
                      {submitError && (
                        <p className="text-red-500 mb-4">{submitError}</p>
                      )}
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="relative mb-4">
                          <TextField
                            label="New Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              style: { color: "white" },
                            }}
                            InputProps={{
                              style: { color: "white" },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "white",
                                },
                                "&:hover fieldset": {
                                  borderColor: "white",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#09A6EF",
                                },
                              },
                              "& .MuiFormHelperText-root": {
                                color: "white",
                              },
                            }}
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters long",
                              },
                            })}
                            error={!!errors.password}
                            helperText={errors.password ? errors.password.message : ""}
                          />
                        </div>
                        <div className="relative mb-4">
                          <TextField
                            label="Confirm Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                              style: { color: "white" },
                            }}
                            InputProps={{
                              style: { color: "white" },
                            }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "white",
                                },
                                "&:hover fieldset": {
                                  borderColor: "white",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#09A6EF",
                                },
                              },
                              "& .MuiFormHelperText-root": {
                                color: "white",
                              },
                            }}
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === watch("password") || "Passwords do not match",
                            })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
                          />
                        </div>
                        <button
                          className="w-full py-2 px-4 bg-sky-500 font-bold text-white rounded-md shadow-md transform transition-transform duration-300 hover:ring-2 hover:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Resetting..." : "Reset Password"}
                          {!isLoading && <LockResetIcon className="ml-2" />}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </HelmetProvider>
  );
};

export default ResetPass;