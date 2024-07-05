import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const UserListing = () => {
  const { id } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const listingsPerPage = 4;

  const nav = useNavigate();

  const handleDelete = async (e, listId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.delete(`/api/listing/delete-user-listings`, {
        params: { id, listId },
      });
      console.log(response.data);
      fetchListings(currentPage);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    console.log("clicker");
  };
  const handleUpdate = (e, listId) => {
    e.preventDefault();
    e.stopPropagation();
    nav(`/update-listing/${listId}`);
  };

  const fetchListings = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/listing/show-user-listings/${id}`,
        {
          params: { page, limit: listingsPerPage },
        }
      );
      setListings(response.data.listings);
      setTotalPages(Math.ceil(response.data.totalListings / listingsPerPage));
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings(currentPage);
  }, [id, currentPage]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  if (loading)
    return (
      <div className='flex w-full-h-full justify-center items-center text-red-600 text-5xl'>
        Loading...
      </div>
    ); //WIP loading Animation

  return (
    <>
      <div className='mt-10'>
        {listings.length > 0 && !loading ? (
          listings.map((x, i) => (
            <div
              key={i}
              onClick={() => {
                nav(`/listing/${x._id}`);
              }}
              className='flex flex-col gap-4 max-w-full mx-5 lg:mx-96 my-5 items-center justify-center'
            >
              <Card
                image={x.imageUrls[0]}
                name={x.name}
                description={x.description}
                handleDelete={handleDelete}
                handleUpdate={handleUpdate}
                id={x._id}
              />
            </div>
          ))
        ) : (
          <div className='flex w-full-h-full justify-center items-center text-red-600 hover:text-red-500'>
            No Listings Found{" "}
            <div
              onClick={() => {
                nav("/create-listing");
              }}
            >
              Create One Now
            </div>
          </div>
        )}
      </div>
      <div className='flex justify-center mt-5'>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className='px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50'
        >
          Previous
        </button>
        <span className='px-4 py-2'>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className='px-4 py-2 mx-2 bg-gray-300 rounded disabled:opacity-50'
        >
          Next
        </button>
      </div>
    </>
  );
};

export default UserListing;

const Card = ({ image, name, description, handleDelete, handleUpdate, id }) => {
  return (
    <div className='flex flex-row border rounded-lg shadow-lg w-full max-w-full p-4 bg-slate-200/35 hover:bg-slate-200/50'>
      <div className='w-40 h-40  '>
        <img
          src={image}
          alt={name}
          className='h-full w-full object-contain rounded-full border-4'
        />
      </div>
      <div className='flex flex-col justify-center ml-4 flex-grow'>
        <div className='text-xl font-semibold text-gray-800 mb-2'>{name}</div>
        <div className='text-gray-600 truncate'>{description}</div>
      </div>
      <div className='flex flex-col justify-center flex-shrink-0 ml-4'>
        <button
          onClick={(e) => handleDelete(e, id)}
          className='mb-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400'
        >
          Delete
        </button>
        <button
          onClick={(e) => handleUpdate(e, id)}
          className='mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400'
        >
          Edit
        </button>
      </div>
    </div>
  );
};
