import { useEffect, useState } from "react";
import { followUps as initialFollowUps } from "../data";
import type { FollowUp } from "../types";

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
  try {
    const saved = localStorage.getItem("estatepilot_followups");

    if (saved !== null) {
      return JSON.parse(saved) as FollowUp[];
    }
  } catch {
    console.error("Could not load saved follow-ups.");
  }

  return initialFollowUps.map((item: FollowUp) => ({
    ...item,
    name: item.name ?? item.leadName,
  }));
});
useEffect(() => {
  try {
    localStorage.setItem(
      "estatepilot_followups",
      JSON.stringify(followUps)
    );
  } catch {
    console.error("Could not save follow-ups to browser storage.");
  }
}, [followUps]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");

  const filteredFollowUps = followUps.filter((item) => {
    const query = search.toLowerCase();
    return (
      (item.name ?? item.leadName).toLowerCase().includes(query) ||
      item.task.toLowerCase().includes(query)
    );
  });

  function toggleCompleted(id: number) {
    setFollowUps((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  }

  function addFollowUp() {
    if (!leadName.trim() || !task.trim() || !date) {
      alert("Please enter the lead name, task, and date.");
      return;
    }

    const newFollowUp: FollowUp = {
      id: Date.now(),
      leadName: leadName.trim(),
      name: leadName.trim(),
      task: task.trim(),
      date,
      time,
      priority,
      completed: false,
    };

    setFollowUps((items) => [newFollowUp, ...items]);
    setLeadName("");
    setTask("");
    setDate("");
    setTime("10:00");
    setPriority("Medium");
    setShowForm(false);
  }

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    color: "#1f2937",
  } as const;

  return (
    <div style={{ padding: "20px", maxWidth: "1100px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Follow-ups</h1>
          <p style={{ color: "#6b7280" }}>
            Keep track of your next client actions.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Follow-up"}
        </button>
      </div>

      <div style={cardStyle}>
        <strong>{followUps.filter((item) => !item.completed).length}</strong>
        {" pending · "}
        <strong>{followUps.filter((item) => item.completed).length}</strong>
        {" completed"}
      </div>

      {showForm && (
        <div style={cardStyle}>
          <h3>Add a follow-up</h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <input
              placeholder="Lead name"
              value={leadName}
              onChange={(event) => setLeadName(event.target.value)}
            />
            <input
              placeholder="Task"
              value={task}
              onChange={(event) => setTask(event.target.value)}
            />
            <label>
              Date
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <label>
              Time
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              />
            </label>
            <label>
              Priority
              <select
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value as "High" | "Medium" | "Low")
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
            <button onClick={addFollowUp}>Save Follow-up</button>
          </div>
        </div>
      )}

      <input
        placeholder="Search by lead or task..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px",
          marginBottom: "16px",
        }}
      />

      {filteredFollowUps.map((item) => (
        <div key={item.id} style={cardStyle}>
          <h3
            style={{
              textDecoration: item.completed ? "line-through" : "none",
            }}
          >
            {item.task}
          </h3>
          <p>Lead: {item.name ?? item.leadName}</p>
          <p>
            {item.date} · {item.time}
          </p>
          <p>Priority: {item.priority}</p>
          <p>Status: {item.completed ? "Completed" : "Pending"}</p>
          <button onClick={() => toggleCompleted(item.id)}>
            {item.completed ? "Reopen" : "Mark Complete"}
          </button>
        </div>
      ))}

      {filteredFollowUps.length === 0 && (
        <p style={{ color: "#6b7280" }}>No follow-ups found.</p>
      )}
    </div>
  );
}