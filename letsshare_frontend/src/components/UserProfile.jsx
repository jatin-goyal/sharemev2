import React, { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const activeBtnStyles =
  "bg-red-500 text-white font-bold p-2  px-3 mx-1 rounded-full w-30 outline-none";

const notActiveBtnStyles =
  "bg-primary mr-4 text-black font-bold p-2 rounded-full w-30 outline-none";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("created");
  const [activeBtn, setActiveBtn] = useState("created");
  const navigate = useNavigate();
  const { userId } = useParams();

  // const authId = auth?.currentUser?.providerData[0].uid;

  const handleLogout = async () => {
    await signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((err) => console.error(err.message));
  };

  const settingPins = () => {
    if (text === "created") {
      const createdPinQuery = userCreatedPinsQuery(userId);
      client.fetch(createdPinQuery).then((data) => setPins(data));
    } else if (text === "saved") {
      const savedPinQuery = userSavedPinsQuery(userId);
      client.fetch(savedPinQuery).then((data) => setPins(data));
    }
  };

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUser(data[0]);
    });
  }, [userId]);

  useEffect(() => {
    settingPins();
  }, [text, userId]);

  if (!user) return <Spinner message="Loading user profile..." />;

  return (
    <div className="relative pb-2 h-full justify-center items-center ">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
              src="https://source.unsplash.com/1600x900/?nature"
              alt="user-pic"
            />
            <p className="nameInitial-h p-1 rounded-full w-20 h-20 -mt-10 shadow-xl text-5xl capitalize">
              {user?.username[0]}
            </p>
          </div>
          <h1 className="font-bold text-3xl text-center mt-3 capitalize">
            {user?.username}
          </h1>
          <div className="absolute top-0 right-0 z-1 p-2">
            {userId === user._id && (
              <button
                className="bg-mainColor flex justify-center items-center p-3 rounded-full cursor-pointer hover:shadow-lg"
                type="button"
                onClick={handleLogout}
              >
                <AiOutlineLogout color="red" fontSize={30} />
              </button>
            )}
          </div>
        </div>
        <div className="text-center mb-7">
          <button
            type="button"
            className={`${
              activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles
            }`}
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("created");
              settingPins();
            }}
          >
            Created Pins
          </button>

          {/* <button
            type="button"
            className={`${
              activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles
            }`}
            onClick={(e) => {
              setText(e.target.textContent);
              setActiveBtn("saved");
              settingPins();
            }}
          >
            Saved Pins
          </button> */}
        </div>

        {pins?.length === 0 ? (
          <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
            No Pins Found!
          </div>
        ) : (
          <div className="px-2">
            <MasonryLayout pins={pins} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
