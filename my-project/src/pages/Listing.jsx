import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const Listing = () => {
  const { id } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const listingsPerPage = 4;

  const nav = useNavigate();

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
  if(loading) return <div className="flex w-full-h-full justify-center items-center text-red-600 text-5xl">Loading...</div>//WIP loading Animation

  return (
    <>
      <div className='mt-10'>
        {listings.length > 0 && !loading ? (
          listings.map((x, i) => (
            <Link
              key={i}
              to={x._id}
              className='flex flex-col gap-4 max-w-full mx-5 lg:mx-96 my-5 items-center justify-center'
            >
              <Card
                image={x.imageUrls[0]}
                name={x.name}
                description={x.description}
              />
            </Link>
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

export default Listing;

const Card = ({ image, name, description }) => {
  return (
    <div className='flex flex-row border rounded-lg shadow-lg w-full max-w-full p-4 bg-slate-200/35 hover:opacity-90'>
      <div className='w-40 h-40'>
        <img
          src={image}
          alt={name}
          className='h-full w-full object-contain rounded-lg'
        />
      </div>
      <div className='flex flex-col justify-center ml-4'>
        <div className='text-xl font-semibold text-gray-800 mb-2'>{name}</div>
        <div className='text-gray-600 truncate'>{description}</div>
      </div>
    </div>
  );
};
