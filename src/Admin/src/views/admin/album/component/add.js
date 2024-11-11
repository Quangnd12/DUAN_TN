import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import { addAlbum } from "../../../../../../services/album";
import { handleAdd } from "Admin/src/components/notification";
import { getArtists } from "../../../../../../services/artist";

const AddAlbum = () => {
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

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setValue("image", file);
    setCoverImagePreview(URL.createObjectURL(file));
    clearErrors("image");
  }, [setValue, clearErrors]);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
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
        setArtists(artistData.artists);
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };
    fetchArtists();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    data.artistID.map(artist => artist.value).forEach(id => formData.append("artistID[]", id));
    formData.append("releaseDate", new Date(data.releaseDate).toISOString().split("T")[0]);
    formData.append("image", data.image);

    try {
      await addAlbum(formData);
      navigate("/admin/album");
      handleAdd();
    } catch (error) {
      console.error("Failed to add album:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Album Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: "Title is required",
                  validate: (value) => {
                    if (value.length < 1 || value.length > 100) return "Title must be between 1 and 100 characters";
                    if (/[<>:"/\\|?*]/.test(value)) return "Title contains invalid characters";
                    return true;
                  }
                }}
                render={({ field }) => (
                  <InputField label="Title" id="title" {...field} />
                )}
              />
              {errors.title && <small className="text-red-500 mt-1 ml-2 block">{errors.title.message}</small>}
            </div>
            <div>
              <Controller
                name="artistID"
                control={control}
                rules={{ required: "Artist is required" }}
                render={({ field }) => (
                  <SelectField
                    label="Artist"
                    id="artist"
                    options={artists.map(artist => ({
                      value: artist.id,
                      label: artist.name,
                    }))}
                    isMulti
                    {...field}
                  />
                )}
              />
              {errors.artistID && <small className="text-red-500 mt-1 ml-2 block">{errors.artistID.message}</small>}
            </div>
            <div>
              <Controller
                name="releaseDate"
                control={control}
                rules={{ required: "Release date is required" }}
                render={({ field }) => (
                  <DatePickerField
                    label="Release Date"
                    id="releaseDate"
                    selected={field.value}
                    onChange={(date) => setValue("releaseDate", date, { shouldValidate: true })}
                  />
                )}
              />
              {errors.releaseDate && <small className="text-red-500 ml-2 block">{errors.releaseDate.message}</small>}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Album Cover</h2>
          <Controller
            name="image"
            control={control}
            rules={{ required: "Album cover image is required" }}
            render={() => (
              <div
                {...getImageRootProps()}
                className={`w-full p-6 border-2 border-dashed ${errors.image ? "border-red-600" : "border-gray-400"
                  } rounded-md cursor-pointer hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500`}
              >
                <input {...getImageInputProps()} />
                <p className="text-center text-gray-600">Drag & drop an image file here, or click to select a file</p>
                {watch("image") && <p className="text-center text-green-500 mt-2">Selected file: {watch("image")?.name}</p>}
                {coverImagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img src={coverImagePreview} alt="Cover Preview" className="w-32 h-32 object-cover rounded-md border-2 border-gray-300" />
                  </div>
                )}
                {errors.image && <small className="text-red-500 mt-2">{errors.image.message}</small>}
              </div>
            )}
          />
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={handleCancel} className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-4">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAlbum;