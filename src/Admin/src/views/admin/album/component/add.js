import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import TextField from "@mui/material/TextField";
import { addAlbum } from "../../../../../../services/albums";
import { getArtists } from "../../../../../../services/artists";
import { handleAdd, handleError } from "../../../../components/notification";

const AddAlbum = () => {
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
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
      title: "",
      artistId: [],
      songId: "",
      describe: "",
      totalTracks: 0,
      popularity: 0,
      releaseDate: null,
      cover_image: null,
    },
  });

  // Fetch artists for select options
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await getArtists();
        const formattedArtists = artistsData.artists.map((artist) => ({
          value: artist.id,
          label: artist.name,
        }));
        setArtistOptions(formattedArtists);
      } catch (error) {
        console.error("Error fetching artists:", error);
        handleError("Could not load artist list");
      }
    };

    fetchArtists();
  }, []);

  // Handle image drop
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setValue("cover_image", file);
      const objectUrl = URL.createObjectURL(file);
      setCoverImagePreview(objectUrl);
      clearErrors("cover_image");
    },
    [setValue, clearErrors]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  // Form submission
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      const valid = await trigger();
      if (!valid) return;

      if (!data.cover_image) {
        setError("cover_image", {
          type: "manual",
          message: "Album cover image is required",
        });
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("describe", data.describe);
      formData.append("totalTracks", data.totalTracks);
      formData.append("popularity", data.popularity);
      formData.append("releaseDate", data.releaseDate.toISOString());
      formData.append("image", data.cover_image);

      // Handle artistId array
      const artistIds = data.artistId.map((artist) => artist.value);
      formData.append("artistId", artistIds);

      // Handle songId array if provided
      if (data.songId) {
        const songIds = data.songId.split(",").map((id) => id.trim());
        formData.append("songId", songIds);
      }

      await addAlbum(formData);
      handleAdd("Album added successfully!");
      navigate("/admin/album");
    } catch (error) {
      console.error("Error adding album:", error);
      handleError(error?.response?.data?.message || "Failed to add album");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render input field helper
  const renderInputField = (
    name,
    label,
    type = "text",
    rules = {},
    isTextArea = false
  ) => (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) =>
        isTextArea ? (
          <TextField
            label={label}
            multiline
            rows={4}
            className="col-span-2"
            error={!!errors[name]}
            helperText={errors[name]?.message}
            {...field}
          />
        ) : (
          <InputField
            type={type}
            label={label}
            error={errors[name]?.message}
            {...field}
          />
        )
      }
    />
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {renderInputField("title", "Album Title", "text", {
              required: "Album title is required",
              minLength: {
                value: 2,
                message: "Title must be at least 2 characters",
              },
            })}

            <Controller
              name="artistId"
              control={control}
              rules={{ required: "Artist is required" }}
              render={({ field }) => (
                <SelectField
                  label="Artists"
                  options={artistOptions}
                  isMulti={true}
                  error={errors.artistId?.message}
                  {...field}
                />
              )}
            />

            {renderInputField("songId", "Song IDs (comma separated)", "text")}

            <Controller
              name="releaseDate"
              control={control}
              rules={{ required: "Release date is required" }}
              render={({ field }) => (
                <DatePickerField
                  label="Release Date"
                  selected={field.value} // Chuyển `field.value` vào thuộc tính `selected`
                  onChange={(date) => field.onChange(date)} // Đảm bảo `onChange` cập nhật đúng
                  id="releaseDate"
                  error={errors.releaseDate?.message}
                />
              )}
            />

            {renderInputField("totalTracks", "Total Tracks", "number", {
              required: "Total tracks is required",
              min: {
                value: 1,
                message: "Total tracks must be greater than 0",
              },
            })}

            {renderInputField("popularity", "Popularity", "number", {
              min: {
                value: 0,
                message: "Popularity cannot be negative",
              },
              max: {
                value: 100,
                message: "Popularity cannot exceed 100",
              },
            })}

            {renderInputField(
              "describe",
              "Description",
              "text",
              {
                required: "Description is required",
              },
              true
            )}
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Cover Image</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input {...getInputProps()} />
            {coverImagePreview ? (
              <div className="space-y-4">
                <img
                  src={coverImagePreview}
                  alt="Preview"
                  className="mx-auto h-32 w-32 object-cover rounded"
                />
                <p className="text-sm text-gray-600">
                  Click or drag to change image
                </p>
              </div>
            ) : (
              <p>Drag and drop or click to select cover image</p>
            )}
            {errors.cover_image && (
              <p className="text-red-500 text-sm mt-2">
                {errors.cover_image.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/album")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Add Album"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAlbum;
