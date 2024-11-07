import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import SliderField from "../../../../components/SharedIngredients/SliderField";
import SwitchField from "../../../../components/SharedIngredients/SwitchField";
import { addSong } from "../../../../../../services/songs";
import { handleAdd } from "Admin/src/components/notification";
import { getGenres } from "services/genres";
import { getArtists } from "services/artist";
import { getAlbums } from "services/album";


const AddSong = () => {
  const { control, handleSubmit, setValue, watch, clearErrors, getValues, formState: { errors }, trigger, setError } = useForm({
    defaultValues: {
      title: "",
      file_song: null,
      image: null,
      artistID: [],
      albumID: [],
      genreID: [],
      listens_count: 0,
      lyrics: "",
      releaseDate: null,
      duration: null,
      is_explicit: 0,
    }
  });
  const [Artists, setArtists] = useState([]);
  const [Genres, setGenres] = useState([]);
  const [Albums, setAlbums] = useState([]);
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [durationSet, setDurationSet] = useState(false);
  const [coverAudioPreview, setCoverAudioPreview] = useState(null);

  const handleDrop = useCallback(async (acceptedFiles, name) => {
    const file = acceptedFiles[0];
    if (!file) return;


    if (name === "file_song") {
      setValue("file_song", file);
      clearErrors("file_song");
      const audioUrl = URL.createObjectURL(file);
      setCoverAudioPreview(audioUrl);
      const audio = new Audio(audioUrl);
      audio.onloadedmetadata = () => {
        const durationInSeconds = Math.floor(audio.duration);
        setValue("duration", durationInSeconds, { shouldValidate: true });
      };
    }

    else if (name === "image") {
      setValue("image", file); // Cập nhật giá trị cho image
      try {
        const objectURL = URL.createObjectURL(file);
        setCoverImagePreview(objectURL);
      } catch (error) {
        console.error("Failed to create object URL:", error);
      }
      clearErrors("image");
    }
  }, [setValue, clearErrors]);

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "file_song"), // Thay đổi thành file_song
      accept: "audio/*",
    });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "image"), // Thay đổi thành image
      accept: "image/*",
    });

  const handleCancel = () => {
    navigate("/admin/song"); // Điều hướng về trang list.js
  };

  const data = async () => {
    const genre = await getGenres();
    setGenres(genre.genres);
    const artist = await getArtists();
    setArtists(artist.artists);
    const album = await getAlbums();
    setAlbums(album.albums);
  }

  useEffect(() => {
    data();
  }, [])


  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;

    const formData = new FormData();
    formData.append('title', data.title);

    const artistIDs = data.artistID.map(artist => artist.value);
    artistIDs.forEach(id => formData.append('artistID[]', id));

    if (data.albumID && data.albumID.length > 0) {
      const albumIDs = data.albumID.map(album => album.value);
      albumIDs.forEach(id => formData.append('albumID[]', id));
    }

    const genreIDs = data.genreID.map(genre => genre.value);
    genreIDs.forEach(id => formData.append('genreID[]', id));

    formData.append('listens_count', 0);
    formData.append('lyrics', data.lyrics);
    const releaseDateFormatted = new Date(data.releaseDate).toISOString().split('T')[0];
    formData.append('releaseDate', releaseDateFormatted);
    formData.append('duration', data.duration);
    formData.append('is_explicit', data.is_explicit ? 1 : 0);
    formData.append('file_song', data.file_song);
    formData.append('image', data.image);
    try {
      await addSong(formData);
      navigate("/admin/song");
      handleAdd();
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    if (watch("duration") !== null) {
      setDurationSet(true);
    }
  }, [watch("duration")]);

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
                      value: artist.id, // Assuming artist has an id property
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
                name="genreID"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Genre"
                    id="genreID"
                    name="genreID"
                    options={Genres.map((genre) => ({
                      value: genre.id,
                      label: genre.name,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
                rules={{ required: "Genre is required" }}
              />
              {errors.genreID && (
                <small className="text-red-500 mt-1 ml-2 block">{errors.genreID.message}</small>
              )}
            </div>
            <div>
              <Controller
                name="albumID"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Album"
                    id="album"
                    name="albumID"
                    options={Albums.map((album) => ({
                      value: album.id,
                      label: album.title,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
              // rules={{ required: "Album is required" }}
              />
              {/* {errors.albumID && <small className="text-red-500 mt-1 ml-2 block">{errors.albumID.message}</small>} */}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
          <div className="grid grid-cols-2 gap-4">
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

              {errors.releasedate && <small className="text-red-500 ml-2 block">{errors.releasedate.message}</small>}
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
                      if (!durationSet || !getValues("file_song")) {
                        setValue("duration", value, { shouldValidate: true });
                      }
                    }}
                    disabled={durationSet && getValues("file_song")}
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
              name="file_song"
              control={control}
              render={({ field }) => (
                <div
                  {...getAudioRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${errors.file_song ? 'border-red-600' : 'border-gray-400'} rounded-md cursor-pointer hover:border-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
                >
                  <input
                    {...getAudioInputProps()}
                  />
                  <p className="text-center text-gray-600">
                    Drag & drop an audio file here, or click to select a file
                  </p>
                  {watch("file_song") && (
                    <p className="text-center text-green-500 mt-2">
                      Selected file: {watch("file_song")?.name}
                    </p>
                  )}
                  {coverAudioPreview && (
                    <audio controls src={coverAudioPreview} className="mt-2 w-full" />
                  )}
                  {errors.file_song && <small className="text-red-500 mt-2">{errors.file_song.message}</small>}
                </div>
              )}
              rules={{ required: "Audio file is required" }}
            />
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
                  {errors.image && <small className="text-red-500 mt-2">{errors.image.message}</small>}
                </div>
              )}
              rules={{ required: "image is required" }}
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
      </form >
    </div >
  );
};

export default AddSong;
