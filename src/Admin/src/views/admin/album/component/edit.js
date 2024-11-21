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
      artistID: null,
      releaseDate: null,
      image: null,
    }
  });

  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [artists, setArtists] = useState([]);

  const validateTitle = (value) => {
    if (!value) return "Vui lòng nhập tên album";
    if (value.length < 1) return "Tên album không được để trống";
    if (value.length > 100) return "Tên album không được vượt quá 100 ký tự";
    if (/[<>:"/\\|?*]/.test(value)) return "Tên album chứa ký tự không hợp lệ";
    return true;
  };

  const validateReleaseDate = (date) => {
    if (!date) return "Vui lòng chọn ngày phát hành";

    // Lấy ngày hiện tại ở múi giờ Việt Nam
    const today = new Date();
    const vietnamTime = new Date(today.getTime() + (7 * 60 * 60 * 1000));
    vietnamTime.setHours(0, 0, 0, 0);

    // Chuyển đổi ngày được chọn sang múi giờ Việt Nam
    const releaseDate = new Date(date);
    const releaseDateVN = new Date(releaseDate.getTime() + (7 * 60 * 60 * 1000));
    releaseDateVN.setHours(0, 0, 0, 0);

    if (releaseDateVN < vietnamTime) return "Ngày phát hành không được nằm trong quá khứ";
    return true;
  };

  const validateImage = (file) => {
    if (file) {
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!acceptedTypes.includes(file.type)) {
        return "Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc GIF";
      }
      if (file.size > 5 * 1024 * 1024) {
        return "Kích thước ảnh không được vượt quá 5MB";
      }
    }
    return true;
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const [albumData, artistData] = await Promise.all([
          getAlbumById(id),
          getArtists()
        ]);

        if (albumData) {
          setValue("title", albumData.title || "");
          setCoverImagePreview(albumData.image);

          if (albumData.releaseDate) {
            // Chuyển đổi ngày phát hành sang múi giờ Việt Nam khi load dữ liệu
            const releaseDate = new Date(albumData.releaseDate);
            const releaseDateVN = new Date(releaseDate.getTime() + (7 * 60 * 60 * 1000));
            setValue("releaseDate", releaseDateVN);
          }

          setValue("artistID", { value: albumData.artistID, label: albumData.artistName });
        }

        if (artistData && artistData.artists) {
          setArtists(artistData.artists);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Có lỗi xảy ra khi tải thông tin album. Vui lòng thử lại!");
      }
    };

    initData();
  }, [id, setValue]);

  const handleDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const validationResult = validateImage(file);
    if (validationResult !== true) {
      alert(validationResult);
      return;
    }

    setValue("image", file);
    try {
      const objectURL = URL.createObjectURL(file);
      setCoverImagePreview(objectURL);
    } catch (error) {
      console.error("Lỗi khi tạo preview ảnh:", error);
    }
    clearErrors("image");
  }, [setValue, clearErrors]);

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    const valid = await trigger();
    if (!valid) {
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);

    if (Array.isArray(data.artistID)) {
      data.artistID.map((artist) => artist.value)
        .forEach((id) => formData.append("artistID[]", id));
    } else {
      formData.append("artistID[]", data.artistID.value);
    }

    if (data.releaseDate) {
      // Chuyển đổi ngày sang múi giờ Việt Nam trước khi gửi
      const releaseDate = new Date(data.releaseDate);
      const releaseDateVN = new Date(releaseDate.getTime() + (7 * 60 * 60 * 1000));
      formData.append("releaseDate", releaseDateVN.toISOString().split("T")[0]);
    }

    if (data.image) {
      formData.append("image", data.image);
    }

    try {
      await updateAlbum(id, formData);
      navigate("/admin/album");
      handleEdit();
    } catch (error) {
      console.error("Lỗi khi cập nhật album:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Có lỗi xảy ra khi cập nhật album. Vui lòng thử lại!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
          <h2 className="text-xl font-semibold mb-4">Thông tin Album</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Controller
                name="title"
                control={control}
                rules={{ validate: validateTitle }}
                render={({ field }) => (
                  <InputField label="Tên Album" id="title" {...field} />
                )}
              />
              {errors.title && (
                <small className="text-red-500 mt-1 ml-2 block">
                  {errors.title.message}
                </small>
              )}
            </div>
            <div>
              <Controller
                name="artistID"
                control={control}
                rules={{
                  required: "Vui lòng chọn ít nhất một nghệ sĩ",
                  validate: (value) =>
                    value && (Array.isArray(value) ? value.length > 0 : true) ||
                    "Vui lòng chọn ít nhất một nghệ sĩ",
                }}
                render={({ field }) => (
                  <SelectField
                    label="Nghệ sĩ"
                    id="artist"
                    options={artists.map((artist) => ({
                      value: artist.id,
                      label: artist.name,
                    }))}
                    isMulti
                    {...field}
                  />
                )}
              />
              {errors.artistID && (
                <small className="text-red-500 mt-1 ml-2 block">
                  {errors.artistID.message}
                </small>
              )}
            </div>
            <div>
              <Controller
                name="releaseDate"
                control={control}
                rules={{ validate: validateReleaseDate }}
                render={({ field }) => (
                  <DatePickerField
                    label="Ngày Phát Hành"
                    id="releaseDate"
                    selected={field.value}
                    onChange={(date) =>
                      setValue("releaseDate", date, { shouldValidate: true })
                    }
                  />
                )}
              />
              {errors.releaseDate && (
                <small className="text-red-500 ml-2 block">
                  {errors.releaseDate.message}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
          <h2 className="text-xl font-semibold mb-4">Ảnh Bìa Album</h2>
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
                <p className="text-center text-gray-600">
                  Kéo thả ảnh vào đây hoặc nhấp để chọn ảnh
                </p>
                {watch("image") && (
                  <p className="text-center text-green-500 mt-2">
                    Đã chọn: {watch("image")?.name}
                  </p>
                )}
                {coverImagePreview && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={coverImagePreview}
                      alt="Xem trước"
                      className="w-32 h-32 object-cover rounded-md border-2 border-gray-300"
                    />
                  </div>
                )}
                {errors.image && (
                  <small className="text-red-500 mt-2 block">
                    {errors.image.message}
                  </small>
                )}
              </div>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/album")}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAlbum;