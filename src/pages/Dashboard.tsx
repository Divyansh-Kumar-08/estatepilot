
import { useState } from "react";
import type { Page } from "../types";
import {
  leads as initialLeads,
  followUps as initialFollowUps,
  deals as initialDeals,
} from "../data";

type DashboardProps = {
  onNavigate: (page: Page) => void;
};

function loadSaved<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);

    if (saved !== null) {
      return JSON.parse(saved) as T;
    }
  } catch {
    console.error(`Could not load ${key}.`);
  }

  return fallback;
}

function getDealAmount(value: string): number {
  const normalized = value.toLowerCase().replace(/,/g, "").trim();
  const match = normalized.match(/[\d.]+/);

  if (!match) return 0;

  const amount = Number(match[0]);

  if (!Number.isFinite(amount)) return 0;
  if (/\bcr\b|crore/.test(normalized)) return amount * 10000000;
  if (/lakh|lac/.test(normalized)) return amount * 100000;

  return amount;
}

function formatPipeline(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }

  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function Dashboard({ onNavigate }: DashboardProps) {
  const [leads] = useState(() =>
    loadSaved("estatepilot_leads", initialLeads)
  );

  const [followUps] = useState(() =>
    loadSaved("estatepilot_followups", initialFollowUps)
  );

  const [deals] = useState(() =>
    loadSaved("estatepilot_deals", initialDeals)
  );

 const activeDeals = deals.filter(
  (deal) => deal.stage !== "Won"
);
const closedDeals = deals.filter(
  (deal) => deal.stage === "Won"
);
  const pendingFollowUps = followUps.filter(
    (item) => !item.completed
  );

  const pipelineValue = activeDeals.reduce(
    (total, deal) => total + getDealAmount(deal.value),
    0
  );

  const stats = [
    {
      label: "Total Leads",
      value: String(leads.length),
      change: "Saved leads",
      icon: "◎",
    },
    {
      label: "Active Deals",
      value: String(activeDeals.length),
      change: `${closedDeals.length} closed`,
      icon: "◇",
    },
    {
      label: "Follow-ups Today",
      value: String(pendingFollowUps.length),
      change: "Pending follow-ups",
      icon: "◷",
    },
    {
      label: "Pipeline Value",
      value: formatPipeline(pipelineValue),
      change: "Active deal value",
      icon: "₹",
    },
  ];

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
      ? "Good afternoon"
      : "Good evening";

  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const pipelineStages = [
    "New",
    "Site Visit",
    "Negotiation",
    "Closed",
  ];

  const leadsNeedingAttention = leads.filter((lead) => {
    const status = String(lead.status).toLowerCase();
    return status === "new" || status === "contacted";
  }).length;

  return (
    <div className="dashboard">
      <section className="welcome-section">
        <div>
          <h2>{greeting} 👋</h2>
          <p>
            Here's what's happening with your real-estate
            business today.
          </p>
        </div>

        <button type="button" className="date-button">
          {today}
        </button>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-top">
              <div className="stat-icon">{stat.icon}</div>
              <span className="stat-change">{stat.change}</span>
            </div>

            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Recent Leads</h3>
              <p>Your latest prospects</p>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => onNavigate("Leads")}
            >
              View all →
            </button>
          </div>

          <div className="lead-list">
            {leads.slice(0, 4).map((lead) => (
              <div className="lead-row" key={lead.id}>
                <div className="lead-avatar">
                  {lead.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")}
                </div>

                <div className="lead-details">
                  <strong>{lead.name}</strong>
                  <span>
                    {lead.property} • {lead.location}
                  </span>
                </div>

                <div className="lead-value">
                  <strong>{lead.budget}</strong>
                  <span>{lead.lastContact}</span>
                </div>

                <span
                  className={`status status-${String(
                    lead.status
                  ).toLowerCase()}`}
                >
                  {lead.status}
                </span>
              </div>
            ))}

            {leads.length === 0 && (
              <div className="empty-state">
                <p>No leads yet. Add your first lead.</p>
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <div>
              <h3>Today's Follow-ups</h3>
              <p>Stay on top of your deals</p>
            </div>

            <span className="count-pill">
              {pendingFollowUps.length}
            </span>
          </div>

          <div className="followup-list">
            {followUps.slice(0, 3).map((followUp) => (
              <div
                className="followup-row"
                key={followUp.id}
              >
                <div className="followup-time">
                  <span className="clock-icon">◷</span>
                </div>

                <div className="followup-details">
                  <strong>{followUp.leadName}</strong>
                  <span>{followUp.task}</span>
                  <small>
                    {followUp.date} • {followUp.time}
                  </small>
                </div>

                <span
                  className={`priority priority-${String(
                    followUp.priority
                  ).toLowerCase()}`}
                >
                  {followUp.priority}
                </span>
              </div>
            ))}

            {followUps.length === 0 && (
              <div className="empty-state">
                <p>No follow-ups scheduled.</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="full-width-button"
            onClick={() => onNavigate("Follow-ups")}
          >
            View follow-up schedule
          </button>
        </div>
      </section>

      <section className="panel pipeline-panel">
        <div className="panel-header">
          <div>
            <h3>Deal Pipeline</h3>
            <p>Track opportunities from lead to closing</p>
          </div>

          <button
            type="button"
            className="text-button"
            onClick={() => onNavigate("Deals")}
          >
            Open pipeline →
          </button>
        </div>

        <div className="pipeline">
          {pipelineStages.map((stage) => {
            const count = deals.filter(
              (deal) => deal.stage === stage
            ).length;

            const percentage =
              deals.length > 0
                ? (count / deals.length) * 100
                : 0;

            return (
              <div className="pipeline-column" key={stage}>
                <div className="pipeline-heading">
                  <span>{stage}</span>
                  <strong>{count}</strong>
                </div>

                <div className="pipeline-bar">
                  <div
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="pipeline-value">
                  {stage === "Closed"
                    ? "Closed deals"
                    : "Active opportunities"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="ai-banner">
        <div className="ai-symbol">✦</div>

        <div className="ai-content">
          <span className="ai-label">ESTATEPILOT AI</span>

          <h3>
            {leadsNeedingAttention > 0
              ? "Your leads may need attention"
              : "Keep your pipeline moving"}
          </h3>

          <p>
            {leadsNeedingAttention > 0
              ? `${leadsNeedingAttention} leads have a New or Contacted status. Review them to decide who needs a follow-up.`
              : "Review your leads and pending follow-ups to keep your business on track."}
          </p>
        </div>

        <button
          type="button"
          className="ai-button"
          onClick={() => onNavigate("AI Assistant")}
        >
          Review with AI →
        </button>
      </section>
    </div>
  );
}

export default Dashboard;
