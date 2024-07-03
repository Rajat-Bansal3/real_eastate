import React from "react";

const CreateListing = () => {
  const handleChange = () => {};

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>
        CreateListing
      </h1>
      <form className='flex flex-col  gap-4'>
        <div className='flex gap-4 flex-1 flex-col'>
          <input
            type='text'
            id='name'
            placeholder='Name...'
            className='border p-3 rounded-lg'
            maxLength='62'
            required
            minLength='10'
          />
          <textarea
            type='text'
            id='description'
            placeholder='Description...'
            className='border p-3 rounded-lg'
            maxLength='62'
            required
            minLength='10'
          />
          <input
            type='text'
            id='address'
            placeholder='Address...'
            className='border p-3 rounded-lg'
            maxLength='62'
            required
            minLength='10'
          />
          <div className='flex gap-7 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' name='sale' className='w-5' id='sale' />
              <span>Sale</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' name='rent' className='w-5' id='rent' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='parking'
                className='w-5'
                id='parking'
              />
              <span>Parking Spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                name='furnished'
                className='w-5'
                id='furnished'
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' name='offer' className='w-5' id='offer' />
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
              />
              <span>Baths</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='regular_price'
                min='1'
                max='10'
                className='p-3 rounded-lg border '
              />
              <div className='flex flex-col items-center'>
                <span>Regular Price</span>
                <span className='text-xs'>{"($ / month)"}</span>
              </div>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                type='number'
                id='discount'
                max='1'
                min='10'
                className='p-3 rounded-lg border '
              />
              <div className=' flex flex-col items-center'>
                <span>Discounted price</span>
                <span className='text-xs'>{"($ / month)"}</span>
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
          />
          <button className='p-3 text-green-700 border border-green-700 rounded-lg hover:shadow-lg disabled:opacity-80 '>
            Uplaod
          </button>
        </div>
        <button className="w-full bg-slate-600 p-3 text-white rounded-lg uppercase hover:bg-slate-500 disabled:opacity-80">create listing</button>
      </form>
    </main>
  );
};

export default CreateListing;
