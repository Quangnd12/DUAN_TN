import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import SliderField from "../../../../components/SharedIngredients/SliderField";
import SwitchField from "../../../../components/SharedIngredients/SwitchField";
import { getSongById, updateSong } from "../../../../../../services/songs";
import LoadingSpinner from "Admin/src/components/LoadingSpinner";
import { handleEdit } from "Admin/src/components/notification";
import { getGenres } from "../../../../../../services/genres";
import { getArtists } from "../../../../../../services/artist";
import { getAlbums } from "../../../../../../services/album";
import TextareaField from "Admin/src/components/SharedIngredients/TextareaField";

const EditSong = () => {

  const { id } = useParams();

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
      is_premium:0
    }
  });

  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [coverAudioPreview, setCoverAudioPreview] = useState(null);
  const [durationSet, setDurationSet] = useState(false);
  const [Artists, setArtists] = useState([]);
  const [Genres, setGenres] = useState([]);
  const [Albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingReleaseDate, setExistingReleaseDate] = useState(null);


  
  const initData = async () => {
    const data = await getSongById(id);
    setValue("title", data.title);
    setCoverAudioPreview(data.file_song);
    setCoverImagePreview(data.image);
    setValue("lyrics", data.lyrics);
    setValue("duration", data.duration);
    setValue("releaseDate", data.releaseDate);
    if(data.releaseDate){
      setExistingReleaseDate(true);
    }else{
      setExistingReleaseDate(false);
    }
    setValue("is_explicit", data.is_explicit);
    setValue("is_premium", data.is_premium);
    const genreNames = data.genre.split(', ');
    const genreIDs = data.genreID.split(', ');
    const genreValues = genreNames.map((genre, index) => ({
      value: genreIDs[index],
      label: genre
    }));
    setValue("genreID", genreValues);

    const albumNames = (data.album && typeof data.album === 'string') ? data.album.split(', ') : [];
    const albumIDs = (data.albumID && typeof data.albumID === 'string') ? data.albumID.split(', ') : [];
    const albumValues = albumNames.map((album, index) => ({
      value: albumIDs[index],
      label: album
    }));
    setValue("albumID", albumValues);

    const artistNames = data.artist.split(', ');
    const artistIDs = data.artistID.split(', ');
    const artistValues = artistNames.map((artist, index) => ({
      value: artistIDs[index],
      label: artist
    }));
    setValue("artistID", artistValues);

    const genre = await getGenres();
    setGenres(genre.genres);
    const artist = await getArtists();
    setArtists(artist.artists);
    const album = await getAlbums();
    setAlbums(album.albums);

  };
  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (existingReleaseDate) {
      setIsEditing(true);
    }
  }, [existingReleaseDate]);

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
        setDurationSet(true);
      };
    }

    else if (name === "image") {
      setValue("image", file);
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
      onDrop: (files) => handleDrop(files, "file_song"), 
      accept: "audio/*",
    });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "image"), 
      accept: "image/*",
    });

  const handleCancel = () => {
    navigate("/admin/song"); 
  };


  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);

    const artistIDs = data.artistID.map(artist => artist.value);
    artistIDs.forEach(id => formData.append('artistID[]', id));

    const albumIDs = data.albumID.map(album => album.value);
    albumIDs.forEach(id => formData.append('albumID[]', id));


    const genreIDs = data.genreID.map(genre => genre.value);
    genreIDs.forEach(id => formData.append('genreID[]', id));

    formData.append('listens_count', 0);
    formData.append('lyrics', data.lyrics);
    const releaseDateFormatted = new Date(data.releaseDate).toISOString().split('T')[0];
    formData.append('releaseDate', releaseDateFormatted);
    formData.append('duration', data.duration);
    formData.append('is_explicit', data.is_explicit ? 1 : 0);
     formData.append('is_premium', data.is_premium? 1 : 0);
    formData.append('file_song', data.file_song);
    formData.append('image', data.image);
    try {
      await updateSong(id, formData);
      navigate("/admin/song");
      handleEdit();
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (watch("duration") !== null) {
      setDurationSet(true);
    }
  }, [watch("duration")]);

  return (
    <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <LoadingSpinner isLoading={loading} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
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
            <div >
              <Controller className="z-10"
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
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-green-500">
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
                    disabled={isEditing}
                    minDate={new Date()}
                  />
                )}
                rules={{ required: "Release date is required" }}
              />

              {errors.releaseDate && <small className="text-red-500 ml-2 block">{errors.releaseDate.message}</small>}
            </div>
            <div >
              <Controller
                name="listens_count"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Listens count"
                    id="listens_count"
                    name="listens_count"
                    {...field}
                    disabled={true}
                  />
                )}
              />
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
                      setDurationSet(false)
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
            <div className="col-span-2">
              <Controller
              style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}
                name="lyrics"
                control={control}
                render={({ field }) => (
                  <div>
                    <TextareaField
                      label="Lyrics"
                      id="lyrics"
                      name="lyrics"
                      {...field}  
                      disabled={true}                  
                    />
                  </div>
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
            <div>
              <Controller
                name="is_premium"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Premium"
                    {...field}
                    checked={field.value}
                    onChange={() => setValue("is_premium", !field.value)}
                  />
                )}
              />
            </div>  
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
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

                </div>
              )}
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
      </form >
    </div >
  );
};

export default EditSong;
