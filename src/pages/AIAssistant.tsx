import { useState } from "react";
import { leads } from "../data";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: string; text: string }[]
  >([
    {
      role: "assistant",
      text: "Hello! I'm your EstatePilot assistant. Ask me about your leads, follow-ups, or sales pipeline.",
    },
  ]);

  const suggestions = [
    "Show my hottest leads",
    "How many leads do I have?",
    "Give me a sales follow-up strategy",
    "How can I close more deals?",
  ];

  const sendMessage = (text: string) => {
    const question = text.trim();
    if (!question) return;

    let answer =
      "I can help with lead management, follow-up strategies, and sales planning. Try one of the suggested questions.";

    const lower = question.toLowerCase();

    if (lower.includes("how many leads") || lower.includes("total leads")) {
      answer = `Your current lead dataset contains ${leads.length} leads.`;
    } else if (lower.includes("hot") && lower.includes("lead")) {
      const hotLeads = leads.filter(
        (lead) => lead.status.toLowerCase() === "hot"
      );

      answer =
        hotLeads.length > 0
          ? `I found ${hotLeads.length} hot leads: ${hotLeads
              .slice(0, 5)
              .map((lead) => lead.name)
              .join(", ")}. Contact them promptly and record the outcome.`
          : "No leads marked Hot were found in the current dataset. Review your leads and update their status.";
    } else if (lower.includes("follow-up") || lower.includes("follow up")) {
      answer =
        "Prioritize overdue and high-intent leads. Contact each person with a specific next step, record the result, and schedule the next follow-up.";
    } else if (lower.includes("close") || lower.includes("sales strategy")) {
      answer =
        "Try this: identify the client's budget and timeline, shortlist two suitable properties, arrange a site visit, address objections, and agree on a clear next action.";
    }

    setMessages((current) => [
      ...current,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);

    setMessage("");
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>AI Assistant</h2>
          <p>Your built-in real estate sales helper.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>EstatePilot Assistant</h3>
            <p>CRM guidance and lead insights</p>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {messages.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: 16,
                textAlign: item.role === "user" ? "right" : "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  maxWidth: "90%",
                  padding: 12,
                  borderRadius: 12,
                  background:
                    item.role === "user" ? "#6d4aff" : "#202033",
                  color: "#ffffff",
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.text}
              </div>
            </div>
          ))}

          <div className="filter-row" style={{ marginBottom: 16 }}>
            {suggestions.map((item) => (
              <button
                type="button"
                className="filter-button"
                key={item}
                onClick={() => sendMessage(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(message);
            }}
            style={{ display: "flex", gap: 8 }}
          >
            <input
              className="search-input"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask about leads or sales..."
            />

            <button type="submit" className="add-button">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;