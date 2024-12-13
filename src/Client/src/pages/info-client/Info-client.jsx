import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import InfoClientCard from "../../components/cards/Info-clientCard";
import InfoClientFollowingCard from "../../components/cards/Info-clientFollowingCard";
import CircularProgress from "@mui/material/CircularProgress";
import { Alert, Snackbar } from "@mui/material";
import tb from "../../../public/assets/img/image 27.png";
import LogoutDialog from "./components/logoutDialog";

import { useUpdateUserMutation } from "../../../../redux/slice/apiSlice";
import { updateUser, logout } from "../../../../redux/slice/authSlice";


const InfoClient = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    birthday: "",
    avatar: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);

  const [updateUserInfo] = useUpdateUserMutation();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [validationErrors, setValidationErrors] = useState({
    username: false,
    birthday: false,
  });
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataFromStore = authUser;
        const userIdToFetch =
          userId || userDataFromStore.id || userDataFromStore.uid;

        if (userIdToFetch) {
          setUser(userDataFromStore);

          // Format birthday to YYYY-MM-DD for input type="date"
          let formattedBirthday = "";
          if (userDataFromStore.birthday) {
            const birthDate = new Date(userDataFromStore.birthday);
            formattedBirthday = birthDate.toISOString().split("T")[0];
          }

          setFormData({
            username:
              userDataFromStore.username || userDataFromStore.displayName || "",
            birthday: formattedBirthday,
            avatar:
              userDataFromStore.avatar ||
              userDataFromStore.photoURL ||
              "/assets/images/default-avatar.jpg",
          });
          setPreviewImage(
            userDataFromStore.avatar ||
              userDataFromStore.photoURL ||
              "/assets/images/default-avatar.jpg"
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, authUser]);

  const handleImageClick = () => {
    setIsEditing(true);
  };

  const validateForm = () => {
    const errors = {
      username: !formData.username.trim(),
      birthday: !formData.birthday,
    };

    setValidationErrors(errors);

    if (errors.username || errors.birthday) {
      setAlertMessage(
        `Please fill in the following fields: ${[
          ...(errors.username ? ["Username"] : []),
          ...(errors.birthday ? ["Birthday"] : []),
        ].join(", ")}`
      );
      setShowValidationAlert(true);
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", formData.username);

      // Ensure birthday is properly formatted before sending
      if (formData.birthday) {
        // Convert to ISO string and keep only the date part
        const birthDate = new Date(formData.birthday);
        formDataToSend.append(
          "birthday",
          birthDate.toISOString().split("T")[0]
        );
      }

      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      const { data: updatedUser } = await updateUserInfo({
        id: user.id,
        formData: formDataToSend,
      });

      dispatch(updateUser(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setLogoutDialogOpen(true);
    } catch (error) {
      console.error("Error updating user info:", error);
      setAlertMessage("An error occurred while updating your profile");
      setShowValidationAlert(true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseValidationAlert = () => {
    setShowValidationAlert(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL for the UI
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleCloseLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const handleOverlayClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloseEditing = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      setIsEditing(false);
      // Reset preview if no changes were saved
      setPreviewImage(formData.avatar);
      setSelectedFile(null);
    }
  };

  if (!user) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <>
      <div className="bg-black text-white w-full h-auto">
        <div className="bg-zinc-800 p-20 rounded-lg">
          <div className="flex items-center flex-col sm:flex-row">
            <img
              className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-gray-300 object-cover mb-4 sm:mb-0 sm:mr-6 cursor-pointer transition-transform duration-300 hover:scale-105"
              src={formData.avatar}
              onError={(e) => e.target.src = '/images/avatar.jpg'}
              alt="User avatar"
              onClick={handleImageClick}
            />
            <div className="text-center sm:text-left mt-18">
              <p className="text-gray-400 text-base sm:text-lg mb-1">Profile</p>
              <h2 className="text-3xl sm:text-6xl font-bold mb-2">
                {formData.name}
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                Email: {user.email}
              </p>
              <p className="text-gray-400 text-base sm:text-lg">
                Birthday:{" "}
                {formData.birthday
                  ? new Date(formData.birthday).toLocaleDateString("en-GB")
                  : "N/A"}
              </p>
              <p className="text-gray-400 text-base sm:text-lg">
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 font-semibold inline-block ml-2">
              #<span className="ml-10">Title</span>
            </span>
            <img
              src={tb}
              alt="Featureimage"
              className="w-7 h-auto object-cover rounded-lg mr-10"
            />
          </div>
          <hr className="w-full border-t border-gray-600" />
          <br />
          <ul className="grid grid-cols-1 gap-4">
            <InfoClientCard/>
          </ul>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap gap-6">
         <InfoClientFollowingCard/>
          </div>
        </div>

        {isEditing && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 modal-overlay"
            onClick={handleCloseEditing}
          >
            <div className="bg-zinc-800 p-8 rounded-lg w-full max-w-4xl flex flex-col md:flex-row shadow-lg relative">
              {isUpdating && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <CircularProgress size={50} color="primary" />
                </div>
              )}
              <div className="relative flex flex-col items-center md:w-1/2 mb-4 md:mb-0">
                <img
                  className="w-48 h-48 rounded-lg object-cover mb-4 border-4 border-blue-600 mt-5"
                  src={previewImage}
                  alt="Profile Preview"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  onClick={handleOverlayClick}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
                >
                  Upload Image
                </button>
              </div>
              <div className="flex flex-col justify-center md:w-1/2 md:pl-6">
                <div className="mb-4">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    placeholder="Enter your name"
                    className={`bg-zinc-700 text-white p-3 rounded w-full border ${
                      validationErrors.username
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:border-blue-500 transition-colors duration-300`}
                  />
                  {validationErrors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      Username is required
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleFormChange}
                    className={`bg-zinc-700 text-white p-3 rounded w-full border ${
                      validationErrors.birthday
                        ? "border-red-500"
                        : "border-gray-600"
                    } focus:border-blue-500 transition-colors duration-300`}
                  />
                  {validationErrors.birthday && (
                    <p className="text-red-500 text-sm mt-1">
                      Birthday is required
                    </p>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition-colors duration-300"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={handleCloseLogoutDialog}
        onLogout={handleLogout}
      />
      <Snackbar
        open={showValidationAlert}
        autoHideDuration={6000}
        onClose={handleCloseValidationAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseValidationAlert}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default InfoClient;
