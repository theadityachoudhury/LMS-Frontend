import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useUserContext } from "../Hooks/useUserContext";
import Loader from "../Components/Loader";
import useToast from "../Hooks/useToast";
import instance from "../Axios";

const Reset = () => {
  const [loading, setLoading] = useState(false);
  const [recognition, setRecognition] = useState<{
    email?: string;
    username?: string;
  }>({});
  const { toastError, toastSuccess } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, authenticated, ready } = useUserContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await instance.post("/api/auth/reset", {
        recognition,
      });

      if (data.status === 200) {
        toastSuccess(data.message);
        if (inputRef.current) inputRef.current.value = "";
      } else {
        toastError(data.message);
      }
    } catch (error) {
      toastError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const isEmail = /\S+@\S+\.\S+/.test(value);
    if (isEmail) {
      setRecognition({ email: value });
    } else {
      setRecognition({ username: value });
    }
  };

  if (ready && authenticated && user) {
    return <Navigate to="/" />;
  }

  if (ready && !authenticated)
    return (
      <div className="resetContainer">
        <div className="space-y-10 w-full">
          <div className="space-y-1">
            <div className="text-3xl font-semibold">
              Recover your <span className="font-bold">Learnly.</span> account
            </div>
            <p className="text-xl text-center">
              To continue your learning journey
            </p>
          </div>

          <div className="space-y-5 mx-5 sm:max-w-lg lg:max-w-lg sm:mx-auto">
            {/* <!-- Email Sign in --> */}
            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    autoComplete="off"
                    onChange={handleChange}
                    ref={inputRef}
                  />
                </div>
              </div>

              {/* Submit */}
              <div>
                <button
                  className="w-full p-3 bg-white text-black text-xl"
                  type="submit"
                >
                  {loading ? <Loader size={28} /> : "Recover account"}
                </button>
              </div>

              {/* <!-- Register --> */}
              <div className="text-center text-lg">
                Remembered you password?{" "}
                <Link to="/login" className="text-blue-500">
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Reset;
