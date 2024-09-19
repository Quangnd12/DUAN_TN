import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import { makeStyles } from "@material-ui/styles";

import "./auth.css";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
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
    "& .MuiSvgIcon-root": {
      fontSize: 28,
      color: "white", // Màu biểu tượng
    },
  },
});

const Login = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);

  // Use useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = (data) => {
    console.log("Form Submitted: ", data);
  };

  return (
    <HelmetProvider>
    <>
      <Helmet>
        <title>Login</title>
        <meta
          name="description"
          content="This is the login page of our music app."
        />
      </Helmet>
      <section className="h-screen bg-zinc-900 flex items-center justify-center">
        <div className="w-full max-w-md py-5 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-black shadow-lg rounded-md p-5">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-8 text-white">Sign in</h3>
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
                          message: "Invalid email format.",
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
                          message:
                            "Password must be at least 6 characters long",
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

                  {/* Remember me */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Checkbox
                        {...label}
                        defaultChecked
                        className={classes.root}
                        sx={{
                          borderRadius: "4px", // Bo góc cho checkbox
                          padding: "2px", // Thêm khoảng cách để viền rõ hơn
                        }}
                      />
                      <span className="ml-2 text-white text-sm">
                        Remember me
                      </span>
                    </div>
                    <Link
                      to="/forgot"
                      className="text-white hover:text-sky-500"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    className="w-full py-2 px-4 bg-sky-500 font-semibold text-white rounded-md shadow-md transform transition-transform duration-300 hover:ring-2 hover:ring-white"
                    type="submit"
                  >
                    Log in
                    <LoginIcon className="ml-2" />
                  </button>
                </form>
                <div className="flex items-center my-4">
                  <hr className="flex-1 border-t border-gray-300" />
                  <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">
                    OR
                  </p>
                  <hr className="flex-1 border-t border-gray-300" />
                </div>

                <button
                  className="w-full py-2 px-4 bg-black border border-[#6a6a6a] text-white rounded-3xl shadow-md flex items-center justify-center hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                  type="submit"
                >
                 <img className="w-5 h-5" src={`/images/logo/Google.png`} alt="Google Logo" />
                  <span className="flex-1 text-center">
                    Sign in with Google
                  </span>
                </button>
                <button
                  className="w-full py-2 px-4 bg-black border border-[#6a6a6a] text-white rounded-3xl shadow-md flex items-center justify-center mt-2 hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                  type="submit"
                >
                   <img className="w-5 h-5" src={`/images/logo/Facebook.png`} alt="Facebook Logo" />
                  <span className="flex-1 text-center">
                    Sign in with Facebook
                  </span>
                </button>

                <div className="text-center mt-8">
                  <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">
                    Don't you have an account?{" "}
                    <Link
                      to="/register"
                      className="text-white font-bold hover:text-sky-500"
                    >
                      {" "}
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
    </HelmetProvider>
  );
};

export default Login;
