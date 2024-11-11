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
  const navigate = useNavigate();
  
  const { control, handleSubmit, setValue, watch, clearErrors, formState: { errors }, trigger } = useForm({
    defaultValues: {
      title: "",
      artistID: [],
      releaseDate: null,
      image: null,
    }
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [Artists, setArtists] = useState([]);

  const initData = async () => {
    try {
      const [albumData, artistData] = await Promise.all([
        getAlbumById(id),
        getArtists()
      ]);

      if (albumData) {
        // Set basic fields
        setValue("title", albumData.title || "");
        setCoverImagePreview(albumData.image);
        
        // Handle release date
        if (albumData.releaseDate) {
          setValue("releaseDate", new Date(albumData.releaseDate));
        }

        // Handle artists - assuming albumData.artists is an array of objects
        if (albumData.artists && Array.isArray(albumData.artists)) {
          const artistValues = albumData.artists.map(artist => ({
            value: artist.id,
            label: artist.name
          }));
          setValue("artistID", artistValues);
        }
      }

      // Set available artists for selection
      if (artistData && artistData.artists) {
        setArtists(artistData.artists);
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  useEffect(() => {
    initData();
  }, []);

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

  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;

    const formData = new FormData();
    formData.append('title', data.title);

    const artistIDs = data.artistID.map(artist => artist.value);
    artistIDs.forEach(id => formData.append('artistID[]', id));

    const releaseDateFormatted = new Date(data.releaseDate).toISOString().split('T')[0];
    formData.append('releaseDate', releaseDateFormatted);
    
    if (data.image instanceof File) {
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
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Title"
                    id="title"
                    name="title"
                    {...field}
                  />
                )}
                rules={{
                  validate: (value) => {
                    if (!value) return "Title is required";
                    if (value.length < 1 || value.length > 100) return "Title must be between 1 and 100 characters";
                    const invalidCharacters = /[<>:"/\\|?*]/;
                    if (invalidCharacters.test(value)) return "Title contains invalid characters";
                    return true;
                  }
                }}
              />
              {errors.title && <small className="text-red-500 mt-1 ml-2 block">{errors.title.message}</small>}
            </div>
            <div>
              <Controller
                name="artistID"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Artist"
                    id="artist"
                    name="artistIds"
                    options={Artists.map((artist) => ({
                      value: artist.id,
                      label: artist.name,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
                rules={{ required: "Artist is required" }}
              />
              {errors.artistID && <small className="text-red-500 mt-1 ml-2 block">{errors.artistID.message}</small>}
            </div>
            <div>
              <Controller
                name="releaseDate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Release Date"
                    id="releaseDate"
                    selected={field.value}
                    onChange={(date) => setValue("releaseDate", date, { shouldValidate: true })}
                  />
                )}
                rules={{ required: "Release date is required" }}
              />
              {errors.releaseDate && <small className="text-red-500 ml-2 block">{errors.releaseDate.message}</small>}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Album Cover</h2>
          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <div
                  {...getImageRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${errors.image ? 'border-red-600' : 'border-gray-400'} rounded-md cursor-pointer hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <input {...getImageInputProps()} />
                  <p className="text-center text-gray-600">
                    Drag & drop an image file here, or click to select a file
                  </p>
                  {watch("image") && (
                    <p className="text-center text-green-500 mt-2">
                      Selected file: {watch("image")?.name}
                    </p>
                  )}
                  {coverImagePreview && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={coverImagePreview}
                        alt="Cover Preview"
                        className="w-32 h-32 object-cover rounded-md border-2 border-gray-300"
                      />
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>

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