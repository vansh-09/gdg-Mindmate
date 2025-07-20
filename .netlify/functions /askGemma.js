export async function handler(event) {
  const { message, mood } = JSON.parse(event.body);

  const prompt = `The user feels ${mood}. Respond empathetically. Provide a calming tip or ask a gentle follow-up.
  User: "${message}"`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://gdg-mindmate.netlify.app",
        "X-Title": "MindMate"
      },
      body: JSON.stringify({
        model: "google/gemma-3n-e2b-it:free",
        messages: [
          { role: "system", content: "You are MindMate, a caring mental health companion." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: data.choices?.[0]?.message?.content || "No reply." })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server Error", details: error.message })
    };
  }
}
