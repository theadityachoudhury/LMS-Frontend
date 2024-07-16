import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import instance from "../Axios";
import Loader from "../Components/Loader";
import config from "../Config";
import { Eye, EyeOff } from "lucide-react";
import useToast from "../Hooks/useToast";

const ResetLink = () => {
  const { toastError, toastSuccess } = useToast();
  const { id } = useParams();
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [nav, setNav] = useState(false);

  const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
    //check for length minimum 8 and use regex to check for atleast one number and one special character and one uppercase letter and one lowercase letter
    if (e.target.id === "password") {
      if (
        e.target.value.length < 8 ||
        !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(e.target.value)
      ) {
        setErrors({
          ...errors,
          password:
            "Password must be atleast 8 characters long and contain atleast one number, one special character, one uppercase letter and one lowercase letter",
        });
      } else {
        setErrors({
          ...errors,
          password: "",
        });
      }
      setPassword(e.target.value);
    }
    if (e.target.id === "confirmPassword") {
      if (e.target.value !== password) {
        setErrors({
          ...errors,
          confirmPassword: "Passwords do not match",
        });
      } else {
        setErrors({
          ...errors,
          confirmPassword: "",
        });
      }
      setConfirmPassword(e.target.value);
    }
  };

  const isActiveLink = async () => {
    try {
      const { data } = await instance.get(`/api/auth/reset/${id}`);
      if (data.status === 200) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } catch (error) {
      //checking if error is an axios error or not
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    isActiveLink();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resetLoading) return;
    setResetLoading(true);
    if (password.length < 8) {
      setErrors({
        ...errors,
        password: "Password must be atleast 8 characters long",
      });
      setResetLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: "Passwords do not match",
      });
      setResetLoading(false);
      return;
    }

    try {
      const { data } = await instance.post(`/api/auth/reset/${id}`, {
        password,
      });
      if (data.status === 200) {
        toastSuccess("Password reset successful");
        setNav(true);
      } else {
        toastError(data.message);
      }
    } catch (error) {
      toastSuccess("Unable to reach out to server");
    } finally {
      setResetLoading(false);
    }
  };
  if (nav) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <Loader size={48} fullScreen />;
  }

  if (!loading && !isActive) {
    return (
      <div className="text-center relative w-full h-screen">
        <div className="space-y-5 text-4xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-bold text-center">Link Expired</h1>
          {/* Go home button */}
          <Link
            to="/reset"
            className="text-lg text-white hover:bg-white hover:text-black duration-150 ease-linear font-bold py-2 px-4 border border-white"
          >
            Get new link
          </Link>
        </div>
      </div>
    );
  }

  if (!loading && isActive)
    return (
      <div className="resetContainer">
        <div className="space-y-10 w-full">
          <div className="space-y-1">
            <div className="text-3xl font-semibold">
              Reset your <span className="font-bold">{config.APP_NAME}</span>{" "}
              account password
            </div>
            <p className="text-xl text-center">
              To continue your learning journey
            </p>
          </div>

          <div className="space-y-5 mx-5 sm:max-w-lg lg:max-w-lg sm:mx-auto">
            {/* <!-- Email Sign in --> */}
            <form className="space-y-5" onSubmit={handleSubmit}>
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
                      value={password}
                      onChange={handleChanges}
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
                    <div className="text-red-400">{errors.password}</div>
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
                      value={confirmPassword}
                      onChange={handleChanges}
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
                    <div className="text-red-400">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>
              {/* Submit */}
              <div>
                <button
                  className="w-full p-3 bg-white text-black text-xl disabled:cursor-not-allowed"
                  type="submit"
                  disabled={
                    resetLoading ||
                    errors.password.length != 0 ||
                    errors.confirmPassword.length != 0
                  }
                >
                  {resetLoading ? <Loader size={28} /> : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default ResetLink;
