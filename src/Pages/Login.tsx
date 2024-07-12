import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../Schema/Auth";
import { useUserContext } from "../Hooks/useUserContext";
import sleep from "../Utils/sleep";
import Loader from "../Components/Loader";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import useToast from "../Hooks/useToast";

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toastError } = useToast();

  const { user, authenticated, login, ready, error, signInWithGoogle } =
    useUserContext();

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

  const responseMessage = (response: TokenResponse) => {
    signInWithGoogle(response.access_token);
  };
  const googleError = () => {
    toastError("Failed to login with Google");
    setGoogleLoading(false);
  };

  const oauthGoogleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => responseMessage(codeResponse),
    onError: () => googleError(),
    onNonOAuthError: () => googleError(),
  });

  if (ready && authenticated && user) {
    if (callback) {
      return <Navigate to={callback} />;
    }
    return <Navigate to="/" />;
  }

  if (ready && !authenticated)
    return (
      <div className="loginContainer">
        <div className="space-y-10 w-full">
          <div className="space-y-1">
            <div className="text-3xl font-semibold">
              Login to <span className="font-bold">Learnly.</span>
            </div>
            <p className="text-xl text-center">
              To continue your learning journey
            </p>
          </div>

          <div className="space-y-5 mx-5 sm:max-w-lg lg:max-w-lg sm:mx-auto">
            {/* <!-- Social Sign in --> */}
            <div className="space-y-2">
              {/* <GoogleLogin
                ux_mode="popup"
                theme="outline"
                useOneTap
                logo_alignment="center"
                shape="rectangular"
                onSuccess={responseMessage}
                onError={googleError}
              /> */}

              <div
                className="bg-white text-black p-3 cursor-pointer hover:bg-indigo-600 hover:text-gray-100 duration-150 ease-linear"
                onClick={() => {
                  setGoogleLoading(true);
                  oauthGoogleLogin();
                }}
              >
                {googleLoading ? (
                  <Loader size={28} />
                ) : (
                  <p className="flex text-xl space-x-2">
                    <img
                      src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                      height={30}
                      width={30}
                      alt=""
                    />
                    <p>Continue with Google</p>
                  </p>
                )}
              </div>
            </div>

            {/* <!-- OR --> */}
            <div className="">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-gray-300 w-1/2"></div>
                <div className="text-gray-400">or</div>
                <div className="h-px bg-gray-300 w-1/2"></div>
              </div>
            </div>

            {/* <!-- Email Sign in --> */}
            <form className="space-y-5">
              {/* Email/Username */}
              <div className="">
                <div className="flex flex-col text-left space-y-2">
                  <label htmlFor="email-username" className="text-lg">
                    Email/Username
                  </label>
                  <input
                    type="text"
                    id="email-username"
                    placeholder="Email or Username"
                    className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                    {...register("email")}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                  />
                </div>
                <div className="text-left">
                  {errors.email && (
                    <div className="text-red-400">{errors.email.message}</div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex flex-col text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="password" className="text-lg">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-blue-500 text-lg"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Password"
                      className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                      {...register("password")}
                    />
                    <div
                      className="absolute right-2 top-3 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  {errors.password && (
                    <div className="text-red-400">
                      {errors.password.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  className="w-full p-3 bg-white text-black text-xl"
                  onClick={handleSubmit(onSubmit)}
                >
                  {loading ? <Loader size={28} /> : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Login;
