import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import { handleEdit } from "../../../../components/notification";
import { updateGenre, getGenreById } from "../../../../../../services/genres";
import { getCountry } from "../../../../../../services/country";

const EditGenre = () => {
    const { id } = useParams();

    const { control, handleSubmit, setValue, watch, clearErrors, getValues, formState: { errors }, trigger, setError } = useForm({
        defaultValues: {
            name: "",
            countryID: null,
            image: null,
        }
    });

    const options = [
        "Pop", "R&B", "EDM", "Country", "Jazz", "Blues", "Classical", "Reggae", "Metal", "Punk",
        "Folk", "Alternative rock", "Soul", "Disco", "Techno", "Trap", "Dubstep", "Indie rock",
        "K-pop", "Funk", "Latin", "Reggaeton", "World music", "Gospel", "Ambient", "House",
        "Grunge", "Ska", "Experimental", "Dancehall", "Psytrance", "Chillwave", "Hardcore",
        "Progressive rock", "Celtic", "Synthwave", "New wave", "Glam rock", "Kwaito", "Bossa nova",
        "Afrobeat", "Fado", "Bluegrass", "Glam metal", "Grime", "Nhạc trẻ", "Nhạc trữ tình", "Nhạc bolero", "V-POP", "Rock", "Rap", "J-POP"
    ];

    const OptionGenre = options.sort();

    const navigate = useNavigate();
    const [coverImagePreview, setCoverImagePreview] = useState(null);
    const [Country, setCountry] = useState([]);

    useEffect(() => {
        Data();
    }, []);

    const Data = async () => {
        try {
            const data = await getCountry();
            setCountry(data.countries);
            const DataGenre = await getGenreById(id);
            setValue('name', { value: DataGenre.name, label: DataGenre.name })
            setValue('countryID', { value: DataGenre.countryID, label: DataGenre.countryName })
            setCoverImagePreview(DataGenre.image);
        } catch (error) {
            console.log("Không tìm thấy dữ liệu");
        }
    };

    const handleDrop = useCallback((acceptedFiles, name) => {
        const file = acceptedFiles[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        if (name === "image") {
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

    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } =
        useDropzone({
            onDrop: (files) => handleDrop(files, "image"),
            accept: "image/*",
        });

    const handleCancel = () => {
        navigate("/admin/genre");
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        const countryIDValue = typeof data.countryID === 'object' ? data.countryID.value : data.countryID;
        formData.append('countryID', countryIDValue);
        const nameValue = typeof data.name === 'object' ? data.name.value : data.name;
        formData.append('name', nameValue);
        formData.append('image', data.image);
        try {
            await updateGenre(id, formData);
            navigate("/admin/genre");
            handleEdit();
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-blue-500">
                    <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        label="Name"
                                        id="name"
                                        name="name"
                                        options={OptionGenre.map((genre) => ({
                                            value: genre,
                                            label: genre,
                                        }))}
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
                                name="countryID"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        label="Country"
                                        id="countryID"
                                        name="countryID"
                                        options={Country.map((country) => ({
                                            value: country.id,
                                            label: country.name,
                                        }))}
                                        {...field}
                                        value={field.value}
                                    />
                                )}
                                rules={'Country is required'}
                            />
                            {errors.countryID && <small className="text-red-500 mt-1 ml-2 block">{errors.countryID.message}</small>}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
                    <h2 className="text-xl font-semibold mb-4">Media Upload</h2>
                    <div className="grid grid-cols-1 gap-2">
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
            </form>
        </div>
    );
};

export default EditGenre;
