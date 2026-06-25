import React from "react";
import { FadeLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] w-full">
      <FadeLoader color="#2563eb" />
    </div>
  );
};

export default Loading;
