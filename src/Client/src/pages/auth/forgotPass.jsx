import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet, HelmetProvider } from "react-helmet-async";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import { forgotPassword } from "../../../../services/Api_url";

import "./auth.css";

const ForgotPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailSent, setEmailSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      setSubmitError("");
    } catch (error) {
      setEmailSent(false);
      setSubmitError(error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HelmetProvider>
      <>
        <Helmet>
          <title>Forgot</title>
          <meta
            name="description"
            content="This is the forgot page of our music app."
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
                    Enter your email address or username, and we'll send you a
                    link to regain access to your account.
                  </p>
                  {emailSent && (
                    <p className="text-green-500 mb-4">
                      A recovery link has been sent to your email!
                    </p>
                  )}

                  {!emailSent && submitError && (
                    <p className="text-red-500 mb-4">{submitError}</p>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative mb-4">
                      <TextField
                        label="Email or Username"
                        variant="outlined"
                        fullWidth
                        multiline
                        InputLabelProps={{
                          style: { color: "white" },
                        }}
                        InputProps={{
                          style: { color: "white" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white", // Viền trắng mặc định
                            },
                            "&:hover fieldset": {
                              borderColor: "white", // Viền trắng khi hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#09A6EF",
                            },
                          },
                          "& .MuiFormHelperText-root": {
                            color: "white", // Màu chữ helper text
                          },
                        }}
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email address",
                          },
                        })}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    </div>
                    <button
                      className="w-full py-2 px-4 bg-sky-500 font-bold text-white rounded-md shadow-md transform transition-transform duration-300 hover:ring-2 hover:ring-white"
                      type="submit"
                      disabled={loading} // Disable nút khi đang gửi
                    >
                      {loading ? "Sending..." : "Send"}
                      {!loading && <SendIcon className="ml-2" />}
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
