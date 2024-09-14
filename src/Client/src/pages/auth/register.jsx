import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import { makeStyles } from "@material-ui/styles";

import "./auth.css";
const useStyles = makeStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#6a6a6a",
        borderWidth: "0.5px",
      },
      "&:hover fieldset": {
        borderColor: "#09A6EF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#09A6EF",
      },
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
  },
});
const Register = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Use useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  // Xem trường mật khẩu để so sánh với mật khẩu xác nhận
  const password = watch("password");

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = (data) => {
    console.log("Form Submitted: ", data);
  };

  return (
    <>
      <Helmet>
        <title>Register</title>
        <meta
          name="description"
          content="This is the register page of our music app."
        />
      </Helmet>
      <section className="h-screen bg-zinc-900 flex items-center justify-center">
        <div className="container py-5 h-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-black shadow-lg rounded-md p-5">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-8 text-white">Sign up</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email Field */}
                  <div className="relative mb-4">
                    <TextField
                      id="outlined-email"
                      label="Email"
                      name="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email format. Only letters, numbers, and periods are allowed.",
                        },
                        validate: (value) => {
                          const forbiddenWords = ["fuckyou", "cunt", "penis", "dick", "fuck"]; // Thay thế bằng các từ ngữ phản cảm thực tế
                          for (let word of forbiddenWords) {
                            if (value.includes(word)) {
                              return "Email contains inappropriate content.";
                            }
                          }
                          return true;
                        }
                      })}
                      
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      multiline
                      placeholder="Email"
                      InputProps={{
                        style: {
                          color: "white",
                        },
                      }}
                      className={`${classes.root} form-input w-full py-2 px-3 rounded-md`}
                    />
                  </div>
                  {/* Password Field */}
                  <div className="relative mb-4">
                    <TextField
                      id="outlined-password"
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        style: { color: "white" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOffIcon style={{ color: "white" }} />
                              ) : (
                                <VisibilityIcon style={{ color: "white" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      className={`${classes.root} form-input w-full py-2 px-3 rounded-md`}
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="relative mb-4">
                    <TextField
                      id="outlined-confirm-password"
                      label="Confirm Password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        style: { color: "white" },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOffIcon style={{ color: "white" }} />
                              ) : (
                                <VisibilityIcon style={{ color: "white" }} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      className={`${classes.root} form-input w-full py-2 px-3 rounded-md`}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full py-2 px-4 bg-sky-500 font-semibold text-white rounded-md shadow-md transform transition-transform duration-300 hover:ring-2 hover:ring-white shake-on-hover"
                    type="submit"
                  >
                    Sign up
                    <LoginIcon className="ml-2" />
                  </button>
                </form>

                {/* Alternative Sign-up options */}
                <div className="flex items-center my-4">
                  <hr className="flex-1 border-t border-gray-300" />
                  <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">
                    OR
                  </p>
                  <hr className="flex-1 border-t border-gray-300" />
                </div>

                <button
                  className="w-full py-2 px-4 bg-black border border-[#6a6a6a]  text-white rounded-3xl shadow-md flex items-center justify-center hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                  type="submit"
                >
                  <GoogleIcon />
                  <span className="flex-1 text-center">
                    Sign up with Google
                  </span>
                </button>
                <button
                  className="w-full py-2 px-4 bg-black border border-[#6a6a6a]  text-white rounded-3xl shadow-md flex items-center justify-center mt-2 hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                  type="submit"
                >
                  <FacebookIcon />
                  <span className="flex-1 text-center">
                    Sign up with Facebook
                  </span>
                </button>

                <div className="text-center mt-8 ">
                  <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="no-underline font-bold text-white hover:text-sky-500">
                      {" "}
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
