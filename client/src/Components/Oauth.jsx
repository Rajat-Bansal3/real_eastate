import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../config";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInFail,
  signInSuccess,
} from "../redux/user/user.slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Oauth = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate()

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const resu = await signInWithPopup(auth, provider);
      const reasu = await axios.post("/api/auth/google", {
        name: resu.user.displayName,
        email: resu.user.email,
        photo: resu.user.photoURL,
      });
      console.log(reasu.data);
      dispatch(signInSuccess(reasu.data));
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      onClick={handleGoogleAuth}
      type='button'
      className='bg-red-600 p-3 text-white uppercase rounded-lg hover:bg-red-500'
    >
      Continue with Google
    </button>
  );
};

export default Oauth;
