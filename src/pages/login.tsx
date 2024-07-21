import { useState } from "react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import nookies from 'nookies';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = api.user.login.useMutation();
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const result = await loginMutation.mutateAsync({ email, password });
      console.log(result)
      if (result) {
        nookies.set(null, 'authToken', result.token, {
          path: "/",
          sameSite: "lax",
          });
        router.push("/categories");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
