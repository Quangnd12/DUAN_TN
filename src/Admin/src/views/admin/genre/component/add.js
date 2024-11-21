import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import { handleAdd } from "../../../../components/notification";
import { addGenre } from "../../../../../../services/genres";
import { getCountry } from "../../../../../../services/country";
import LoadingSpinner from "Admin/src/components/LoadingSpinner";

const AddGenre = () => {
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
    const [loading, setLoading] = useState(false);
   

    const CountryData = async () => {
        try {
            const data = await getCountry();
            setCountry(data.countries);
        } catch (error) {
            console.log("Không tìm thấy dữ liệu");
        }
    };

 useEffect(() => {
        CountryData();
    }, []);
    
    const handleDrop = useCallback((acceptedFiles, name) => {
        const file = acceptedFiles[0];
        if (!file) {
            console.error("No file selected");
            return;
        }
        if (name === "image") {
            setValue("image", file); // Store the file in the form value
            try {
                const objectURL = URL.createObjectURL(file);
                setCoverImagePreview(objectURL); // Display the preview
            } catch (error) {
                console.error("Failed to create object URL:", error);
            }
            clearErrors("image"); // Clear any existing image error
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
        const valid = await trigger();
        if (!valid) return; 
        setLoading(true);

        const formData = new FormData();
        const countryIDValue = typeof data.countryID === 'object' ? data.countryID.value : data.countryID;
        formData.append('countryID', countryIDValue);
        const nameValue = typeof data.name === 'object' ? data.name.value : data.name;
        formData.append('name', nameValue);       

        if (data.image) {
            formData.append('image', data.image); 

        } else {
            console.log("image is required");
            setError("image", { type: "manual", message: "image is required" });
            return;
        }

        try {
            await addGenre(formData);
            navigate("/admin/genre");
            handleAdd();
        } catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
          }
    };



    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
             <LoadingSpinner isLoading={loading} />
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
                                    {errors.image && <small className="text-red-500 mt-2">{errors.image.message}</small>}
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

export default AddGenre;
