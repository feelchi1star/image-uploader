"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface ObjData {
  success: boolean;
  message: string;
  imageUrl: string;
}
const imageLoader = ({ src }: { src: string }) => {
  return src;
};
export default function Home() {
  const router = useRouter();

  const [file, setFile] = React.useState<File | string | Blob>();
  const [img, setImage] = React.useState<string | null>(null);
  const [dragStyle, setDragStyle] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);

  const [iserror, setIsError] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [objData, setObjData] = React.useState<ObjData>();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const urlInput = React.useRef<HTMLInputElement>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      setIsLoading(true);
      const headers = new Headers();
      headers.append("x-feel-api", `${process.env.NEXT_PUBLIC_KEY}`);
      fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          setObjData(data);
        })
        .catch((err) => {
          setIsLoading(false);
          alert("An error Occurred");
          console.error("Error uploading Image");
        });
    }
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
          setFile(availableFiles[0]);
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
          {objData?.success ? (
            <>
              <div className="flex  flex-col gap-2">
                <button
                  onClick={() => {
                    router.refresh();

                    setObjData({ success: false, imageUrl: "", message: "" });
                  }}
                  className="border border-blue-400 p-1 rounded-2xl text-xs hover:bg-blue-400 hover:text-white"
                >
                  Go back
                </button>
                <div className="h-56 relative w-full ">
                  <Image
                    src={objData.imageUrl}
                    className="h-56"
                    width={400}
                    loader={imageLoader}
                    height={300}
                    alt="Picture"
                  />
                </div>
                <p className="text-xs text-green-500">{objData.message}</p>
                <div className="flex  w-full gap-2">
                  <input
                    type="text"
                    className="rounded-sm focus:outline-none  border text-sm"
                    value={objData.imageUrl}
                    name="url"
                    ref={urlInput}
                  />
                  <button
                    onClick={() => {
                      setCopied(true);
                      if (navigator.clipboard && urlInput.current)
                        navigator.clipboard.writeText(urlInput.current.value);
                      alert("Image URL copied to clipboard");
                    }}
                    className={`${
                      copied ? "bg-black text-white" : "border-2"
                    } hover:bg-gray-500 hover:text-white border-gray-500 shadow-md  p-1 px-2 rounded-xl text-sm`}
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
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
                      Choose an Image - No Auto Update
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
            </>
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
