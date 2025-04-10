import redis from "@/lib/redis";

export async function GET(req) {
  console.log("GET request received");
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return new Response(JSON.stringify({ error: "chatId is required" }), {
        status: 400,
      });
    }

    console.log("Fetching chat messages for chatId:", chatId);
    const messages = await redis.lrange(`chat:${chatId}`, 0, -1);

    return new Response(
      JSON.stringify({ messages: messages.map(JSON.parse) }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { chatId, message } = await req.json();
    console.log("POST request received");
    console.log("Chat ID: ", chatId);
    console.log("Message: ", message);
    // Add chat ID to the list of chat IDs if it doesn't exist
    await redis.rpush(`chat:${chatId}`, JSON.stringify(message));
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { chatId } = await req.json();
    console.log("DELETE request received");
    console.log("Chat ID: ", chatId);
    // Remove the chat ID from Redis
    await redis.del(`chat:${chatId}`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
