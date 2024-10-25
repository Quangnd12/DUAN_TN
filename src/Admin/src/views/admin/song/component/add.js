import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import SliderField from "../../../../components/SharedIngredients/SliderField";
import SwitchField from "../../../../components/SharedIngredients/SwitchField";
import TextareaField from "Admin/src/components/SharedIngredients/TextareaField";
import { addSong } from "../../../../../../services/songs";
import { handleAdd } from "Admin/src/components/notification";
import { getGenres } from "services/genres";
import { getArtists } from "services/artist";
import { getAlbums } from "services/album";


const AddSong = () => {
  const { control, handleSubmit, setValue, watch, clearErrors, getValues, formState: { errors }, trigger, setError } = useForm({
    defaultValues: {
      title: "",
      artistIds: [],
      albumIds: [],
      genreIds: [],
      playcountId: 0,
      lyrics: "",
      releasedate: null,
      duration: null,
      is_explicit: false,
      file_song: null, // Sử dụng file_song
      image: null,     // Sử dụng image
    }
  });
  const [Artists, setArtists] = useState([]);
  const [Genres, setGenres] = useState([]);
  const [Albums, setAlbums] = useState([]);
  const [selectedMainGenre, setSelectedMainGenre] = useState(null); // Lưu thể loại chính
  const [subGenreOptions, setSubGenreOptions] = useState([]); // Lưu thể loại con
  const [selectedSubGenre, setSelectedSubGenre] = useState(null); //
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [durationSet, setDurationSet] = useState(false);
  const [lyrics, setLyrics] = useState("");

  const handleDrop = useCallback(async (acceptedFiles, name) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (name === "file_song") {
      setValue("file_song", file); // Cập nhật giá trị cho file_song
      clearErrors("file_song");
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        const durationInSeconds = Math.floor(audio.duration);
        setValue("duration", durationInSeconds, { shouldValidate: true });
      };
      // try {
      //   const metadata = await mm.parseBlob(file);
      //   console.log(metadata);

      //   if (metadata && metadata.common && metadata.common.lyrics) {
      //     // Lưu lời bài hát vào state và cập nhật input
      //     const lyricsText = metadata.common.lyrics.map(lyric => lyric.text).join('\n');
      //     console.log("Lyrics: ", lyricsText);
      //     setLyrics(lyricsText); // Cập nhật state lyrics
      //     setValue("lyrics", lyricsText); // Cập nhật giá trị của form
      //     console.log("Updated form value: ", getValues("lyrics"));
      //   } else {
      //     console.log("No lyrics found in the file");
      //   }
      // } catch (error) {
      //   console.error("Error reading metadata:", error);
      // }
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
    setGenres(genre);
    const artist = await getArtists();
    setArtists(artist);
    const album = await getAlbums();
    setAlbums(album);
  }

  useEffect(() => {
    data();
  }, [])

  useEffect(() => {
    if (selectedMainGenre) {
      const mainGenre = Genres.find(genre => genre.id === selectedMainGenre.value);
      setSubGenreOptions(mainGenre ? mainGenre.subgenres : []);
    } else {
      setSubGenreOptions([]);
    }
  }, [selectedMainGenre, Genres]);

  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return; 

    const formData = new FormData();
    formData.append('title', data.title);
    const artistValues = data.artistIds.map(artist => ({
      id: artist.value,
      name: artist.label,
    }));

    formData.append('artistIds', JSON.stringify(artistValues)); // Lưu artistIds
    const albumValues = data.albumIds.map(album => ({
      id: album.value,
      name: album.label,
    }));

    formData.append('albumIds', JSON.stringify(albumValues)); // Lưu albumIds
    const genreValues = {
      id: selectedMainGenre ? selectedMainGenre.value : null,
      name: selectedMainGenre ? selectedMainGenre.label : null,
      subgenres: selectedSubGenre ? selectedSubGenre.map(sub => ({
        id: sub.value,
        name: sub.label,
      })) : [], // Nếu không có subgenre, trả về mảng rỗng
    };
    formData.append('genreIds', JSON.stringify(genreValues));

    formData.append('playcountId', 0);
    formData.append('lyrics',data.lyrics);
    formData.append('releasedate', data.releasedate);
    formData.append('duration', data.duration);
    formData.append('is_explicit', data.is_explicit);
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

  const mainGenreOptions = Genres.map(genre => ({
    value: genre.id,
    label: genre.name,
  }));

  // Tạo option cho thể loại con
  const subGenreOptionsMapped = subGenreOptions.map(subgenre => ({
    value: subgenre.id,
    label: subgenre.name,
  }));

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
                name="artistIds"
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
              {errors.artistIds && <small className="text-red-500 mt-1 ml-2 block">{errors.artistIds.message}</small>}
            </div>
            <div>
              <Controller
                name="genreIds"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Genre"
                    id="mainGenre"
                    options={mainGenreOptions}
                    value={field.value}
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption);
                      setSelectedMainGenre(selectedOption);
                      setSelectedSubGenre(null); // Reset thể loại con khi thay đổi thể loại chính
                    }}
                  />
                )}
                rules={{ required: "Genre is required" }}
              />
              {errors.genreIds && (
                <small className="text-red-500 mt-1 ml-2 block">{errors.genreIds.message}</small>
              )}
            </div>

            {selectedMainGenre && (
              <div>
                <Controller
                  name="subGenreId"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Subgenres"
                      id="subGenreId"
                      options={subGenreOptionsMapped}
                      value={field.value}
                      onChange={(selectedOption) => {
                        field.onChange(selectedOption);
                        setSelectedSubGenre(selectedOption); // Cập nhật thể loại con đã chọn
                      }}
                      isMulti
                    />
                  )}
                  rules={{ required: "Sub-genre is required" }}
                />

              </div>
            )}
            <div>
              <Controller
                name="albumIds"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Album"
                    id="album"
                    name="albumIds"
                    options={Albums.map((album) => ({
                      value: album.id, // Assuming album has an id property
                      label: album.title,
                    }))}
                    {...field}
                    isMulti
                  />
                )}
                rules={{ required: "Album is required" }}
              />
              {errors.albumIds && <small className="text-red-500 mt-1 ml-2 block">{errors.albumIds.message}</small>}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="releasedate"
                control={control}
                render={({ field }) => (
                  <DatePickerField
                    label="Release Date"
                    id="releasedate"
                    selected={field.value}
                    onChange={(date) => setValue("releasedate", date, { shouldValidate: true })}
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
            <div className="col-span-2">
              <Controller
                name="lyrics"
                control={control}
                render={({ field }) => (
                  <TextareaField
                    label="Lyric"
                    id="lyrics"
                    {...field} // Truyền tất cả props từ field
                    // value={lyrics} // Hiển thị lời bài hát từ state
                    // onChange={(e) => {
                    //   const value = e.target.value; // Lấy giá trị từ ô input
                    //   setLyrics(value); // Cập nhật state khi người dùng nhập
                    //   field.onChange(value); // Cập nhật giá trị của form
                    // }}
                  />
                )}
              />
              {/* {errors.lyrics && <small className="text-red-500 mt-1 ml-2 block">{errors.lyrics.message}</small>} */}
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
