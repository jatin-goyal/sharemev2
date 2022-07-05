import React, { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
          window.location.reload();
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading Pin..." />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white shadow-sm mb-5"
        style={{ maxWidth: "1500px ", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            className="rounded-t-3xl rounded-b-lg"
            alt="user-post"
          />
        </div>
        <div className="w-full p-5 pt-1 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image.asset.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a
              href={`${pinDetail?.destination}`}
              target="_blank"
              rel="norefferer"
              className="bg-white flex items-center gap-2 text-black p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md h-8"
            >
              <BsArrowUpRightCircleFill />
              {pinDetail?.destination?.slice(8, 27)}...
            </a>
          </div>
          <div className="pl-3">
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3 text-md">{pinDetail.about}</p>
          </div>
          <Link
            to={`/user-profile/${pinDetail?.postedBy?._id}`}
            className="flex justify-end  pr-2 gap-2 my-5 items-center"
          >
            <p className="nameInitial p-1" style={{ fontSize: "14px" }}>
              {pinDetail?.postedBy?.username[0]}
            </p>
            <p className="font-semibold capitalize">
              {pinDetail?.postedBy?.username}
            </p>
          </Link>
          <h2 className="mt-3 pt-2 text-xl font-semibold border-t-2">
            Comments
          </h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg "
                key={comment.comment}
              >
                <p
                  className="nameInitial-p p-1 capitalize"
                  style={{ fontSize: "14px" }}
                >
                  {comment?.postedBy?.username[0]}
                </p>

                <div className="flex flex-col pl-1">
                  <p className="font-bold capitalize">
                    {comment.postedBy?.username}
                  </p>
                  <p className="">{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-6 gap-3 items-center">
            <Link
              to={`/user-profile/${pinDetail?.postedBy?._id}`}
              className="flex justify-start gap-2  items-center cursor-pointer"
            >
              <p
                className="nameInitial p-1 capitalize opacity-70"
                style={{ fontSize: "14px" }}
              >
                {pinDetail?.postedBy?.username[0]}
              </p>
            </Link>
            <input
              className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              type="button"
              className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? "Doing..." : "Done"}
            </button>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins" />
      )}
      {/* {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins" />
      )} */}
    </>
  );
};

export default PinDetail;
