import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TextMessage = ({ msgContent, role = "user" }) => {
  let classes = "markdown-content my-auto w-250 rounded-2xl p-4";
  if (role === "assistant") {
    classes += " bg-accent text-primary";
  }

  return (
    <div className={classes}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mb-3" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-5 mb-3" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-5 mb-3" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        }}
      >
        {msgContent}
      </ReactMarkdown>
    </div>
  );
};

export default TextMessage;
