import redis from "@/lib/redis";

export async function GET(req) {
  try {
    // Chat ids are stored in a sorted set where the weights are the timestamps
    const chatIds = await redis.zrange("chatIds", 0, -1);
    return new Response(JSON.stringify(chatIds), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { chatId } = await req.json();
    // Add the chat ID to the sorted set with the current id (timestamp) as the score
    await redis.zadd("chatIds", chatId, chatId);
    return new Response(JSON.stringify({ message: "Chat saved" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { chatId } = await req.json();
    console.log("Delete chat id from chatIds:", chatId);
    // Remove the chat ID from the sorted set
    const res = await redis.zrem("chatIds", chatId);
    if (res === 0) {
      return new Response(JSON.stringify({ error: "Chat ID not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify({ message: "Chat deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
