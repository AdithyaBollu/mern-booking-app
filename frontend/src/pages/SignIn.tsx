import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api.client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {
    const queryClient = useQueryClient();
    const {showToast} = useAppContext();
    const navigate = useNavigate();
    const { register, formState: { errors }, handleSubmit} = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.signIn, {
        onSuccess:async () => {
            // 1.Show the Toast
            showToast({message: "Sign in Successful!", type: "SUCCESS"});
            // 2. Navigate to home page
            await queryClient.invalidateQueries("validateToken");
            navigate("/");
        },
        onError:async (error:Error) => {
            // show the Error toast
            showToast({message: error.message, type: "ERROR"});
        },
    });

    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>

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
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Not Registered? <Link className="underline" to="/register">Create an account here</Link>
                </span>
                <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">Login</button>
            </span>
        </form>
    )
}

export default SignIn;