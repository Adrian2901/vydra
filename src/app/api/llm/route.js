// TODO: Test this with the LLM active
export async function POST(req) {
  // Mock LLM response for testing
  if (process.env.MOCK_LLM === "true") {
    console.error("WARNING - Mock LLM response enabled");
    return new Response(
      JSON.stringify({
        message: {
          content: "This is a simulated response from the LLM.",
          role: "assistant",
        },
      }),
      { status: 200 }
    );
  }

  try {
    const requestBody = await req.json();

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch response from LLM" }),
        { status: response.status }
      );
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
