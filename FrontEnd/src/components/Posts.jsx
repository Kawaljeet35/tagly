import ProfilePic from "../assets/pic.png";
import { useState } from "react";

export default function Posts({
  id,
  name,
  likedByCurrentUser,
  mediaUrl,
  content,
  createdAt,
  mediaType,
  likesCount,
  commentsCount,
  sharesCount,
  profilePictureUrl,
  currentUsername,
  username,
  onDelete,
}) {
  const [localLikes, setLocalLikes] = useState(likesCount);
  const [localCommentsCount, setLocalCommentsCount] = useState(commentsCount);
  const [isLiked, setIsLiked] = useState(likedByCurrentUser);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleLike = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        // simple toggle (temporary)
        if (isLiked) {
          setLocalLikes((prev) => prev - 1);
        } else {
          setLocalLikes((prev) => prev + 1);
        }

        setIsLiked(!isLiked);
      } else {
        alert("Failed to like post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(commentText),
        },
      );

      if (response.ok) {
        setCommentText("");
        setLocalCommentsCount((prev) => prev + 1);
        await fetchComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("Would you like to delete this post?");

    if (!confirmDelete) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        await onDelete();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPost = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: editedContent,
        }),
      });
      console.log(response.status);
      if (response.ok) {
        setIsEditing(false);
        await onDelete();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/posts/${id}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      setComments(data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log("post username:", username);
  console.log("current username:", currentUsername);

  return (
    <div className="bg-white shadow rounded-2xl flex-col  max-w-lg mx-auto mt-3 w-full">
      <div className="flex pt-3 px-4 mb-3 items-center ">
        <div className="w-10 h-10 mr-2 flex-shrink-0">
          <img
            src={profilePictureUrl || ProfilePic}
            alt="pic"
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="flex justify-between w-full">
          <div className="flex flex-col justify-center ">
            <h4>
              <span className="font-medium hover:underline">{name}</span>
              <span>&nbsp;</span>
              <span aria-hidden="true"> · </span>
              <button className="text-[#008080] hover:underline font-semibold">
                Follow
              </button>
            </h4>
            <p className="text-xs font-medium text-gray-500 hover:underline">
              {createdAt}
            </p>
          </div>

          <div className="flex items-center relative">
            {username === currentUsername && (
              <>
                <button onClick={() => setShowMenu(!showMenu)}>
                  <svg
                    className="rounded-full h-8 w-8 p-1"
                    fill="#9CA3AF"
                    viewBox="0 0 32 32"
                    enableBackground="new 0 0 32 32"
                    id="Glyph"
                    version="1.1"
                    xmlSpace="preserve"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>

                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>

                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S17.654,13,16,13z"
                        id="XMLID_287_"
                      ></path>

                      <path
                        d="M6,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S7.654,13,6,13z"
                        id="XMLID_289_"
                      ></path>

                      <path
                        d="M26,13c-1.654,0-3,1.346-3,3s1.346,3,3,3s3-1.346,3-3S27.654,13,26,13z"
                        id="XMLID_291_"
                      ></path>
                    </g>
                  </svg>
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-10 bg-white shadow-lg rounded-lg py-2 w-32 z-10 border">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={handleDeletePost}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-1 mb-2">
        {isEditing ? (
          <>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full border rounded-lg p-3 outline-none"
              rows={4}
            />

            <div className="pb-3 flex gap-2 mt-2">
              <button
                onClick={handleEditPost}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(content);
                }}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p>{content}</p>
        )}
      </div>

      {mediaType === "image" && mediaUrl && (
        <img className="w-full mb-2" src={mediaUrl} alt="Post" />
      )}

      {mediaType === "video" && mediaUrl && (
        <video className="w-full mb-2" controls>
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      <div className="flex py-[10px] px-4 justify-between">
        <div className="flex">
          <svg
            className="h-6 w-6"
            version="1.2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1080 1080"
            width="1080"
            height="1080"
          >
            <style>{`.s0 { fill: #008080 } .s1 { fill: #ffffff }`}</style>
            <path
              id="Shape 1"
              className="s0"
              d="m540 1080c-298.6 0-540-241.4-540-540 0-298.6 241.4-540 540-540 298.6 0 540 241.4 540 540 0 298.6-241.4 540-540 540z"
            />
            <path
              id="Shape 2"
              fillRule="evenodd"
              className="s1"
              d="m652.9 119.8c38.9 8.8 64.2 51.7 56.4 95.7l-3.5 19.3c-7.9 45.2-22.6 88.2-43.1 127.4h215.5c39.6 0 71.8 36.4 71.8 81.2 0 31.4-15.7 58.6-38.7 72.2 16.3 14.9 26.7 37.8 26.7 63.3 0 39.7-25.1 72.7-58.2 79.8 6.6 12.4 10.4 26.8 10.4 42.2 0 36-20.8 66.7-49.6 77.2 1.1 5.6 1.7 11.5 1.7 17.6 0 44.9-32.2 81.3-71.8 81.3h-145.9c-28.4 0-56.1-9.5-79.7-27.3l-57.6-43.5c-40-30.1-63.9-80.9-63.9-135.3v-188.3c0-49.5 19.9-96.1 53.8-127l11.1-10c39.7-35.9 66.7-86.4 76.6-142.6l3.4-19.3c7.8-44.1 45.7-72.7 84.6-63.9zm-421 269.5h95.7c26.5 0 47.9 24.2 47.9 54.1v379.4c0 30-21.4 54.2-47.9 54.2h-95.7c-26.5 0-47.9-24.2-47.9-54.2v-379.4c0-29.9 21.4-54.1 47.9-54.1z"
            />
          </svg>
          <span className="ml-1">{localLikes}</span>
        </div>

        <div className="flex space-x-1">
          <span>{localCommentsCount}</span>
          <svg
            className="text-gray-500 h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            transform="matrix(-1, 0, 0, 1, 0, 0)"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M2.2928 21.292L2.28337 21.3026C1.97175 21.6227 1.91001 22.1115 2.1337 22.4995C2.35966 22.8914 2.82058 23.0828 3.25769 22.9662L9.05302 21.4208C10.1339 21.7963 11.2942 22 12.5 22C18.299 22 23 17.299 23 11.5C23 5.70101 18.299 1 12.5 1C6.70103 1 2.00002 5.70101 2.00002 11.5C2.00002 13.6029 2.61921 15.5638 3.6852 17.2072C3.65453 17.5251 3.60229 17.8896 3.51944 18.3039C3.28993 19.4515 2.95112 20.2289 2.68837 20.7019C2.55663 20.939 2.44292 21.1015 2.36973 21.1972C2.3331 21.2451 2.30653 21.2764 2.2928 21.292Z"
                fill="currentColor"
              ></path>{" "}
            </g>
          </svg>
          <span>{sharesCount}</span>
          <svg
            className="text-gray-500 h-7 w-7"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M13.9546 5.18341L18.9324 9.60815C19.863 10.4353 20.3283 10.8489 20.4998 11.3373C20.6503 11.7662 20.6503 12.2335 20.4998 12.6624C20.3283 13.1508 19.863 13.5644 18.9324 14.3916L13.9546 18.8163C13.5323 19.1917 13.3211 19.3794 13.1418 19.3861C12.986 19.3919 12.8364 19.3247 12.7372 19.2044C12.6231 19.0659 12.6231 18.7834 12.6231 18.2184V15.4284C10.195 15.4284 7.63044 16.2083 5.75782 17.5926C4.78293 18.3133 4.29546 18.6737 4.1098 18.6595C3.92883 18.6456 3.81398 18.575 3.72008 18.4196C3.62374 18.2603 3.70883 17.7624 3.879 16.7666C4.98397 10.3004 9.43394 8.57129 12.6231 8.57129V5.78134C12.6231 5.21632 12.6231 4.93381 12.7372 4.79531C12.8364 4.67498 12.986 4.6078 13.1418 4.61363C13.3211 4.62034 13.5323 4.80803 13.9546 5.18341Z"
                fill="currentColor"
              ></path>{" "}
            </g>
          </svg>
        </div>
      </div>

      <hr />

      <div className="flex justify-evenly py-[10px]">
        <button onClick={handleLike}>
          <div
            className={`flex justify-between items-center hover:scale-110 space-x-1 
    ${isLiked ? "text-teal-600" : "text-slate-500"}`}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M7.47998 18.35L10.58 20.75C10.98 21.15 11.88 21.35 12.48 21.35H16.28C17.48 21.35 18.78 20.45 19.08 19.25L21.48 11.95C21.98 10.55 21.08 9.34997 19.58 9.34997H15.58C14.98 9.34997 14.48 8.84997 14.58 8.14997L15.08 4.94997C15.28 4.04997 14.68 3.04997 13.78 2.74997C12.98 2.44997 11.98 2.84997 11.58 3.44997L7.47998 9.54997"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                ></path>{" "}
                <path
                  d="M2.38 18.35V8.55002C2.38 7.15002 2.98 6.65002 4.38 6.65002H5.38C6.78 6.65002 7.38 7.15002 7.38 8.55002V18.35C7.38 19.75 6.78 20.25 5.38 20.25H4.38C2.98 20.25 2.38 19.75 2.38 18.35Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <p className="font-semibold text-lg">Like</p>
          </div>
        </button>

        <button
          onClick={() => {
            setShowComments(!showComments);
            if (!showComments) {
              fetchComments();
            }
          }}
        >
          <div className="flex justify-between items-center hover:scale-110 space-x-1">
            <svg
              className="h-6 w-6 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              transform="matrix(-1, 0, 0, 1, 0, 0)"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <g clipPath="url(#clip0_429_11233)">
                  {" "}
                  <path
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.4876 3.36093 14.891 4 16.1272L3 21L7.8728 20C9.10904 20.6391 10.5124 21 12 21Z"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>{" "}
                </g>{" "}
                <defs>
                  {" "}
                  <clipPath id="clip0_429_11233">
                    {" "}
                    <rect width="24" height="24" fill="white"></rect>{" "}
                  </clipPath>{" "}
                </defs>{" "}
              </g>
            </svg>
            <p className="font-semibold text-lg text-slate-500">Comment</p>
          </div>
        </button>

        <button>
          <div className="flex justify-between items-center hover:scale-110 space-x-1">
            <svg
              className="h-6 w-6 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.50002 12C3.50002 7.30558 7.3056 3.5 12 3.5C16.6944 3.5 20.5 7.30558 20.5 12C20.5 16.6944 16.6944 20.5 12 20.5C10.3278 20.5 8.77127 20.0182 7.45798 19.1861C7.21357 19.0313 6.91408 18.9899 6.63684 19.0726L3.75769 19.9319L4.84173 17.3953C4.96986 17.0955 4.94379 16.7521 4.77187 16.4751C3.9657 15.176 3.50002 13.6439 3.50002 12ZM12 1.5C6.20103 1.5 1.50002 6.20101 1.50002 12C1.50002 13.8381 1.97316 15.5683 2.80465 17.0727L1.08047 21.107C0.928048 21.4637 0.99561 21.8763 1.25382 22.1657C1.51203 22.4552 1.91432 22.5692 2.28599 22.4582L6.78541 21.1155C8.32245 21.9965 10.1037 22.5 12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5ZM14.2925 14.1824L12.9783 15.1081C12.3628 14.7575 11.6823 14.2681 10.9997 13.5855C10.2901 12.8759 9.76402 12.1433 9.37612 11.4713L10.2113 10.7624C10.5697 10.4582 10.6678 9.94533 10.447 9.53028L9.38284 7.53028C9.23954 7.26097 8.98116 7.0718 8.68115 7.01654C8.38113 6.96129 8.07231 7.046 7.84247 7.24659L7.52696 7.52195C6.76823 8.18414 6.3195 9.2723 6.69141 10.3741C7.07698 11.5163 7.89983 13.314 9.58552 14.9997C11.3991 16.8133 13.2413 17.5275 14.3186 17.8049C15.1866 18.0283 16.008 17.7288 16.5868 17.2572L17.1783 16.7752C17.4313 16.5691 17.5678 16.2524 17.544 15.9269C17.5201 15.6014 17.3389 15.308 17.0585 15.1409L15.3802 14.1409C15.0412 13.939 14.6152 13.9552 14.2925 14.1824Z"
                  fill="currentColor"
                ></path>{" "}
              </g>
            </svg>
            <p className="font-semibold text-lg text-slate-500">Send</p>
          </div>
        </button>

        <button>
          <div className="flex justify-between items-center hover:scale-110 space-x-1">
            <svg
              className="h-6 w-6 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M14.6644 5.47875L18.6367 9.00968C20.2053 10.404 20.9896 11.1012 20.9896 11.9993C20.9896 12.8975 20.2053 13.5946 18.6367 14.989L14.6644 18.5199C13.9484 19.1563 13.5903 19.4746 13.2952 19.342C13 19.2095 13 18.7305 13 17.7725V15.4279C9.4 15.4279 5.5 17.1422 4 19.9993C4 10.8565 9.33333 8.57075 13 8.57075V6.22616C13 5.26817 13 4.78917 13.2952 4.65662C13.5903 4.52407 13.9484 4.8423 14.6644 5.47875Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
            <p className="font-semibold text-lg text-slate-500">Share</p>
          </div>
        </button>
      </div>
      {showComments && (
        <div className="px-4 py-3 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 outline-none"
            />

            <button
              onClick={handleComment}
              className="bg-teal-600 text-white px-4 rounded-full"
            >
              Post
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-100 rounded-xl px-3 py-2"
              >
                <p className="font-semibold text-sm">{comment.user.name}</p>

                <p className="text-sm">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
