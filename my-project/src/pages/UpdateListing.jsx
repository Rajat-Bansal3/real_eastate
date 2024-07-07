import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { app } from "../config";
import { FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UpdateListing = () => {
  const { currentUser } = useSelector((x) => x.user);
  const nav = useNavigate();
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [uploadError, setUplaodError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.id === "rent" || e.target.id === "sale") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const handleFileUpload = async (file) => {
    setLoading(true);
    setUplaodError(false);
    setFiles([]);
    if (
      files.length + formData.imageUrls.length > 0 &&
      files.length + formData.imageUrls.length < 7
    ) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeFiles(files[i]));
      }
      Promise.all(promises)
        .then((x) => {
          setFormData({ ...formData, imageUrls: formData.imageUrls.concat(x) });
          setUplaodError(false);
          setLoading(false);
        })
        .catch((e) => {
          setUplaodError(e);
          setLoading(false);
        });
    } else {
      setUplaodError(
        `${files.length} images uploaded should be more than 0 and less than 7`
      );
      setLoading(false);
    }
  };
  const handleImageDel = async (x, i) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((url, ind) => ind !== i),
    });

    const storage = getStorage(app);
    const desertRef = ref(storage, x);
    await deleteObject(desertRef);
  };

  const storeFiles = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const upload = uploadBytesResumable(storageRef, file);
      upload.on(
        "state_changed",
        (snap) => {
          const prog = (snap.bytesTransferred / snap.totalBytes) * 100;
          console.log(Math.round(prog * 100) / 100);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(upload.snapshot.ref).then((x) => {
            resolve(x);
          });
        }
      );
    });
  };

  const fetchListing = async () => {
    const response = await axios.get("/api/listing/get-listing/", {
      params: { id },
    });
    console.log(response.data);
    setFormData(response.data.listing);
  };
  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/api/listing/update-user-listing",
        formData,
        { params: {id} }
      );
      nav(`/listing/${response.data.newL._id}`)
    } catch (error) {}
  };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col  gap-4'>
        <div className='flex gap-4 flex-1 flex-col'>
          <input
            type='text'
            id='name'
            placeholder='Name...'
            className='border p-3 rounded-lg'
            maxLength='62'
            required
            minLength='10'
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            type='text'
            id='description'
            placeholder='Description...'
            className='border p-3 rounded-lg'
            maxLength='62'
            required
            minLength='10'
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type='text'
            id='address'
            placeholder='Address...'
            className='border p-3 rounded-lg'
            maxLength='62'
            required
            minLength='10'
            value={formData.address}
            onChange={handleChange}
          />
          <div className='flex gap-7 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                className='w-5'
                id='sale'
                checked={formData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='rent'
                className='w-5'
                id='rent'
                checked={formData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='parking'
                className='w-5'
                id='parking'
                checked={formData.parking}
                onChange={handleChange}
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='furnished'
                className='w-5'
                id='furnished'
                checked={formData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='offer'
                className='w-5'
                id='offer'
                checked={formData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-4 my-4'>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='bedrooms'
                max='10'
                min='1'
                className='p-3 rounded-lg border '
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <span>Beds</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='bathrooms'
                max='10'
                min='1'
                className='p-3 rounded-lg border '
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <span>Baths</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='regularPrice'
                min='50'
                max='100000000'
                className='p-3 rounded-lg border '
                value={formData.regularPrice}
                onChange={handleChange}
              />
              <div className='flex flex-col items-center'>
                <span>Regular Price</span>
                <span hidden={formData.type === "sale"} className='text-xs'>
                  {"($ / month)"}
                </span>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='discountPrice'
                max='1000000'
                min='50'
                className='p-3 rounded-lg border '
                value={formData.discountPrice}
                onChange={handleChange}
              />
              <div className=' flex flex-col items-center'>
                <span>Discounted price</span>
                <span hidden={formData.type === "sale"} className='text-xs'>
                  {"($ / month)"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col flex-1'>
          <p className='font-semibold'>
            Images:
            <span className='font-normal ml-2 text-gray-600'>
              The first Image will be cover image (max 6)
            </span>
          </p>
        </div>
        <div className='flex gap-4'>
          <input
            type='file'
            id=''
            className='p-3 border border-gray-300 rounded-lg w-full'
            multiple
            accept='images/*'
            onChange={(e) => {
              setFiles(e.target.files);
            }}
          />
          <button
            type='button'
            className='p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80 '
            onClick={handleFileUpload}
          >
            {loading ? "uplaoding.." : "upload"}
          </button>
        </div>
        <div className='flex flex-col items-center'>
          <p className='text-red-700'>{uploadError && `${uploadError}`}</p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((x, i) => {
              return (
                <div key={i}>
                  <div className='relative'>
                    <img
                      className='w-30 h-30 object-contain rounded-lg my-2 opacity-70'
                      src={x}
                      alt={`img${i}`}
                    />
                    <div
                      className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg cursor-pointer'
                      onClick={() => handleImageDel(x, i)}
                    >
                      <FiTrash2 className='text-red-600 font-bold  text-2xl' />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className='flex gap-5 justify-between my-auto text-center items-center'>
          <button
            type='submit'
            className='w-full bg-slate-600 p-3 text-white rounded-lg uppercase  hover:bg-slate-500  disabled:opacity-80'
          >
            Update Listing
          </button>
          <button
            className='w-full bg-red-600 p-3 text-white rounded-lg uppercase hover:bg-red-500  disabled:opacity-80'
            type='reset'
            onClick={(e) => {
              if (!window.confirm("Are you sure you want to clear the form?")) {
                e.preventDefault();
              }
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </main>
  );
};

export default UpdateListing;
