import React from "react";
import { File, X } from "lucide-react";

const FileMessage = ({ file, clickable = false }) => {
  let fileName = file.name;
  fileName =
    fileName.length > 20 ? fileName.substring(0, 20) + "..." : fileName;
  const fileSize = Math.round((file.size / 1024) * 100) / 100;
  let fileExt = "FILE";
  if (file.ext) {
    fileExt = file.ext.toUpperCase();
  } else {
    fileExt = fileName.split(".").pop().toUpperCase();
  }

  return (
    <div className="flex items-center text-start space-x-1 bg-accent rounded-2xl text-primary px-2 py-1">
      <File size={30} />
      <div className="flex flex-col text-base">
        <span>{fileName}</span>
        <div className="flex flex-row text-xs space-x-2 text-gray-300">
          <span>{fileExt}</span>
          <span>{fileSize} KB</span>
        </div>
      </div>

      {clickable && (
        <div className="relative ml-4">
          <X size={16} />
        </div>
      )}
    </div>
  );
};

export default FileMessage;
