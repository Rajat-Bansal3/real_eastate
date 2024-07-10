import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../config";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFail,
  deleteUserFail,
  deleteUserStart,
  deleteUserSuccess,
  signOutStart,
  signOutSuccess,
  signOutFail,
} from "../redux/user/user.slice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const nav = useNavigate();
  const { currentUser, loading, error } = useSelector((x) => x.user);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [errorUpload, setErrorUpload] = useState("");
  const uploadRef = useRef(null);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const upload = uploadBytesResumable(storageRef, file);

    upload.on(
      "state_changed",
      (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(prog * 100) / 100);
      },
      (error) => {
        setProgress(0);
        setErrorUpload(error.message);
      },
      () => {
        getDownloadURL(upload.snapshot.ref).then((downloadURL) => {
          setFormData((prevData) => ({ ...prevData, avatar: downloadURL }));
          setProgress(0);
        });
      }
    );
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    dispatch(updateUserStart());
    try {
      const response = await axios.put(
        `/api/user/update/${currentUser.ret._id}`,
        formData
      );
      dispatch(updateUserSuccess(response.data));
      setSuccess("user updated successfully");
    } catch (e) {
      dispatch(updateUserFail(e.response.data.message));
      setSuccess(null);
    }
  };
  const handleDelete = async () => {
    dispatch(deleteUserStart());
    const id = currentUser.ret._id;
    try {
      const response = await axios.delete(`/api/user/delete/${id}`);
      dispatch(deleteUserSuccess());
      nav("/sign-in");
    } catch (error) {
      dispatch(deleteUserFail(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      const id = currentUser.ret._id;
      dispatch(signOutStart());
      const response = await axios.get(`/api/auth/sign-out/${id}`);
      nav("/sign-in");
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFail());
    }
  };
  return (
    <>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>
          <input
            type='file'
            ref={uploadRef}
            hidden
            accept='image/*'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <img
            onClick={() => uploadRef.current.click()}
            src={formData.avatar ?? currentUser.ret.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />
          <p>
            {errorUpload ? (
              <span className='text-red-600 text-center'>{errorUpload}</span>
            ) : progress < 100 && progress < 0 ? (
              <span className='text-center text-slate-700'>{`uplaoding ${progress}`}</span>
            ) : progress === 100 && !errorUpload ? (
              <span className='text-green-600 text-center'>
                Image Uplaoding Sccessfull!!
              </span>
            ) : progress === 0 ? (
              ""
            ) : (
              ""
            )}
          </p>

          <input
            type='text'
            placeholder='username'
            defaultValue={currentUser.ret.username}
            id='username'
            className='border p-3 rounded-lg '
            onChange={handleChange}
          />
          <input
            type='email'
            disabled
            placeholder='email'
            id='email'
            defaultValue={currentUser.ret.email}
            className='border p-3 rounded-lg cursor-not-allowed hover:bg-gray-100'
          />
          <input
            type='password'
            placeholder='password'
            onChange={handleChange}
            id='password'
            className='border p-3 rounded-lg'
          />
          <button
            disabled={loading}
            className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? "Loading..." : "Update"}
          </button>
          <button
            disabled={loading}
            className='bg-green-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
            type="button"
            onClick={()=>{nav("/create-listing")}}
          >
            Create Listing
          </button>
          {error ? (
            <span className='text-red-500'>{error}</span>
          ) : success ? (
            <span className='text-green-500 text-center'>{`success`}</span>
          ) : (
            ""
          )}
        </form>
        <div className=' flex justify-between mt-5'>
          <span
            className='text-red-700 hover:text-red-500 cursor-pointer'
            onClick={handleDelete}
          >
            Delete Account
          </span>
          <span
            className='text-red-700 hover:text-red-500 cursor-pointer'
            onClick={handleSignOut}
          >
            Sign Out
          </span>
        </div>
      </div>
    </>
  );
};

export default Profile;
