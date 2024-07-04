import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Listing = () => {
  const { id } = useParams();
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const response = await axios.get(`/api/listing/show-user-listings/${id}`);
    console.log(response.data);
    setListings(response.data.listings);
  };

  useEffect(() => {
    fetchListings();
  }, [id]);

  return (
    <>
      <div className=''>
        <div className=''>{listings.map((x, i) => {})}</div>
      </div>
    </>
  );
};

export default Listing;
