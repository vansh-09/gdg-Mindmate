let mood = "neutral";
const API_KEY =
  "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"; // Replace with your actual key

function setMood(selected) {
  mood = selected;
  addMessage("You", `Mood selected: ${mood}`, "user");
}

function addMessage(sender, message, type) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById("chat-box");
  const typingMsg = document.createElement("div");
  typingMsg.className = "message bot typing";
  typingMsg.id = "typing";
  typingMsg.innerText = "MindMate is typing...";
  chatBox.appendChild(typingMsg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function resetChat() {
  document.getElementById("chat-box").innerHTML = "";
  mood = "neutral";
  addMessage("System", "Chat has been reset. Select your mood again.", "bot");
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  addMessage("You", userText, "user");
  input.value = "";

  showTyping();
  const response = await getOpenRouterReply(userText);
  removeTyping();
  addMessage("MindMate", response, "bot");
}

async function getOpenRouterReply(userMessage) {
  const prompt = `The user feels ${mood}. Respond empathetically and warmly. Give a calming tip or ask a gentle follow-up.\nUser: "${userMessage}"`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost", // Required if using free-tier
          "X-Title": "MindMate Chatbot",
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small-3.2-24b-instruct:free",
          messages: [
            {
              role: "system",
              content:
                "You are MindMate, a caring mental health companion. Speak with empathy and clarity.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("OpenRouter response:", data);
    return (
      data.choices?.[0]?.message?.content ||
      "Hmm… MindMate couldn’t respond this time."
    );
  } catch (error) {
    console.error("API Error:", error);
    return "Oops! There was a network or API error.";
  }
}
