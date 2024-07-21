import { useRouter } from "next/router";
import { api } from "~/utils/api";
import nookies from "nookies";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import { useState } from "react";

const LoginPage = () => {
  const loginMutation = api.user.login.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await loginMutation.mutateAsync({ email, password }, {
        onSuccess: (data) => {
          console.log("Login successful");
          nookies.set(null, "authToken", data.token, {
            path: "/",
            sameSite: "lax",
          });
          router.push("/categories");
        },
        onError: (error) => {
          console.error(error);
          setErrorMessage( error.message || "Failed to log in.");
        },
        onSettled: () => {
          setIsLoading(false); 
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className="mt-8">
        <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} errorMessage={errorMessage}/>;
      </div>
    </>
  );
};

export default LoginPage;
