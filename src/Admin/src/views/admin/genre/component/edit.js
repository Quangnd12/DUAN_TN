import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import SelectField from "../../../../components/SharedIngredients/SelectField";
import { handleEdit } from "../../../../components/notification";
import TextareaField from "../../../../components/SharedIngredients/TextareaField";
import { updateGenre, getGenreById } from "../../../../../../services/genres";

const EditGenre = () => {
    const { id } = useParams();

    const { control, handleSubmit, setValue, watch, clearErrors, formState: { errors }, trigger, setError } = useForm({
        defaultValues: {
            name: "",
            description: "",
            image: null,
            subgenres: []
        }
    });

    useEffect(() => {
        initData();
    }, []);

    const initData = async () => {
        const data = await getGenreById(id);
        setValue("name", data.name);
        setValue("description", data.description);
        if (Array.isArray(data.subgenres)) {
            setValue("subgenres", data.subgenres.map(sub => ({ value: sub.name, label: sub.name })));
        }
        setValue("image", data.image);
        if (data.image) {
            setCoverImagePreview(data.image);  
        }

    };

    const options = [
        "pop", "R&B", "EDM", "country", "jazz", "blues", "classical",
        "reggae", "metal", "punk", "folk", "alternative rock", "soul",
        "disco", "techno", "trap", "dubstep", "indie rock", "k-pop",
        "funk", "latin", "reggaeton", "world music", "gospel", "ambient",
        "house", "grunge", "ska", "experimental", "dancehall", "psytrance",
        "chillwave", "hardcore", "progressive rock", "celtic", "synthwave",
        "new wave", "glam rock", "kwaito", "bossa nova", "afrobeat", "fado",
        "bluegrass", "glam metal", "grime",
        "Nhạc trẻ", "Nhạc trữ tình", "Nhạc bolero"
    ];


    const navigate = useNavigate();
    const [coverImagePreview, setCoverImagePreview] = useState(null);

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
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        const subgenresValues = data.subgenres.map((subgenre) => subgenre.value);
        formData.append('subgenres', subgenresValues);
        formData.append('image', data.image);


        const valid = await trigger();
        if (!valid) return; 
        console.log("FormData to send: ", formData);
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
                                name="subgenres"
                                control={control}
                                render={({ field }) => (
                                    <SelectField
                                        label="Subgenres"
                                        id="subgenres"
                                        name="subgenres"
                                        options={options.map((subgenres) => ({
                                            value: subgenres,
                                            label: subgenres,
                                        }))}
                                        {...field}
                                        isMulti
                                    />
                                )}
                                rules={{ required: "subgenres is required" }}
                            />
                            {errors.subgenres && <small className="text-red-500 mt-1 ml-2 block">{errors.subgenres.message}</small>}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-green-500">
                    <h2 className="text-xl font-semibold mb-4">Detailed Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Description */}
                        <div className="col-span-2">
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextareaField
                                        label="Description"
                                        id="description"
                                        name="description"
                                        {...field}
                                    />
                                )}
                                rules={{ required: "Description is required" }}
                            />
                            {errors.description && <small className="text-red-500 mt-1 ml-2 block">{errors.description.message}</small>}
                        </div>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg border-t-4 border-red-500">
                    <h2 className="text-xl font-semibold mb-4">Media Upload</h2>
                    <div className="grid grid-cols-1 gap-2">
                        <Controller
                            name="image"  // Đảm bảo tên trường này khớp với "image" trong onSubmit
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

export default EditGenre;
