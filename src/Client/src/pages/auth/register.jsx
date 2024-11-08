import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import TextField from "@mui/material/TextField";
import LoginIcon from "@mui/icons-material/Login";
import { InputAdornment, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { makeStyles } from "@material-ui/styles";
import { signInWithGoogle } from '../../../../config/firebaseConfig';
import { useRegisterMutation, useGoogleLoginMutation } from "../../../../redux/slice/apiSlice";
import { setCredentials } from "../../../../redux/slice/authSlice";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // RTK Query mutations
  const [register, { isLoading: isRegistering, error: registerError }] = useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError,
  } = useForm();

  const password = watch("password");

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle regular registration
  const onSubmit = async (data) => {
    try {
      const result = await register({
        email: data.email,
        password: data.password
      }).unwrap();

       // Lưu thông tin user vào Redux store và localStorage
       dispatch(setCredentials({
        user: result.user,
        token: result.token
      }));
      
      toast.success("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      if (err.data?.message) {
        toast.error(err.data.message);
        // Set specific field errors if they exist
        if (err.data.errors) {
          Object.keys(err.data.errors).forEach(key => {
            setFormError(key, {
              type: 'server',
              message: err.data.errors[key]
            });
          });
        }
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      const { user: googleUser, token: googleToken } = await signInWithGoogle();
      
      const result = await googleLogin({ idToken: googleToken }).unwrap();
      
      // Lưu thông tin user vào Redux store và localStorage
      dispatch(setCredentials({
        user: result.user,
        token: result.token
      }));

      toast.success("Google registration successful!");
      navigate('/');
    } catch (error) {
      toast.error(error.message || "Google registration failed");
    }
  };

  // Show API errors in toast
  useEffect(() => {
    if (registerError) {
      toast.error(registerError.data?.message || "Registration failed");
    }
  }, [registerError]);

  return (
    <HelmetProvider>
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
                      {...registerField("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Invalid email format. Only letters, numbers, and periods are allowed.",
                        },
                        validate: (value) => {
                          const forbiddenWords = ["fuckyou", "cunt", "penis", "dick", "fuck"];
                          for (let word of forbiddenWords) {
                            if (value.toLowerCase().includes(word)) {
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
                      {...registerField("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        pattern: {
                          value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                          message: "Password must contain at least one letter and one number"
                        }
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
                      {...registerField("confirmPassword", {
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
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    disabled={isRegistering}
                  >
                    {isRegistering ? "Signing up..." : "Sign up"}
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
                  className="w-full py-2 px-4 bg-black border border-[#6a6a6a] text-white rounded-3xl shadow-md flex items-center justify-center hover:border-white hover:border-[1px] hover:ring-1 hover:ring-white transition-all"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                >
                  <img className="w-5 h-5" src={`/images/logo/Google.png`} alt="Google Logo" />
                  <span className="flex-1 text-center">
                    {isGoogleLoading ? "Processing..." : "Sign up with Google"}
                  </span>
                </button>

                <div className="text-center mt-8">
                  <p className="text-gray-500 font-semibold mx-3 mb-0 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="no-underline font-bold text-white hover:text-sky-500">
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
    </HelmetProvider>
  );
};

export default Register;