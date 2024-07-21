import React from "react";
import InputField from "./InputField";

interface AuthFormProps {
  type: "signup" | "login";
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  onSubmit,
  isLoading,
  errorMessage,
}) => {
  return (
    <div className="mx-auto max-w-[576px] rounded-[20px] border border-gray-300 p-8">
      <h2 className="mb-6 text-center text-[2rem] font-semibold">
        {type === "signup" ? "Create your account" : "Login"}
      </h2>
      {type === "login" && (
        <div className="mb-6 flex flex-col items-center gap-1">
          <h3 className="text-2xl font-medium">Welcome back to ECOMMERCE</h3>
          <p className="text-base font-normal">
            The next gen business marketplace
          </p>
        </div>
      )}
      <form onSubmit={onSubmit}>
        {type === "signup" && (
          <InputField label="Name" type="text" id="name" name="name" required />
        )}
        <InputField
          label="Email"
          type="email"
          id="email"
          name="email"
          required
        />
        <InputField
          label="Password"
          type="password"
          id="password"
          name="password"
          required
          showButton={type === "signup" ? false : true}
        />
        {errorMessage && <p className="text-red-600">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black p-[12px] text-base text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          {isLoading
            ? "Loding..."
            : type === "signup"
              ? "CREAT ACCOUNT"
              : "LOGIN"}
        </button>
      </form>
      {type === "signup" ? (
        <p className="mt-4 text-center text-base font-normal text-[#333333]">
          Have an Account?{" "}
          <a href="/login" className="font-medium text-black">
            LOGIN
          </a>
        </p>
      ) : (
        <p className="mt-4 text-center text-base font-normal text-[#333333]">
          Don’t have an Account?{" "}
          <a href="/signup" className="font-medium text-black">
            SIGN UP
          </a>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
