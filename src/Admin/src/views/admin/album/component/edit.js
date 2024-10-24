import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import TextareaField from "../../../../components/SharedIngredients/TextareaField";
import DatePickerField from "../../../../components/SharedIngredients/DatePickerField";
import { updateAlbum, getAlbumById } from "../../../../../../services/albums";
import { getArtists } from "../../../../../../services/artists";
import { getSongs } from "../../../../../../services/songs";
import { handleEdit, handleError } from "../../../../components/notification";

const EditAlbum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [artistOptions, setArtistOptions] = useState([]);
  const [songOptions, setSongOptions] = useState([]);
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
      title: "",
      artistId: [],
      songId: [],
      describe: "",
      image: null,
      releaseDate: "",
      totalTracks: "",
      popularity: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch album data
        const album = await getAlbumById(id);
        if (album) {
          setValue("title", album.title);
          setValue("describe", album.describe);
          setValue("totalTracks", album.totalTracks);
          setValue("popularity", album.popularity);
          
          // Handle artists
          if (album.artistId) {
            const artistValues = album.artistId.map(artist => ({
              value: artist.id,
              label: artist.name
            }));
            setValue("artistId", artistValues);
          }

          // Handle songs
          if (album.songId) {
            const songValues = album.songId.map(song => ({
              value: song.id,
              label: song.title
            }));
            setValue("songId", songValues);
          }

          setValue("releaseDate", new Date(album.releaseDate));
          setCoverImagePreview(album.image);
        }

        // Fetch artists for dropdown
        const artists = await getArtists();
        const formattedArtistOptions = artists.artists.map(artist => ({
          value: artist.id,
          label: artist.name
        }));
        setArtistOptions(formattedArtistOptions);

        // Fetch songs for dropdown
        const songs = await getSongs();
        const formattedSongOptions = songs.songs.map(song => ({
          value: song.id,
          label: song.title
        }));
        setSongOptions(formattedSongOptions);

      } catch (error) {
        handleError("Lỗi khi tải dữ liệu album");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, setValue]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setValue("image", file);
      try {
        const objectUrl = URL.createObjectURL(file);
        setCoverImagePreview(objectUrl);
        clearErrors("image");
      } catch (error) {
        console.error("Error creating preview:", error);
      }
    },
    [setValue, clearErrors]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880, // 5MB
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      const isValid = await trigger();
      if (!isValid) {
        handleError("Please check the information again!");
        return;
      }

      // Format data before sending
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("describe", data.describe);
      formData.append("totalTracks", data.totalTracks);
      formData.append("popularity", data.popularity);
      formData.append("releaseDate", data.releaseDate.toISOString());

      // Handle artists
      const artistIds = data.artistId.map(artist => artist.value);
      formData.append("artistId", JSON.stringify(artistIds));

      // Handle songs
      const songIds = data.songId.map(song => song.value);
      formData.append("songId", JSON.stringify(songIds));

      // Add image only if new image is selected
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await updateAlbum(id, formData);
      handleEdit("Album update successful!");
      navigate("/admin/album");
    } catch (error) {
      handleError(error?.response?.data?.message || "Failed to edit album");
      console.error("Failed to update album:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="title"
              control={control}
              rules={{
                required: "Tên album không được để trống",
                minLength: {
                  value: 2,
                  message: "Tên album phải có ít nhất 2 ký tự"
                }
              }}
              render={({ field }) => (
                <div>
                  <InputField
                    label="Tên album"
                    placeholder="Nhập tên album"
                    error={errors.title?.message}
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              name="artistId"
              control={control}
              rules={{ required: "Vui lòng chọn nghệ sĩ" }}
              render={({ field }) => (
                <div>
                  <SelectField
                    label="Nghệ sĩ"
                    options={artistOptions}
                    isMulti
                    error={errors.artistId?.message}
                    {...field}
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-green-500">
          <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="totalTracks"
              control={control}
              rules={{
                required: "Số bài hát không được để trống",
                min: {
                  value: 1,
                  message: "Số bài hát phải lớn hơn 0"
                }
              }}
              render={({ field }) => (
                <div>
                  <InputField
                    type="number"
                    label="Số bài hát"
                    placeholder="Nhập số bài hát"
                    error={errors.totalTracks?.message}
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              name="songId"
              control={control}
              rules={{ required: "Vui lòng chọn bài hát" }}
              render={({ field }) => (
                <div>
                  <SelectField
                    label="Bài hát"
                    options={songOptions}
                    isMulti
                    error={errors.songId?.message}
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              name="releaseDate"
              control={control}
              rules={{ required: "Ngày phát hành không được để trống" }}
              render={({ field }) => (
                <div>
                  <DatePickerField
                    label="Ngày phát hành"
                    error={errors.releaseDate?.message}
                    {...field}
                  />
                </div>
              )}
            />

            <Controller
              name="popularity"
              control={control}
              render={({ field }) => (
                <div>
                  <InputField
                    type="number"
                    label="Độ phổ biến"
                    placeholder="Nhập độ phổ biến"
                    {...field}
                  />
                </div>
              )}
            />
          </div>

          <div className="mt-4">
            <Controller
              name="describe"
              control={control}
              rules={{ required: "Mô tả không được để trống" }}
              render={({ field }) => (
                <TextareaField
                  label="Mô tả"
                  placeholder="Nhập mô tả album"
                  error={errors.describe?.message}
                  {...field}
                />
              )}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Ảnh album</h2>
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {coverImagePreview ? (
                <div>
                  <img
                    src={coverImagePreview}
                    alt="Album preview"
                    className="mt-4 mx-auto h-32 w-32 object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Kéo thả hoặc click để thay đổi ảnh
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600">
                    Kéo thả hoặc click để tải ảnh lên
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    (Hỗ trợ: JPG, PNG, tối đa 5MB)
                  </p>
                </div>
              )}
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
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