import { useRouter } from "next/router";
import { api } from "~/utils/api";
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import { useState } from "react";

const SignupPage = () => {
  const registerMutation = api.user.register.useMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await registerMutation.mutateAsync(
        {
          name,
          email,
          password,
        },
        {
          onSuccess: () => {
            console.log("Registration successful");
            router.push("/verify-otp?email=" + email);
          },
          onError: (error) => {
            console.error(error);
            setErrorMessage(error.message||"Failed to register."); 
          },
          onSettled: () => {
            setIsLoading(false);
          },
        },
      );
    } catch (error) {
      console.error(error);
      // This catch block is redundant since onError handles errors
    }
  };

  return (
    <>
      <Navbar />
      <div className="mt-8">
        <AuthForm type="signup" onSubmit={handleSignup} isLoading={isLoading} errorMessage={errorMessage}/>;
      </div>
    </>
  );
};

export default SignupPage;
