"use client";

import Image from "next/image";
import React from "react";

export default function Home() {
  const [file, setFile] = React.useState({});
  const [img, setImage] = React.useState<string | null>(null);
  const [dragStyle, setDragStyle] = React.useState<boolean>(false);
  const [iserror, setIsError] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const fileInput = React.useRef<HTMLInputElement>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = e.currentTarget.file.files[0];
    const formData = new FormData();
    formData.append("picture", data);
    // setIsLoading(true);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const availableFiles = e.target.files;
    uploadFile(availableFiles);
  }
  function uploadFile(availableFiles: FileList | null) {
    setIsError(false);
    if (availableFiles && availableFiles.length > 0) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setIsLoading(false);
          setImage(result);
        }
      };
      reader.onerror = (event) => {
        setIsLoading(false);
        console.error("Error reading file:", event.target?.error);
      };

      if (!availableFiles[0].type.startsWith("image/")) {
        setIsLoading(false);
        setIsError(true);
        return;
      }
      setFile(availableFiles[0]);
      return reader.readAsDataURL(availableFiles[0]);
    }
  }
  function handleButtonClick() {
    if (fileInput?.current) {
      fileInput.current.click();
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragStyle(true);
      }}
      onDrop={(e) => {
        e.preventDefault();
        uploadFile(e.dataTransfer.files);
        setDragStyle(false);
      }}
      onDragLeave={() => setDragStyle(false)}
      className={`${
        dragStyle ? "bg-yellow-50" : "ondrag_leave"
      } min-h-screen  flex flex-col items-center justify-center`}
    >
      <div className="w-full max-w-md p-6">
        <div
          className={`p-4 rounded-2xl flex flex-col items-center 
        gap-3  shadow-2xl
      `}
        >
          <h1 className="text-3xl">File Upload </h1>
          <p
            className={`transition-all  duration-150 ease-in-out ${
              iserror ? "text-lg text-red-500" : "text-sm"
            }`}
          >
            File should be Jpeg, Png, etc.
          </p>
          {isLoading ? (
            <SpinnerLoader />
          ) : (
            <form
              className="flex gap-3  flex-col justify-stretch"
              onSubmit={handleSubmit}
            >
              <div className="h-56 relative w-full ">
                {img ? (
                  <Image
                    src={img}
                    className="h-56"
                    width={400}
                    height={300}
                    alt="Picture"
                  />
                ) : (
                  <Image
                    src={require("../public/undraw_upload_image_re_svxx.svg")}
                    className="h-56"
                    width={400}
                    height={300}
                    alt="Picture"
                  />
                )}
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                name="file"
                accept="image/*"
                className="hidden"
                ref={fileInput}
              />
              <div className="flex gap-3">
                <button
                  className="px-3 py-2 text-xs md:text-base bg-blue-600 text-white font-medium rounded-lg items-center hover:bg-blue-300 hover:text-yellow-100"
                  onClick={handleButtonClick}
                >
                  Choose an Image
                </button>
                {img && (
                  <button
                    className="px-3 py-2 text-xs md:text-base bg-blue-600 text-white font-medium rounded-lg items-center hover:bg-blue-300 hover:text-yellow-100"
                    type="submit"
                  >
                    Upload
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function SpinnerLoader() {
  return (
    <div
      className="mt-4 flex gap-3 justify-center items-center"
      id="loadingIndicator"
    >
      <div className="spinner"></div> <span className="">Loading ...</span>
    </div>
  );
}
