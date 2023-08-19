"use client";

import Image from "next/image";
import React from "react";

export default function Home() {
  const [file, setFile] = React.useState({});
  const [img, setImage] = React.useState<string | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const availableFiles = e.target.files;
    if (availableFiles && availableFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          setImage(result);
        }
      };
      reader.onerror = (event) => {
        console.error("Error reading file:", event.target?.error);
      };
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div
        className="h-[400px] p-4 rounded-2xl flex flex-col items-center 
        gap-3 bg-white shadow-2xl
      "
      >
        <h1 className="text-3xl">File Upload </h1>
        <p>File should be Jpeg, Png, etc.</p>
        <form
          className="flex gap-3  flex-col justify-stretch"
          onSubmit={handleSubmit}
        >
          <div className="h-56 relative w-60">
            {img && <Image src={img} fill alt="Picture" />}
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
              className="p-3  bg-blue-600 text-white font-medium rounded-lg items-center hover:bg-blue-300 hover:text-yellow-100"
              onClick={handleButtonClick}
            >
              Choose an Image
            </button>
            <button
              className="p-3  bg-blue-600 text-white font-medium rounded-lg items-center hover:bg-blue-300 hover:text-yellow-100"
              type="submit"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
