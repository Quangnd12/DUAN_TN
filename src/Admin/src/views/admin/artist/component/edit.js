import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import {
  updateArtist,
  getArtistById,
} from "../../../../../../services/artists";
import { getAlbums } from "../../../../../../services/albums";
import { handleEdit, handleError } from "../../../../components/notification";

const EditArtist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [albumOptions, setAlbumOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
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

  // Fetch artist data and albums when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch artist details
        const artistData = await getArtistById(id);
        if (artistData) {
          setValue("name", artistData.name);
          setValue("bio", artistData.bio);
          setValue("monthly_listeners", artistData.monthly_listeners);
          setCoverImagePreview(artistData.avatar);

          // Format album data for select field
          if (artistData.albumId) {
            const formattedAlbums = artistData.albumId.map((album) => ({
              value: album.id,
              label: album.title,
            }));
            setValue("albumId", formattedAlbums);
          }

          // Format song and follower IDs
          setValue("songId", artistData.songId?.join(", ") || "");
          setValue("followerId", artistData.followerId?.join(", ") || "");
        }

        // Fetch albums for select options
        const albumsData = await getAlbums();
        const formattedAlbumOptions = albumsData.albums.map((album) => ({
          value: album.id,
          label: album.title,
        }));
        setAlbumOptions(formattedAlbumOptions);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [id, setValue]);

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

      const isValid = await trigger();
      if (!isValid) {
        handleError("Please check the information again!");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("bio", data.bio);
      formData.append("monthly_listeners", data.monthly_listeners);

      // Handle albums
      const albumIds = data.albumId.map((album) => album.value);
      formData.append("albumId", albumIds);

      // Handle songs and followers
      const songIds = data.songId.split(",").map((id) => id.trim());
      const followerIds = data.followerId.split(",").map((id) => id.trim());
      formData.append("songId", songIds);
      formData.append("followerId", followerIds);

      // Only append avatar if a new file was selected
      if (data.avatar instanceof File) {
        formData.append("avatar", data.avatar);
      }

      await updateArtist(id, formData);
      handleEdit("Artist edit successfully!");
      navigate("/admin/artist");
    } catch (error) {
      console.error("Failed to update artist:", error);
      handleError(error?.response?.data?.message || "Failed to add artist");
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
                required: "Artist name is required",
                minLength: {
                  value: 2,
                  message: "The name must have at least 2 characters",
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
              name="monthly_listeners"
              control={control}
              rules={{
                required: "Monthly listener count is required",
                min: {
                  value: 0,
                  message: "Monthly listener count is required",
                },
              }}
              render={({ field }) => (
                <InputField
                  type="number"
                  label="Monthly listener count"
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
            <p>Drag and drop or click to select photos</p>
            {coverImagePreview && (
              <img
                src={coverImagePreview}
                alt="Preview"
                className="mt-4 mx-auto h-32 w-32 object-cover"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/artist")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Cancle
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg  hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArtist;
