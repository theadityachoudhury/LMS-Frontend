import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../Schema/Auth";
import { useUserContext } from "../Hooks/useUserContext";
import sleep from "../Utils/sleep";

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, authenticated, login, ready, error } = useUserContext();

  const [params] = useSearchParams();
  const callback = params.get("callback");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormData) => {
    if (loading) return;
    setLoading(true);

    // Check if the input is an email or username
    const isEmail = /\S+@\S+\.\S+/.test(data.email);
    const recognition: {
      email?: string;
      username?: string;
    } = {};
    if (isEmail) {
      recognition["email"] = data.email;
    } else {
      recognition["username"] = data.email;
    }

    try {
      await login({
        recognition,
        password: data.password,
      });
      if (
        error.account != null ||
        error.password != null ||
        error.recognition != null
      ) {
        throw new Error("Failed to login");
      }
      await sleep(3000);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    await trigger("email");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setValue("email", value);
    if (errors.email) {
      clearErrors("email");
    }
  };

  if (ready && authenticated && user) {
    if (callback) {
      return <Navigate to={callback} />;
    }
    return <Navigate to="/" />;
  }

  if (ready && !authenticated)
    return (
      <div className="flex h-screen justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-black">
        {/* <PageMeta title='CodeSync | Login' description='Login your account on CodeSync to collaborate on code in real-time with your team. Experience seamless, multi-user coding with our online code editor. Sign up now!' canonical={`${config.FRONTEND_URL}/login`} /> */}
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md m-1 sm:m-0">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-600">Login</h1>
            <p className="text-gray-600">Login below to access your account</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium text-gray-700"
              >
                Email or Username
              </label>
              <input
                type="text"
                {...register("email")}
                onBlur={handleEmailBlur}
                onChange={handleEmailChange}
                className="mt-1 block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your email or username"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-lg font-medium text-gray-700"
                >
                  Password
                </label>
                <Link to="/forgot" className="text-indigo-600 text-md">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
                  placeholder="Password"
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <Eye size={24} strokeWidth={1} />
                  ) : (
                    <EyeOff size={24} strokeWidth={1} />
                  )}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={`w-full bg-indigo-600 text-white text-lg font-bold py-2 rounded-md transition duration-300 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-gray-600 mt-4">
              Don't have an account?{" "}
              <Link
                to={callback ? `/register?callback=${callback}` : `/register`}
                className="text-indigo-600"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
};

export default Login;
