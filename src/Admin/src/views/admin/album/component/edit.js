import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import { updateAlbum, getAlbumById } from "../../../../../../services/album";
import { handleEdit } from "Admin/src/components/notification";
import { getArtists } from "../../../../../../services/artist";

const EditAlbum = () => {
  const { id } = useParams();
  const { control, handleSubmit, setValue, watch, clearErrors, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      artistID: [],
      releaseDate: null,
      image: null,
    }
  });
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setValue("image", file);
    try {
      const objectURL = URL.createObjectURL(file);
      setCoverImagePreview(objectURL);
    } catch (error) {
      console.error("Failed to create object URL:", error);
    }
    clearErrors("image");
  }, [setValue, clearErrors]);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: handleDrop,
      accept: "image/*",
    });

  const handleCancel = () => {
    navigate("/admin/album");
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistData = await getArtists();
        setArtists(artistData);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    const fetchAlbum = async () => {
      try {
        const album = await getAlbumById(id);
        if (!album) {
          // Nếu album không tồn tại, hãy xử lý trường hợp này
          console.error("Album not found");
          return;
        }

        setValue("title", album.title || "");

        if (Array.isArray(album.artists)) {
          setValue("artistID", album.artists.map((artist) => ({ value: artist.id, label: artist.name })));
        } else {
          setValue("artistID", []);
        }

        setValue("releaseDate", album.releaseDate ? new Date(album.releaseDate) : null);
        setCoverImagePreview(album.coverImageUrl || null);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    fetchArtists();
    fetchAlbum();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);

    const artistIDs = data.artistID.map(artist => artist.value);
    artistIDs.forEach(id => formData.append('artistID[]', id));

    const releaseDateFormatted = new Date(data.releaseDate).toISOString().split('T')[0];
    formData.append('releaseDate', releaseDateFormatted);

    if (data.image) {
      formData.append('image', data.image);
    }

    try {
      await updateAlbum(id, formData);
      navigate("/admin/album");
      handleEdit();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        {/* Album Information */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Album Information</h2>

          {/* Title Field */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <InputField
                label="Title"
                placeholder="Enter album title"
                {...field}
                error={errors.title?.message}
              />
            )}
          />

          {/* Artist Select Field */}
          <Controller
            name="artistID"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Artist"
                placeholder="Select artist(s)"
                options={artists.map((artist) => ({ value: artist.id, label: artist.name }))}
                isMulti
                {...field}
                error={errors.artistID?.message}
              />
            )}
          />

          {/* Release Date Field */}
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => (
              <DatePickerField
                label="Release Date"
                placeholder="Select release date"
                {...field}
                error={errors.releaseDate?.message}
              />
            )}
          />
        </div>

        {/* Album Cover */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Album Cover</h2>

          {/* Display Current Cover Image */}
          {coverImagePreview && (
            <img
              src={coverImagePreview}
              alt="Album Cover Preview"
              className="w-32 h-32 object-cover rounded mb-4"
            />
          )}

          {/* Image Upload Dropzone */}
          <div {...getImageRootProps()} className="border-2 border-dashed p-4 rounded-lg cursor-pointer">
            <input {...getImageInputProps()} />
            <p>Drag and drop an image here, or click to select an image</p>
          </div>
          {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/album")}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 
              ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAlbum;