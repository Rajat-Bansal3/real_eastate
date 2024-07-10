import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const { currentUser } = useSelector((x) => x.user);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/api/listing/${listing.ownerRef}`);
      console.log(res.data.user);
      setUser(res.data.user);
    };
    fetchUser();
  }, [currentUser]);

  return (
    <>
      {user && (
        <div className=' flex flex-col  gap-2 '>
          <p>
            Contact <span className='font-semibold mx-2'>{user.username}</span>
            for <span className='font-semibold lowercase'>{listing.name}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Message'
            className='w-full border p-3 rounded-lg'
          ></textarea>
          <Link
            to={`mailto:${user.email}?subject=regarding ${listing.name}&body=${message}`}
            className='bg-slate-600 text-white p-3 uppercase text-center rounded-lg '
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
