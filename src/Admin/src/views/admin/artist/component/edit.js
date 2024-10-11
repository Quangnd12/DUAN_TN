import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import { handleEdit } from "../../../../components/notification";

const EditArtist = () => {

  const { id } = useParams();

  const { control, handleSubmit, setValue, watch, clearErrors, getValues, formState: { errors }, trigger, setError } = useForm({
    defaultValues: {
      name: "",
      role: "",
      cover_image: null,
    }
  });

  const navigate = useNavigate();
  const [coverImagePreview, setCoverImagePreview] = useState(null);


  useEffect(() => {
    const songData = {
      name: "Sơn Tùng",
      role: "Artist 1",
      cover_image: "https://th.bing.com/th/id/OIP.5sdXslc5LTHn1l0WpI-n9AHaHa?rs=1&pid=ImgDetMain",
    };

    setValue("name", songData.name);
    setValue("role", songData.role);
    setCoverImagePreview(songData.cover_image);
  }, [id, setValue]);

  const handleDrop = useCallback((acceptedFiles, name) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (name === "cover_image") {
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


  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "cover_image"),
      accept: "image/*",
    });

  const handleCancel = () => {
    navigate("/admin/song"); // Điều hướng về trang list.js
  };


  const onSubmit = async (data) => {
    const valid = await trigger();
    if (!valid) return;
    if (!data.cover_image) {
      console.log("Cover image is required");
      setError("cover_image", { type: "manual", message: "Cover image is required" });
      return;
    }
    console.log(data);
    handleEdit();
  };


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Name"
                    id="name"
                    name="name"
                    {...field}
                  />
                )}
                rules={{
                  validate: (value) => {
                    if (!value) return "name is required";
                    if (value.length < 1 || value.length > 100) return "name must be between 1 and 100 characters";
                    const invalidCharacters = /[<>:"/\\|?*]/;
                    if (invalidCharacters.test(value)) return "name contains invalid characters";
                    return true;
                  }
                }}
              />
              {errors.name && <small className="text-red-500 mt-1 ml-2 block">{errors.name.message}</small>}
            </div>
            <div>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <InputField
                    label="Role"
                    id="role"
                    name="role"
                    {...field}
                  />
                )}
                rules={{ required: "role is required" }}
              />
              {errors.role && <small className="text-red-500 mt-1 ml-2 block">{errors.role.message}</small>}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Media Upload</h2>
          <div className="grid grid-cols-1 gap-2">
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

export default EditArtist;