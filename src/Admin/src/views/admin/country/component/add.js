import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import InputField from "../../../../components/SharedIngredients/InputField";
import { handleAdd } from "../../../../components/notification";
import { addCountry } from "services/country";

const AddCountry = () => {
    const { control, handleSubmit, setValue, watch, clearErrors, getValues, formState: { errors }, trigger, setError } = useForm({
        defaultValues: {
            name: "",
        }
    });

    const navigate = useNavigate();
  

    const handleCancel = () => {
        navigate("/admin/countries");
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        try {
            await addCountry(formData);
            navigate("/admin/countries");  
            handleAdd();              
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
                    <div className="col-span-2">
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

export default AddCountry;
