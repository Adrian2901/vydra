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
