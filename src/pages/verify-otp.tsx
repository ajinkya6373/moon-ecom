import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const { email } = router.query;
  const verifyOtpMutation = api.user.verifyOtp.useMutation();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      if(typeof email==="string"){
        const result = await verifyOtpMutation.mutateAsync({ email, code:otp });
        console.log(result);
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Verify OTP</h1>
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button type="submit">Verify</button>
    </form>
  );
};

export default VerifyOtpPage;
