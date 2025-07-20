let mood = "neutral";

function setMood(selected) {
  mood = selected;
  addMessage("You", `Mood selected: ${mood}`);
}

function addMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const msg = document.createElement("p");
  msg.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim();
  if (!userText) return;

  addMessage("You", userText);
  input.value = "";

  const botResponse = await getMindMateReply(userText);
  addMessage("MindMate", botResponse);
}

async function getMindMateReply(userMessage) {
  try {
    const response = await fetch("/.netlify/functions/askGemma", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, mood })
    });

    const data = await response.json();
    return data.reply || "MindMate couldn’t respond this time.";
  } catch (error) {
    console.error("API Error:", error);
    return "Oops! There was a network or server error.";
  }
}
