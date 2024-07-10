import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFail,
  signInSuccess,
} from "../redux/user/user.slice.js";
import Oauth from "../Components/Oauth.jsx";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFromData] = useState({});
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFromData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(signInStart());

    try {
      const response = await axios.post("/api/auth/sign-in", formData);

      if (!response.success) {
        dispatch(signInFail(response.data.message));
      }

      dispatch(signInSuccess(response.data));
      navigate("/");
    } catch (e) {
      dispatch(signInFail(e.response.data.message));
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
          <Oauth/>
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
