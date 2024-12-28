import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api.client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

// Contains the form data for the fields
export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {showToast} = useAppContext();
    const { 
        register, 
        watch, 
        handleSubmit, 
        formState: { errors }, 
    } = useForm<RegisterFormData>();

    // calls the api register module and checks if the
    // api request went successfully or not
    const mutation = useMutation(apiClient.register, {
        onSuccess: async () => {
            showToast({message: "Registration Success!", type:"SUCCESS"});
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError: (error: Error) => {
            showToast({message: error.message, type:"ERROR"});
        }
    });

    // Gets the data on submission of the form
    // and calls the mutation method
    const onSubmit = handleSubmit((data)=> {
        mutation.mutate(data);
    });
    return (
        <form action="" className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Create an Account</h2>
            {/* Div to style both First and Last Names */}
            <div className="flex flex-col md:flex-row gap-5">
                {/* First Name Field and validation */}
                <label  className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input className="border rounded w-full py-1 px-2 font-normal" 
                    {...register("firstName", {required: "This field is required"})} />
                    {/* Error Message */}
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span>
                    )}
                </label>
                {/* Last Name Field and validation */}
                <label  className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input className="border rounded w-full py-1 px-2 font-normal"
                    {...register("lastName", {required: "This field is required"})} />
                    {/* Error Message */}
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>
            {/* Email field and validation */}
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input 
                type="email"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("email", {required: "This field is required"})} />
                {/* Error Message */}
                {errors.email && (
                        <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            {/* Password field and validation */}
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input 
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is required", 
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })} 
                />
                {/* Error Message */}
                {errors.password && (
                        <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            {/* Confirm password field and validation */}
            <label  className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input 
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required";
                            } else if (watch("password") !== val) {
                                return "Your passwords do not match";
                            }
                        }
                    })} 
                />
                {/* Error Message */}
                {errors.confirmPassword && (
                        <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}
            </label>

            <span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Create Account</button>
            </span>

        </form>
    );
};

export default Register;