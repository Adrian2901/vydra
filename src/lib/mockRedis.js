const mockDatabase = {
  chatIds: new Map([
    ["1745861459938", "1745861459938"], // initial value and timestamp
    ["1745861459142", "1745861459142"], // initial value and timestamp
  ]),
  "chat:1745861459938": [
    JSON.stringify({
      role: "assistant",
      content: "Hello! How can I help you today? ^^",
      type: "text",
      file: null,
    }),
    JSON.stringify({
      role: "user",
      content: "Help me please",
      type: "text",
      file: null,
    }),
    JSON.stringify({
      role: "assistant",
      content: "This is a simulated response from the LLM.",
      type: "text",
      file: null,
    }),
  ],
  "chat:1745861459142": [
    JSON.stringify({
      role: "assistant",
      content: "Hello! How can I help you today? ^^",
      type: "text",
      file: null,
    }),
    JSON.stringify({
      role: "user",
      content: "i m just a passing through kamen rider",
      type: "text",
      file: null,
    }),
    JSON.stringify({
      role: "assistant",
      content: "ONORE DIKEIDO!",
      type: "text",
      file: null,
    }),
  ],
};

const mockRedis = {
  async zrange(key, start, end) {
    // start and end are not used in the mock
    if (key === "chatIds") {
      console.log("Fetching chat IDs from mock database");
      const keys = Array.from(mockDatabase.chatIds.keys());
      return keys;
    }
    return [];
  },

  async zadd(key, score, value) {
    if (key === "chatIds") {
      mockDatabase.chatIds.set(value, score);
    }
  },

  async del(key) {
    delete mockDatabase[key];
  },

  async lrange(key, start, end) {
    // start and end are not used in the mock
    return mockDatabase[key] || [];
  },

  async rpush(key, value) {
    if (!mockDatabase[key]) {
      mockDatabase[key] = [];
    }
    mockDatabase[key].push(value);
  },

  async keys(pattern) {
    // let's assume pattern is always *
    const keys = Object.keys(mockDatabase);
    return keys;
  },
};

export default mockRedis;
