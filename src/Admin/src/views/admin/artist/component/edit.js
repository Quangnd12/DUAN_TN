import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../../../components/SharedIngredients/InputField";
import { handleAdd } from "../../../../components/notification";
import { getArtistById, updateArtist } from "../../../../../../services/artist"; // Import necessary functions
import LoadingSpinner from "Admin/src/components/LoadingSpinner";

const EditArtist = () => {
  const { id } = useParams(); // Get the artist ID from URL parameters
  const {
    control,
    handleSubmit,
    setValue,
    clearErrors,
    trigger,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: "",
      avatar: null,
      biography: "",
    },
  });

  const navigate = useNavigate();
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [existingAvatar, setExistingAvatar] = useState(null); // Track existing avatar
  const [loading, setLoading] = useState(false); // Loading state for data fetching and form submission

  // Fetch artist data when component mounts
  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true); // Set loading to true while fetching data
      try {
        const artist = await getArtistById(id); // Fetch artist data by ID
        setValue("name", artist.name);
        setValue("role", artist.role);
        setValue("biography", artist.biography);
        setExistingAvatar(artist.avatar); // Store existing avatar
        setAvatarPreview(artist.avatar); // Set avatar preview if there's an existing avatar
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchArtist();
  }, [id, setValue]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setValue("avatar", file);
      const objectURL = URL.createObjectURL(file);
      setAvatarPreview(objectURL);
      clearErrors("avatar");
    },
    [setValue, clearErrors]
  );

  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
  } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  const handleCancel = () => {
    navigate("/admin/artist");
  };

  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;

    setLoading(true); // Set loading to true before submitting form
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("role", data.role);
      formData.append("biography", data.biography);

      // Only append avatar if a new file is uploaded
      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      } else if (existingAvatar) {
        // If no new avatar, use the existing one
        formData.append("avatar", existingAvatar);
      }

      await updateArtist(id, formData); // Call update function with artist ID
      handleAdd(); // Display success notification
      navigate("/admin/artist"); // Navigate back to artist list after update
    } catch (error) {
      console.error(
        "Error updating artist:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <LoadingSpinner isLoading={loading} /> {/* Display loading spinner */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField label="Name" id="name" name="name" {...field} />
                )}
                rules={{
                  validate: (value) => {
                    if (!value) return "Name is required";
                    if (value.length < 1 || value.length > 100)
                      return "Name must be between 1 and 100 characters";
                    const invalidCharacters = /[<>:"/\\|?*]/;
                    if (invalidCharacters.test(value))
                      return "Name contains invalid characters";
                    return true;
                  },
                }}
              />
              {errors.name && (
                <small className="text-red-500">{errors.name.message}</small>
              )}
            </div>

            <div>
              <Controller
                name="role"
                control={control}
                rules={{
                  required: "Please select a role",
                }}
                render={({ field }) => (
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="role"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-base focus:ring-blue-500 focus:border-blue-500"
                      {...field}
                    >
                      <option value="">Please select a role</option>
                      <option value="1">Artist</option>
                      <option value="2">Rapper</option>
                    </select>
                    {errors.role && (
                      <small className="text-red-500">
                        {errors.role.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="col-span-2">
            <Controller
              name="biography"
              control={control}
              render={({ field }) => (
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700"
                    htmlFor="biography"
                  >
                    Biography
                  </label>
                  <textarea
                    id="biography"
                    name="biography"
                    {...field}
                    rows={5}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.biography && (
                    <small className="text-red-500">
                      {errors.biography.message}
                    </small>
                  )}
                </div>
              )}
              rules={{ required: "Biography is required" }}
            />
          </div>
        </div>

        {/* Avatar Upload Section */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Avatar Upload</h2>
          <div className="grid grid-cols-1 gap-2">
            <Controller
              name="avatar"
              control={control}
              render={({ field }) => (
                <div
                  {...getAvatarRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${
                    errors.avatar ? "border-red-600" : "border-gray-400"
                  } rounded-md cursor-pointer hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <input {...getAvatarInputProps()} />
                  <p className="text-center text-gray-600">
                    Drag & drop an avatar image file here, or click to select a
                    file
                  </p>
                  {field.value && (
                    <p className="text-center text-green-500 mt-2">
                      Selected file: {field.value?.name}
                    </p>
                  )}
                  {avatarPreview && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-32 h-32 object-cover rounded-md border-2 border-gray-300"
                      />
                    </div>
                  )}
                  {errors.avatar && (
                    <small className="text-red-500 mt-2">
                      {errors.avatar.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArtist;
