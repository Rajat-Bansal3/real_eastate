import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFromData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/sign-in", formData);
      if (!response.success) {
        setLoading(false);
        console.log(response);
        setError(response.data.message);
      }
      setError("");
      setLoading(false);
      navigate("/sign-in");
    } catch (e) {
      setLoading(false);
      setError(e.response.data.message);
    }
  };
  return (
    <>
      <div className='max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7 '>Sign In</h1>
        <form
          className='flex flex-col justify-center gap-4 my-7 '
          onSubmit={handleSubmit}
        >
          <input
            type='email'
            placeholder='Email...'
            className='border p-3 rounded-lg'
            id='email'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='Password...'
            className='border p-3 rounded-lg'
            id='password'
            onChange={handleChange}
          />
          <button
            disabled={loading}
            type='submit'
            className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:bg-slate-500 disabled:opacity-80'
          >
            {loading ? "loading..." : `Submit Now`}
          </button>
          {/* <button className='bg-red-600 text-white p-3 rounded-lg uppercase hover:bg-red-500 disabled:opacity-80'>
            login with google
          </button> */}
        </form>
        <div className='flex gap-2 mt-5'>
          Don't Have an account?
          <Link className='text-blue-500 hover:text-blue-700' to={"/sign-up"}>
            SignUp
          </Link>
        </div>
        {error && <span className='text-red-400'>{error}</span>}
      </div>
    </>
  );
};

export default SignIn;
