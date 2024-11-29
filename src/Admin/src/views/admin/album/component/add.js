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
import LoadingSpinner from "Admin/src/components/LoadingSpinner";

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
  const [loading, setLoading] = useState(false);

  const validateTitle = (value) => {
    if (!value) return "Please enter album name";
    if (value.length < 1) return "Album name cannot be blank";
    if (value.length > 100) return "Album name cannot exceed 100 characters";
    if (/[<>:"/\\|?*]/.test(value)) return "The album name contains invalid characters";
    return true;
  };

  const validateReleaseDate = (date) => {
    if (!date) return "Please select a release date";

    const today = new Date();
    const vietnamTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));
    vietnamTime.setHours(0, 0, 0, 0);

    const releaseDate = new Date(date);
    const releaseDateVN = new Date(releaseDate.getTime() + (7 * 60 * 60 * 1000));
    releaseDateVN.setHours(0, 0, 0, 0);

    if (releaseDateVN < vietnamTime) return "The release date cannot be in the past";
    return true;
  };

  const validateImage = (file) => {
    if (!file) return "Please select album cover photo";
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!acceptedTypes.includes(file.type)) {
      return "Only accept JPG, PNG or GIF image files";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "Photo size must not exceed 5MB";
    }
    return true;
  };

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validationResult = validateImage(file);
    if (validationResult !== true) {
      alert(validationResult);
      return;
    }

    setValue("image", file);
    setCoverImagePreview(URL.createObjectURL(file));
    clearErrors("image");
  }, [setValue, clearErrors]);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistData = await getArtists();
        setArtists(artistData.artists);
      } catch (error) {
        console.error("Error loading artist list:", error);
      }
    };
    fetchArtists();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    data.artistID.map(artist => artist.value).forEach(id => formData.append("artistID[]", id));
    
    const releaseDate = new Date(data.releaseDate);
    const releaseDateVN = new Date(releaseDate.getTime() + (7 * 60 * 60 * 1000));
    formData.append("releaseDate", new Date(data.releaseDate).toISOString().split("T")[0]);

    formData.append("image", data.image);

    try {
      await addAlbum(formData);
      navigate("/admin/album");
      handleAdd();
    } catch (error) {
      console.error("Lỗi khi thêm album:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Có lỗi xảy ra khi thêm album. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

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
                rules={{ validate: validateTitle }}
                render={({ field }) => (
                  <InputField label="Album name" id="title" {...field} />
                )}
              />
              {errors.title && <small className="text-red-500 mt-1 ml-2 block">{errors.title.message}</small>}
            </div>
            <div>
              <Controller
                name="artistID"
                control={control}
                rules={{
                  required: "Please select at least one artist",
                  validate: value => value.length > 0 || "Please select at least one artist"
                }}
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
                rules={{ validate: validateReleaseDate }}
                render={({ field }) => (
                  <DatePickerField
                    label="Release Date"
                    id="releaseDate"
                    selected={field.value}
                    onChange={(date) => setValue("releaseDate", date, { shouldValidate: true })}
                    minDate={new Date()}
                  />
                )}
              />
              {errors.releaseDate && <small className="text-red-500 ml-2 block">{errors.releaseDate.message}</small>}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <div>
            <Controller
              name="image"
              control={control}
              rules={{ validate: validateImage }}
              render={() => (
                <div
                  {...getImageRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${errors.image ? "border-red-600" : "border-gray-400"
                    } rounded-md cursor-pointer hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <input {...getImageInputProps()} />
                  <p className="text-center text-gray-600">Drag and drop photos here or click to select photos</p>
                  {watch("image") && <p className="text-center text-green-500 mt-2">Đã chọn: {watch("image")?.name}</p>}
                  {coverImagePreview && (
                    <div className="mt-4 flex justify-center">
                      <img src={coverImagePreview} alt="Xem trước" className="w-32 h-32 object-cover rounded-md border-2 border-gray-300" />
                    </div>
                  )}
                  {errors.image && <small className="text-red-500 mt-2 block">{errors.image.message}</small>}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/album")}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAlbum;