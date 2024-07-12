import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../Schema/Auth";
import { useUserContext } from "../Hooks/useUserContext";
import sleep from "../Utils/sleep";
import Loader from "../Components/Loader";
import { TokenResponse, useGoogleLogin } from "@react-oauth/google";
import useToast from "../Hooks/useToast";
import instance from "../Axios";

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toastError, toastSuccess } = useToast();
  const [nav, setNav] = useState(false);

  const { user, authenticated, ready, error, signInWithGoogle } =
    useUserContext();

  const [params] = useSearchParams();
  const callback = params.get("callback");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (formData: RegisterFormData) => {
    if (loading) return;
    setLoading(true);

    try {
      if (error.account || error.password || error.recognition) {
        throw new Error("Failed to register");
      }

      const { data } = await instance.post("/api/auth/register", {
        email: formData.email,
        username: formData.username,
        name: {
          first: formData.firstname,
          last: formData.lastname,
        },
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (data.status === 201) {
        toastSuccess("Successfully registered");
        await sleep(3000);
        setNav(true);
        reset();
      } else {
        toastError(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const responseMessage = (response: TokenResponse) => {
    signInWithGoogle(response.access_token);
  };

  const googleError = () => {
    toastError("Failed to register with Google");
    setGoogleLoading(false);
  };

  const oauthGoogleRegister = useGoogleLogin({
    onSuccess: (codeResponse) => responseMessage(codeResponse),
    onError: () => googleError(),
    onNonOAuthError: () => googleError(),
  });

  if ((ready && authenticated && user) || nav) {
    if (callback) {
      return <Navigate to={callback} />;
    }
    return <Navigate to="/login" />;
  }

  if (ready && !authenticated)
    return (
      <div className="registerContainer">
        <div className="space-y-10 w-full">
          <div className="space-y-1 text-center">
            <div className="text-3xl font-semibold">
              Register to <span className="font-bold">Learnly.</span>
            </div>
            <p className="text-xl">To continue your learning journey</p>
          </div>

          <div className="space-y-5 mx-5 sm:max-w-lg lg:max-w-lg sm:mx-auto">
            {/* <!-- Social Sign Up --> */}
            <div className="space-y-2">
              <div
                className="bg-white text-black p-3 cursor-pointer hover:bg-indigo-600 hover:text-gray-100 duration-150 ease-linear"
                onClick={() => {
                  setGoogleLoading(true);
                  oauthGoogleRegister();
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

            {/* <!-- Email Sign Up --> */}
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="">
                <div className="flex flex-col text-left space-y-2">
                  <label htmlFor="email" className="text-lg">
                    Email
                  </label>
                  <input
                    type="text"
                    id="email"
                    placeholder="Email"
                    className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                    {...register("email")}
                    autoComplete="off"
                  />
                </div>
                <div className="text-left">
                  {errors.email && (
                    <div className="text-red-400">{errors.email.message}</div>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="">
                <div className="flex flex-col text-left space-y-2">
                  <label htmlFor="username" className="text-lg">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                    {...register("username")}
                    autoComplete="off"
                  />
                </div>
                <div className="text-left">
                  {errors.username && (
                    <div className="text-red-400">
                      {errors.username.message}
                    </div>
                  )}
                </div>
              </div>

              {/* First Name */}
              <div className="">
                <div className="flex flex-col text-left space-y-2">
                  <label htmlFor="firstname" className="text-lg">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    placeholder="First Name"
                    className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                    {...register("firstname")}
                    autoComplete="off"
                  />
                </div>
                <div className="text-left">
                  {errors.firstname && (
                    <div className="text-red-400">
                      {errors.firstname.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="">
                <div className="flex flex-col text-left space-y-2">
                  <label htmlFor="lastname" className="text-lg">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    placeholder="Last Name"
                    className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                    {...register("lastname")}
                    autoComplete="off"
                  />
                </div>
                <div className="text-left">
                  {errors.lastname && (
                    <div className="text-red-400">
                      {errors.lastname.message}
                    </div>
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

              {/* Confirm Password */}
              <div>
                <div className="flex flex-col text-left space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="confirmPassword" className="text-lg">
                      Confirm Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm Password"
                      className="p-3 px-3 w-full border bg-black text-white placeholder:text-slate-500 text-md"
                      {...register("confirmPassword")}
                    />
                    <div
                      className="absolute right-2 top-3 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  {errors.confirmPassword && (
                    <div className="text-red-400">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  className="w-full p-3 bg-white text-black text-xl"
                  type="submit"
                >
                  {loading ? <Loader size={28} /> : "Register"}
                </button>
              </div>
            </form>

            {/* Already have an account */}
            <div>
              <p className="text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Register;
