import ProfilePic from "../assets/pic.png";
import { useState } from "react";

export default function CreatePost({
  handleUploadClick,
  onPostCreated,
  profilePictureUrl,
}) {
  const [content, setContent] = useState("");

  const handleTextPost = async () => {
    if (!content.trim()) {
      alert("Post cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("content", content);

    try {
      const response = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Post created!");
        setContent("");
        onPostCreated();
      } else {
        alert("Failed to create post");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white shadow rounded-2xl flex-col justify-between px-4 pt-4 pb-2 w-[95%] max-w-lg mx-auto mt-3 space-y-2">
      <div className="flex items-center justify-start space-x-2">
        <div className="bg-stone-200 rounded-full">
          <svg
            viewBox="0 0 24.00 24.00"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 p-2"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132"
                stroke="#008080"
                strokeWidth="1.9200000000000004"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M5 20H19"
                stroke="#008080"
                strokeWidth="1.9200000000000004"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </div>

        <div>
          <p className="font-semibold text-base text-slate-500">Create Post</p>
        </div>
      </div>

      <div className="relative h-auto">
        <input
          type="text"
          name="textPost"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="input-default rounded-xl p-[14px] pl-14 bg-stone-100 border-none text-base w-full"
        />

        <div className="absolute left-3 top-3">
          <a href="" onClick={(e) => e.preventDefault()}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center hover:scale-105">
              <img
                src={profilePictureUrl || ProfilePic}
                alt="pic"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </a>
        </div>
      </div>

      <div className="flex justify-evenly space-x-4">
        <button onClick={handleTextPost}>
          <div className="flex justify-between items-center gap-1 hover:scale-110">
            <p className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-1 rounded-lg transition duration-200">
              Post
            </p>
          </div>
        </button>

        <button onClick={handleUploadClick}>
          <div className="flex justify-between items-center gap-2 hover:scale-110">
            <svg
              version="1.0"
              id="Layer_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 64 64"
              enableBackground="new 0 0 64 64"
              xmlSpace="preserve"
              fill="#000000"
              className="w-5 h-5"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <g>
                  <path
                    fill="#00FF00"
                    d="M60,0H4C1.789,0,0,1.789,0,4v56c0,2.211,1.789,4,4,4h56c2.211,0,4-1.789,4-4V4C64,1.789,62.211,0,60,0z M8,8h48v32.688l-9.113-9.113c-1.562-1.559-4.094-1.559-5.656,0L16.805,56H8V8z"
                  ></path>
                  <circle fill="#00FF00" cx="24" cy="24" r="8"></circle>
                </g>
              </g>
            </svg>

            <p className="font-semibold text-lg text-slate-500">Photo</p>
          </div>
        </button>

        <button onClick={handleUploadClick}>
          <div className="flex justify-between items-center gap-2 hover:scale-110">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              fill="#000000"
              className="w-5 h-5"
            >
              <g transform="translate(-6.4 -6.4) scale(1.2)">
                <rect
                  x="4"
                  y="12"
                  width="40"
                  height="40"
                  rx="4"
                  fill="#00FF00"
                ></rect>
                <polygon points="22,20 22,44 38,32" fill="#000000"></polygon>
                <polygon
                  points="44,20 60,12 60,52 44,44"
                  fill="#00FF00"
                ></polygon>
              </g>
            </svg>

            <p className="font-semibold text-lg text-slate-500">Video</p>
          </div>
        </button>
      </div>
    </div>
  );
}
