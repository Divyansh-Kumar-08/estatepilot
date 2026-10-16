import { useEffect, useState } from "react";
import { leads as initialLeads } from "../data";
import type { Lead, LeadStatus } from "../types";

type SavedDeal = {
  id: number;
  title: string;
  client: string;
  property: string;
  value: string;
  stage: string;
};

function convertLeadToDeal(lead: Lead): boolean {
  try {
    const saved = localStorage.getItem("estatepilot_deals");
    const deals: SavedDeal[] = saved ? JSON.parse(saved) : [];

    const alreadyExists = deals.some(
      (deal) => deal.id === lead.id || deal.client === lead.name
    );

    if (alreadyExists) {
      alert("A deal for this lead may already exist.");
      return false;
    }

    const newDeal: SavedDeal = {
      id: Date.now(),
      title: lead.property.trim() || `${lead.name}'s Deal`,
      client: lead.name,
      property: lead.property.trim() || "Property not specified",
      value: lead.value || lead.budget || "Not specified",
      stage: "New",
    };

    localStorage.setItem(
      "estatepilot_deals",
      JSON.stringify([newDeal, ...deals])
    );

    alert(`Lead "${lead.name}" converted to a deal!`);
    return true;
  } catch {
    alert("Could not save the deal. Please try again.");
    return false;
  }
}
export default function Leads() {
const [leadList, setLeadList] = useState<Lead[]>(() => {
  try {
    const saved = localStorage.getItem("estatepilot_leads");
    if (saved !== null) {
      return JSON.parse(saved) as Lead[];
    }
  } catch {
    console.error("Could not load saved leads.");
  }

  return initialLeads;
});
useEffect(() => {
  try {
    localStorage.setItem("estatepilot_leads", JSON.stringify(leadList));
  } catch {
    console.error("Could not save leads to browser storage.");
  }
}, [leadList]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [property, setProperty] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<LeadStatus>("New");
  const [source, setSource] = useState("Website");
  const [notes, setNotes] = useState("");

  const filteredLeads = leadList.filter((lead) => {
    const query = search.toLowerCase();

    const matchesSearch =
      lead.name.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.property.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function addLead() {
    if (!name.trim() || !phone.trim()) {
      alert("Please enter at least the lead name and phone number.");
      return;
    }

    const newLead: Lead = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      property: property.trim(),
      location: location.trim(),
      budget: budget.trim(),
      status,
      source,
      lastContact: "Not contacted",
      nextFollowUp: "Not scheduled",
      notes: notes.trim(),
      value: budget.trim(),
      time: "Just now",
    };

    setLeadList((items) => [newLead, ...items]);

    setName("");
    setPhone("");
    setEmail("");
    setProperty("");
    setLocation("");
    setBudget("");
    setStatus("New");
    setSource("Website");
    setNotes("");
    setShowForm(false);
  }

  function updateStatus(id: number, newStatus: LeadStatus) {
    setLeadList((items) =>
      items.map((lead) =>
        lead.id === id ? { ...lead, status: newStatus } : lead
      )
    );
  }

  const cardStyle = {
    border: "1px solid var(--border-color, #e5e7eb)",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "12px",
    background: "var(--card-bg, #ffffff)",
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
          <h1 style={{ margin: 0 }}>Leads</h1>
          <p style={{ color: "#6b7280" }}>
            Manage prospective buyers and property enquiries.
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Lead"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        {(["All", "New", "Warm", "Hot", "Cold"] as const).map((item) => (
          <button
            key={item}
            onClick={() => setStatusFilter(item)}
            style={{
              padding: "14px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              background: statusFilter === item ? "#e8efff" : "#ffffff",
              color: "#1f2937",
            }}
          >
            <strong>{item}</strong>
            <div style={{ marginTop: "6px" }}>
              {item === "All"
                ? leadList.length
                : leadList.filter((lead) => lead.status === item).length}
            </div>
          </button>
        ))}
      </div>

      {showForm && (
        <div style={cardStyle}>
          <h3>Add a new lead</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            <input
              placeholder="Full name *"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              placeholder="Phone number *"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
            <input
              placeholder="Email address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              placeholder="Interested property"
              value={property}
              onChange={(event) => setProperty(event.target.value)}
            />
            <input
              placeholder="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <input
              placeholder="Budget"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as LeadStatus)}
            >
              <option value="New">New</option>
              <option value="Warm">Warm</option>
              <option value="Hot">Hot</option>
              <option value="Cold">Cold</option>
            </select>
            <select
              value={source}
              onChange={(event) => setSource(event.target.value)}
            >
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
              <option value="Phone">Phone</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              placeholder="Notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          <button onClick={addLead} style={{ marginTop: "14px" }}>
            Save Lead
          </button>
        </div>
      )}

      <input
        placeholder="Search leads by name, phone, email, or property..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px",
          marginBottom: "16px",
        }}
      />

      {filteredLeads.map((lead) => (
        <div key={lead.id} style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ flex: "1 1 220px" }}>
              <h3 style={{ margin: "0 0 8px" }}>{lead.name}</h3>
              <p style={{ margin: "4px 0" }}>{lead.phone}</p>
              {lead.email && <p style={{ margin: "4px 0" }}>{lead.email}</p>}
              {lead.property && (
                <p style={{ margin: "4px 0" }}>
                  Property: {lead.property}
                </p>
              )}
              {lead.location && (
                <p style={{ margin: "4px 0" }}>
                  Location: {lead.location}
                </p>
              )}
              {lead.budget && (
                <p style={{ margin: "4px 0" }}>Budget: {lead.budget}</p>
              )}
              <p style={{ margin: "4px 0", color: "#6b7280" }}>
                Source: {lead.source}
              </p>
              {lead.notes && <p style={{ margin: "8px 0" }}>{lead.notes}</p>}
            </div>

                       <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minWidth: "130px",
              }}
            >
              <label>
                Status
                <select
                  value={lead.status}
                  onChange={(event) =>
                    updateStatus(lead.id, event.target.value as LeadStatus)
                  }
                  style={{ display: "block", marginTop: "6px" }}
                >
                  <option value="New">New</option>
                  <option value="Warm">Warm</option>
                  <option value="Hot">Hot</option>
                  <option value="Cold">Cold</option>
                </select>
              </label>

              <button
                type="button"
                onClick={() => {
  const converted = convertLeadToDeal(lead);

  if (converted) {
    setLeadList((items) =>
      items.filter((item) => item.id !== lead.id)
    );
  }
}}
                style={{
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#2563eb",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Convert to Deal
              </button>
            </div>
          </div>
        </div>
      ))}

      {filteredLeads.length === 0 && (
        <p style={{ color: "#6b7280" }}>No matching leads found.</p>
      )}
    </div>
  );
}
