import { useState } from 'react';
import { useRouter } from 'next/router';
import { api } from "~/utils/api";


const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = api.user.register.useMutation();
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
        const result = await registerMutation.mutateAsync({ name, email, password })
        if(result){
            await router.push('/verify-otp?email=' + email);
        }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button type="submit">Create New Account</button>
    </form>
  );
};

export default SignupPage;
