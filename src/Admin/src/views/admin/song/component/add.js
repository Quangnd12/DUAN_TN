import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import SliderField from "../../../../components/SharedIngredients/SliderField";
import SwitchField from "../../../../components/SharedIngredients/SwitchField";

const AddSong = () => {
  const { control, handleSubmit, setValue, watch, clearErrors, getValues, formState: { errors }, trigger, setError  } = useForm({
    defaultValues: {
      title: "",
      artist: [],
      genre: [],
      album: [],
      release_date: null,
      duration: null,
      tempo: 120,
      popularity: 50,
      is_explicit: false,
      audio_file: null,
      cover_image: null,
    }
  });

  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [durationSet, setDurationSet] = useState(false);

  const handleDrop = useCallback((acceptedFiles, name) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (name === "audio_file") {
      setValue("audio_file", file);
      // Xóa lỗi khi có file
      clearErrors("audio_file");
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        const durationInSeconds = Math.floor(audio.duration);
        setValue("duration", durationInSeconds, { shouldValidate: true });
        setDurationSet(true); // Đặt trạng thái khi nhận được giá trị
      };
    } else if (name === "cover_image") {
      setValue("cover_image", file);
      try {
        const objectURL = URL.createObjectURL(file);
        setCoverImagePreview(objectURL);
      } catch (error) {
        console.error("Failed to create object URL:", error);
      }
      // Xóa lỗi khi có file
      clearErrors("cover_image");
    }
  }, [setValue, clearErrors]);


  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "audio_file"),
      accept: "audio/*",
    });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "cover_image"),
      accept: "image/*",
    });

  const handleCancel = () => {
    navigate("/admin/song"); // Điều hướng về trang list.js
  };

  const genres = [
    "pop",
    "blue",
    "rock",
    "jazz",
    "hip-hop",
    "classical",
    "electronic",
  ];
  const artists = ["Artist 1", "Artist 2", "Artist 3"];
  const albums = ["Album 1", "Album 2", "Album 3"];

  const onSubmit = async (data) => {
    const valid = await trigger(); 
    if (!valid) return;
    if (!data.audio_file) {
      console.log("Audio file is required");
      setError("audio_file", { type: "manual", message: "Audio file is required" });
      return;
    }
    if (!data.cover_image) {
      console.log("Cover image is required");
      setError("cover_image", { type: "manual", message: "Cover image is required" });
      return;
    }
    console.log(data);
  };

  useEffect(() => {
    if (watch("duration") !== null) {
      setDurationSet(true);
    }
  }, [watch("duration")]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                name="artist"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Artist"
                    id="artist"
                    name="artist"
                    options={artists.map((artist) => ({
                      value: artist,
                      label: artist,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
                rules={{ required: "Artist is required" }}
              />
              {errors.artist && <small className="text-red-500 mt-1 ml-2 block">{errors.artist.message}</small>}
            </div>
            <div>
              <Controller
                name="genre"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Genre"
                    id="genre"
                    name="genre"
                    options={genres.map((genre) => ({
                      value: genre,
                      label: genre,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
                rules={{ required: "Genre is required" }}
              />
              {errors.genre && <small className="text-red-500 mt-1 ml-2 block">{errors.genre.message}</small>}
            </div>
            <div>
              <Controller
                name="album"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Album"
                    id="album"
                    name="album"
                    options={albums.map((album) => ({
                      value: album,
                      label: album,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
                rules={{ required: "Album is required" }}
              />
              {errors.album && <small className="text-red-500 mt-1 ml-2 block">{errors.album.message}</small>}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="release_date"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Release Date"
                    id="release_date"
                    selected={field.value} 
                    onChange={(date) => setValue("release_date", date, { shouldValidate: true })} 
                  />
                )}
                rules={{ required: "Release date is required" }}
              />

              {errors.release_date && <small className="text-red-500 ml-2 block">{errors.release_date.message}</small>}
            </div>
            <div>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <SliderField
                    label="Duration (seconds)"
                    min={0}
                    max={600}
                    {...field}
                    value={field.value || 0}
                    onChange={(value) => {
                      if (!durationSet || !getValues("audio_file")) {
                        setValue("duration", value, { shouldValidate: true });
                      }
                    }}
                    disabled={durationSet && getValues("audio_file")}
                  />
                )}
                rules={{
                  required: "Duration is required",
                  validate: (value) => value > 0 || "Duration must be greater than 0"
                }}
              />
              {errors.duration && <small className="text-red-500 ml-2 block">{errors.duration.message}</small>}
            </div>
            <div>
              <Controller
                name="tempo"
                control={control}
                render={({ field }) => (
                  <SliderField
                    label="Tempo (BPM)"
                    min={60}
                    max={200}
                    {...field}
                    value={field.value}
                    onChange={(value) => setValue("tempo", value)}
                  />
                )}                
              />               
            </div>
            <div>
              <Controller
                name="popularity"
                control={control}
                render={({ field }) => (
                  <SliderField
                    label="Popularity"
                    min={0}
                    max={100}
                    {...field}
                    value={field.value}
                    onChange={(value) => setValue("popularity", value)}
                  />
                )}             
              />              
            </div>
            <div>
              <Controller
                name="is_explicit"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Explicit"
                    {...field}
                    checked={field.value}
                    onChange={() => setValue("is_explicit", !field.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Media Upload</h2>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="audio_file"
              control={control}
              render={({ field }) => (
                <div
                  {...getAudioRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${errors.audio_file ? 'border-red-600' : 'border-gray-400'} rounded-md cursor-pointer hover:border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                >
                  <input
                    {...getAudioInputProps()}
                  />
                  <p className="text-center text-gray-600">
                    Drag & drop an audio file here, or click to select a file
                  </p>
                  {watch("audio_file") && (
                    <p className="text-center text-green-500 mt-2">
                      Selected file: {watch("audio_file")?.name}
                    </p>
                  )}
                  {errors.audio_file && <small className="text-red-500 mt-2">{errors.audio_file.message}</small>}
                </div>
              )}
              rules={{ required: "Audio file is required" }}
            />
            <Controller
              name="cover_image"
              control={control}
              render={({ field }) => (
                <div
                  {...getImageRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${errors.cover_image ? 'border-red-600' : 'border-gray-400'} rounded-md cursor-pointer hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <input {...getImageInputProps()} />
                  <p className="text-center text-gray-600">
                    Drag & drop an image file here, or click to select a file
                  </p>
                  {watch("cover_image") && (
                    <p className="text-center text-green-500 mt-2">
                      Selected file: {watch("cover_image")?.name}
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
                  {errors.cover_image && <small className="text-red-500 mt-2">{errors.cover_image.message}</small>}
                </div>
              )}
              rules={{ required: "Cover image is required" }}
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

export default AddSong;
