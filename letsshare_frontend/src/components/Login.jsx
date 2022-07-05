import React from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import ShareVideo from "../assets/share.mp4";
import Logo from "../assets/logowhite.png";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await signInWithPopup(auth, provider)
      .then((user) => {
        localStorage.setItem(
          "user",
          JSON.stringify(auth.currentUser.providerData[0])
        );

        const { uid, displayName, photoURL } = auth.currentUser.providerData[0];
        const doc = {
          _id: uid,
          _type: "user",
          username: displayName,
          image: photoURL,
        };

        client.createIfNotExists(doc).then(() => {
          navigate("/", { replace: true });
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={ShareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 bottom-0 left-0 right-0 bg-blackOverlay">
          <div className="p-5">
            <img src={Logo} width="130px" alt="ShareMe" />
          </div>
          <div className="shadow-2xl">
            <button
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer"
              type="button"
              onClick={handleLogin}
            >
              <FcGoogle className="mr-4" /> Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
