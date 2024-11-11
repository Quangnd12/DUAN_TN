import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { useForgotPasswordMutation } from "../../../../redux/slice/apiSlice";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const ForgotPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailSent, setEmailSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const result = await forgotPassword(data.email).unwrap();
      if (result.success) {
        setEmailSent(true);
        setSubmitError("");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      setEmailSent(false);
      setSubmitError(
        error.data?.message || 
        "An error occurred while sending the reset link. Please try again."
      );
    }
  };

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Forgot Password</title>
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
                    Forgot password
                  </h3>
                  <p className="text-gray-500 font-semibold mx-3 text-sm mb-4">
                    Enter your email address, and we'll send you a link to reset your password.
                  </p>
                  
                  {emailSent && (
                    <div className="text-green-500 mb-4">
                      <p>Password reset link has been sent to your email!</p>
                      <p className="text-sm">Redirecting to login page...</p>
                    </div>
                  )}

                  {submitError && (
                    <p className="text-red-500 mb-4">{submitError}</p>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative mb-4">
                      <TextField
                        label="Email"
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
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address",
                          },
                        })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    </div>
                    <button
                      className="w-full py-2 px-4 bg-sky-500 font-bold text-white rounded-md shadow-md transform transition-transform duration-300 hover:ring-2 hover:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                      {!isLoading && <SendIcon className="ml-2" />}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    </HelmetProvider>
  );
};

export default ForgotPass;