import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import { addArtist } from "../../../../../../services/artists";
import { getAlbums } from "../../../../../../services/albums";
import { handleAdd, handleError } from "../../../../components/notification";

const AddArtist = () => {
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [albumOptions, setAlbumOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
    trigger,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      bio: "",
      albumId: [],
      songId: "",
      followerId: "",
      monthly_listeners: 0,
      avatar: null,
    },
  });

  // Fetch albums for select options when component mounts
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const albumsData = await getAlbums();
        const formattedAlbums = albumsData.albums.map((album) => ({
          value: album.id,
          label: album.title,
        }));
        setAlbumOptions(formattedAlbums);
      } catch (error) {
        console.error("Failed to fetch albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setValue("avatar", file);
      const objectUrl = URL.createObjectURL(file);
      setCoverImagePreview(objectUrl);
      clearErrors("avatar");
    },
    [setValue, clearErrors]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const valid = await trigger();
      if (!valid) return;

      if (!data.avatar) {
        setError("avatar", {
          type: "manual",
          message: "Artist avatar is required",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      formData.append("monthly_listeners", data.monthly_listeners);
      formData.append("avatar", data.avatar);

      // Handle albums
      const albumIds = data.albumId.map((album) => album.value);
      formData.append("albumId", albumIds);

      // Handle songs and followers
      const songIds = data.songId.split(",").map((id) => id.trim());
      const followerIds = data.followerId.split(",").map((id) => id.trim());
      formData.append("songId", songIds);
      formData.append("followerId", followerIds);

      await addArtist(formData);
      handleAdd("Artist add successfully!");
      navigate("/admin/artist");
    } catch (error) {
      handleError(error?.response?.data?.message || "Failed to add artist");
      console.error("Failed to add artist:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Basic information</h2>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Tên nghệ sĩ là bắt buộc",
                minLength: {
                  value: 2,
                  message: "Tên phải có ít nhất 2 ký tự",
                },
              }}
              render={({ field }) => (
                <InputField
                  label="Artist name"
                  error={errors.name?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="bio"
              control={control}
              rules={{
                required: "Biography is required",
              }}
              render={({ field }) => (
                <InputField
                  label="Biography"
                  error={errors.bio?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="albumId"
              control={control}
              render={({ field }) => (
                <SelectField
                  label="Albums"
                  options={albumOptions}
                  isMulti={true}
                  error={errors.albumId?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="songId"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Song ID (separated by commas)"
                  error={errors.songId?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="followerId"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Follower ID (separated by commas)"
                  error={errors.followerId?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="monthly_listeners"
              control={control}
              rules={{
                required: "Monthly listener count is required",
                min: {
                  value: 0,
                  message: "The number of listeners cannot be negative",
                },
              }}
              render={({ field }) => (
                <InputField
                  type="number"
                  label="Number of monthly listeners"
                  error={errors.monthly_listeners?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Avatar</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-4 text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            {coverImagePreview ? (
              <img
                src={coverImagePreview}
                alt="Preview"
                className="mt-4 mx-auto h-32 w-32 object-cover"
              />
            ) : (
              <p>Drag and drop or click to select photos</p>
            )}
            {errors.avatar && (
              <p className="text-red-500 text-sm mt-2">
                {errors.avatar.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/artist")}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Add artist"}
          </button>
        </div>

        {errors.submit && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {errors.submit.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddArtist;
