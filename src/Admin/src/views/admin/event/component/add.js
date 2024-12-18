import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import {
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from "@mui/material";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { handleAdd } from "../../../../components/notification";
import {
  useCreateEventMutation,
  useGetAllArtistsQuery,
} from "../../../../../../redux/slice/eventSlice";
import { useNavigate } from "react-router-dom";
import SelectField from "../../../../components/SharedIngredients/SelectField";

const EventAdd = () => {
  const navigate = useNavigate();
  const [createEvent] = useCreateEventMutation();
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: artistsData = { artists: [] } } = useGetAllArtistsQuery();
  const artistOptions = artistsData.artists.map((artist) => ({
    value: artist.id,
    label: artist.name,
  }));

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      artists: [],
      startTime: "",
      endTime: "",
      location: "",
      eventCategory: "",
      description: "",
      image: null,
    },
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      accept: "image/*",
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        setValue("image", file);

        // Image preview
        const reader = new FileReader();
        reader.onload = () => {
          setCoverImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      },
    });

  const getCurrentDateTimeLocalFormat = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Đảm bảo status luôn có giá trị
      const finalData = {
        ...data,
        status: "upcoming",
        artists: data.artists.map((artist) => ({ id: artist.value })),
      };

      const formData = new FormData();
      Object.keys(finalData).forEach((key) => {
        if (key === "image" && finalData[key]) {
          formData.append("coverImage", finalData[key]);
        } else if (key === "artists") {
          finalData[key].forEach((artist) => {
            formData.append("artistIds", artist.id);
          });
        } else if (key !== "image") {
          formData.append(key, finalData[key]);
        }
      });

      await createEvent(formData).unwrap();
      handleAdd();
      navigate("/admin/event");
    } catch (error) {
      if (
        error.status === 400 &&
        error.data?.message === "An event with this name already exists"
      ) {
        setError("name", {
          type: "manual",
          message: "An event with this name already exists",
        });
      } else {
        console.error("Failed to create event", error);
        // Xử lý các lỗi khác nếu cần
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-1">
      <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg p-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Create New Event
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Event name is required",
                minLength: {
                  value: 3,
                  message: "Event name must be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Name"
                  variant="outlined"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputLabelProps={{
                    style: {
                      top: "15px", 
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                      marginTop: "24px"
                    },
                  }}
                />
              )}
            />

            <Controller
              name="artists"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label="Artists"
                  id="artists"
                  name="artists"
                  options={artistOptions}
                  value={value}
                  onChange={onChange}
                  isMulti={true}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="startTime"
              control={control}
              rules={{
                required: "Start time is required",
                validate: (value) => {
                  const inputDate = new Date(value);
                  const currentDate = new Date();

                  // Kiểm tra nếu ngày nhập vào nhỏ hơn ngày hiện tại
                  if (inputDate < currentDate) {
                    return "Start time must be in the present or future";
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Time"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true, }}
                  inputProps={{
                    min: getCurrentDateTimeLocalFormat(),
                    step: 60,
                  }}
                  error={!!errors.startTime}
                  helperText={errors.startTime?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                    },
                  }}
                />
              )}
            />

            <Controller
              name="endTime"
              control={control}
              rules={{
                required: "End time is required",
                validate: (value) => {
                  const startTime = watch("startTime");
                  const inputDate = new Date(value);
                  const currentDate = new Date();
                  const startDate = new Date(startTime);

                  // Kiểm tra nếu ngày nhập vào nhỏ hơn ngày hiện tại
                  if (inputDate < currentDate) {
                    return "End time must be in the present or future";
                  }

                  // Kiểm tra end time phải sau start time
                  if (startTime && inputDate <= startDate) {
                    return "End time must be after start time";
                  }

                  return true;
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Time"
                  type="datetime-local"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    min: watch("startTime") || getCurrentDateTimeLocalFormat(),
                    step: 60,
                  }}
                  error={!!errors.endTime}
                  helperText={errors.endTime?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Controller
              name="eventCategory"
              control={control}
              rules={{ required: "Event category is required" }}
              render={({ field }) => (
                <FormControl
                  variant="outlined"
                  fullWidth
                  error={!!errors.eventCategory}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                    },
                    "& .MuiInputLabel-root": {
                      top: "-10px",
                    },
                  }}
                >
                  <InputLabel>Event Category</InputLabel>
                  <Select {...field} label="Event Category">
                    <MenuItem value="concert">Concert</MenuItem>
                  </Select>
                  {errors.eventCategory && (
                    <small className="text-red-500 mt-2">
                      {errors.eventCategory.message}
                    </small>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="location"
              control={control}
              rules={{
                required: "Location is required",
                minLength: {
                  value: 3,
                  message: "Location must be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  variant="outlined"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "38px",
                    },
                    "& .MuiInputLabel-root": {
                      top: "-10px", 
                    },
                  }}
                />
              )}
            />
          </div>

          <div className="flex justify-center mb-6">
            <Controller
              name="image"
              control={control}
              rules={{ required: "Cover image is required" }}
              render={({ field }) => (
                <div
                  {...getImageRootProps()}
                  className={`w-full p-6 border-2 border-dashed ${
                    errors.image ? "border-red-600" : "border-gray-400"
                  } rounded-md cursor-pointer hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500`}
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
                  {errors.image && (
                    <small className="text-red-500 mt-2">
                      {errors.image.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>

          <Controller
            name="description"
            control={control}
            rules={{
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            }}
            render={({ field }) => (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description
                </label>
                <CKEditor
                  editor={ClassicEditor}
                  data={field.value}
                  config={{
                    toolbar: [
                      'heading', 'bold', 'italic', 'underline', '|',
                      'blockQuote', 'link', 'bulletedList', 'numberedList', '|',
                      'highlight', 'undo', 'redo',
                    ],
                    highlight: {
                      options: [
                        { model: 'yellowMarker', class: 'marker-yellow', title: 'Yellow Highlight', color: 'yellow', type: 'marker' },
                        { model: 'greenMarker', class: 'marker-green', title: 'Green Highlight', color: 'green', type: 'marker' }
                      ],
                    },
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    field.onChange(data);
                  }}
                />
                {errors.description && (
                  <small className="text-red-500 mt-2">
                    {errors.description.message}
                  </small>
                )}
              </>
            )}
          />

          <div className="flex justify-between items-center">
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/admin/event")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Create Event"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventAdd;
