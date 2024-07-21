import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Navbar from "./components/Navbar";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState(Array(8).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { email } = router.query;
  const verifyOtpMutation = api.user.verifyOtp.useMutation();

  const inputRefs = useRef<HTMLInputElement[]>(Array(8).fill(null));

  const handleOtpChange = (index: number, value: any) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      //@ts-ignore
      inputRefs.current[index + 1].focus();
    }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const otpString = otp.join("");

    setIsLoading(true);
    verifyOtpMutation.mutate(
      //@ts-ignore
      { email, code: otpString },
      {
        onSuccess: () => {
          console.log("OTP verified successfully");
          router.push("/login");
        },
        onError: (error) => {
          setErrorMessage("Failed to verify OTP.");
        },
        onSettled: () => {
          setIsLoading(false);
        },
      },
    );
  };

  return (
    <>
      <Navbar />
      <div className="mx-auto mt-8 flex max-w-[576px] flex-col items-center justify-center rounded-[20px] border border-gray-300 p-12">
        <h2 className="mb-6 text-center text-[2rem] font-semibold">
          Verify your email
        </h2>
        <div className="mb-4 text-center">
          <div className="text-base font-normal">
            Enter the 8 digit code you have received on
          </div>
          <span className="text-base font-medium">{email}</span>
        </div>
        <form onSubmit={handleSubmit}>
          <span className="text-base font-normal">Code</span>
          <div className="flex gap-[10px]">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="h-[46px] w-[38px] rounded-md border text-center"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                //@ts-ignore
                ref={(el) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          <button
            type="submit"
            className="mt-8 w-full rounded-md bg-black p-[12px] text-base text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            disabled={isLoading || otp.length<8}
          >
            {isLoading ? "Loading..." : "VERIFY"}
          </button>
        </form>
      </div>
    </>
  );
};

export default VerifyOtpPage;
