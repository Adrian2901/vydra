import React from "react";
import { Bot, User } from "lucide-react";
import FileMessage from "./file-message";
import TextMessage from "./text-message";

const ContentMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  let msgRole = message.role;
  let msgContent = message.content;
  let msgType = message.type;

  let classAttributes = "flex text-xl mx-2 items-center";

  // If we render a user message
  if (msgRole === "user") {
    classAttributes += " flex-row-reverse text-right";
    return (
      <div className={classAttributes}>
        <User color="black" size={36} />
        {msgType === "file" && (
          <div className="mx-4">
            <FileMessage file={message.file} />
          </div>
        )}
        {msgType === "text" && (
          <div className="mx-4">
            <TextMessage msgContent={msgContent} />
          </div>
        )}
      </div>
    );
    // If we render a message from the LLM
  } else {
    classAttributes += " text-left";
    return (
      <div className={classAttributes}>
        <Bot color="black" size={36} />
        <div className="mx-4">
          <TextMessage msgContent={msgContent} role={msgRole} />
        </div>
      </div>
    );
  }
};

export default ContentMessage;
