import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";

import "./auth.css";

const ForgotPass = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [emailSent, setEmailSent] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onSubmit = (data) => {
    // Giả lập quá trình gửi email khôi phục mật khẩu
    const { email } = data;

    if (email === "test@example.com") {
      // Giả sử email này tồn tại trong hệ thống
      setEmailSent(true);
      setSubmitError("");
    } else {
      // Nếu email không tồn tại, hiển thị lỗi
      setEmailSent(false);
      setSubmitError("This email address is not associated with any account.");
    }
  };

  return (
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
                    className="w-full py-2 px-4 bg-sky-500 font-bold text-white rounded-md shadow-md transform transition-transform duration-300  hover:ring-2 hover:ring-white"
                    type="submit"
                  >
                    Send
                    <SendIcon className="ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPass;
