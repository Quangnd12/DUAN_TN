import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { signInWithGoogle } from "../../../../config/firebaseConfig";
import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../../../redux/slice/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../../redux/slice/authSlice";

import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import { InputAdornment, IconButton, CircularProgress  } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import { makeStyles } from "@material-ui/styles";
import { toast } from "react-toastify";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Use useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const onSubmit = async (data) => {
    try {
      const { data: authData } = await login({
        ...data,
        rememberMe,
      });
      dispatch(
        setCredentials({
          token: authData.token,
          user: authData.user,
          role: authData.user.role,
          rememberMe,
        })
      );
      toast.success("Login successful!");
        navigate("/");
        setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error.data?.message || "An error occurred during login");
      toast.error(error.data?.message || "Login failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user: googleUser, token: googleToken } = await signInWithGoogle();

      const result = await googleLogin({ idToken: googleToken }).unwrap();

      // Lưu thông tin user vào Redux store và localStorage
      dispatch(
        setCredentials({
          user: result.user,
          token: result.token,
        })
      );

      toast.success("Sign in to Google successfully!");
        navigate("/");
        setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message || "Sign in to Google failed");
    }
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
                  <h3 className="text-2xl font-bold mb-8 text-white">
                    Sign in
                  </h3>
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="relative mb-4">
                      <TextField
                        id="outlined-email"
                        label="Email"
                        name="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value:
                              /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Invalid email format.",
                          },
                          validate: (value) => {
                            const forbiddenWords = [
                              "fuckyou",
                              "cunt",
                              "penis",
                              "dick",
                              "fuck",
                            ];
                            for (let word of forbiddenWords) {
                              if (value.includes(word)) {
                                return "Email contains inappropriate content.";
                              }
                            }
                            return true;
                          },
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
                        disabled={isLoading}
                      />
                    </div>

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
                                disabled={isLoading}
                              >
                                {showPassword ? (
                                  <VisibilityOffIcon
                                    style={{ color: "white" }}
                                  />
                                ) : (
                                  <VisibilityIcon style={{ color: "white" }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        className={`${classes.root} form-input w-full py-2 px-3 rounded-md`}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Checkbox
                          {...label}
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className={classes.root}
                          sx={{
                            borderRadius: "4px",
                            padding: "2px",
                          }}
                          disabled={isLoading}
                        />
                        <span className="ml-2 text-white text-sm">
                          Remember me
                        </span>
                      </div>
                      <Link
                        to="/forgot"
                        className={`text-white hover:text-sky-500 ${
                          isLoading ? "pointer-events-none opacity-50" : ""
                        }`}
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      className="w-full py-2 px-4 bg-sky-500 font-semibold text-white rounded-md shadow-md transform transition-transform duration-300 hover:ring-2 hover:ring-white"
                      type="submit"
                      disabled={isLoading}
                    >
                     {isLoading ? (
                        <div className="flex items-center justify-center">
                          <CircularProgress size={24} color="inherit" />
                          <span className="ml-2">Logging in...</span>
                        </div>
                      ) : (
                        <>
                          Log in
                          <LoginIcon className="ml-2" />
                        </>
                      )}
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
                    onClick={handleGoogleSignIn}
                    type="button"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <CircularProgress size={24} color="inherit" />
                        <span className="ml-2">Signing in with Google...</span>
                      </div>
                    ) : (
                      <>
                        <img
                          className="w-5 h-5"
                          src={`/images/logo/Google.png`}
                          alt="Google Logo"
                        />
                        <span className="flex-1 text-center">
                          Sign in with Google
                        </span>
                      </>
                    )}
                  </button>

                  <div className="text-center mt-8">
                    <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">
                      Don't you have an account?{" "}
                      <Link
                        to="/register"
                        className={`text-white font-bold hover:text-sky-500 ${
                          isLoading ? "pointer-events-none opacity-50" : ""
                        }`}
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
