
import { useEffect, useRef, useState } from "react";

type Property = {
  id: number;
  name: string;
  location: string;
  type: string;
  price: string;
  status: "Available" | "Reserved" | "Sold";
};

type Deal = {
  id: number;
  title: string;
  client: string;
  property: string;
  value: string;
  stage: string;
};

const stages = ["New", "Site Visit", "Negotiation", "Closed"];

const initialDeals: Deal[] = [
  {
    id: 1,
    title: "Skyline Residency",
    client: "Rahul Sharma",
    property: "Skyline Residency",
    value: "₹1.25 Cr",
    stage: "Negotiation",
  },
  {
    id: 2,
    title: "Green Valley Villa",
    client: "Priya Singh",
    property: "Green Valley Villa",
    value: "₹92 Lakh",
    stage: "Site Visit",
  },
];

function isValidPrice(value: string): boolean {
  const pattern =
    /^(?:₹\s*|rs\.?\s*)?(?:\d{1,3}(?:,\d{2,3})+|\d+)(?:\.\d+)?\s*(?:lakh|lac|crore|cr)?$/i;

  if (!pattern.test(value.trim())) return false;

  const amount = Number(
    value
      .replace(/₹|rs\.?/gi, "")
      .replace(/,/g, "")
      .replace(/\s*(lakh|lac|crore|cr)\s*$/i, "")
      .trim()
  );

  return Number.isFinite(amount) && amount > 0;
}

function getDealAmount(value: string): number {
  if (!isValidPrice(value)) return 0;

  const normalized = value
    .replace(/₹|rs\.?/gi, "")
    .replace(/,/g, "")
    .trim()
    .toLowerCase();

  const match = normalized.match(/[\d.]+/);
  if (!match) return 0;

  const amount = Number(match[0]);

  if (/\b(cr|crore)\b/.test(normalized)) {
    return amount * 10000000;
  }

  if (/\b(lakh|lac)\b/.test(normalized)) {
    return amount * 100000;
  }

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

function Deals() {
  const [deals, setDeals] = useState<Deal[]>(() => {
    try {
      const saved = localStorage.getItem("estatepilot_deals");

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as Deal[];
      }
    } catch {
      console.error("Could not load saved deals.");
    }

    return initialDeals;
  });

  const [propertyList] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem("estatepilot_properties");

      if (saved !== null) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed as Property[];
      }
    } catch {
      console.error("Could not load saved properties.");
    }

    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("estatepilot_deals", JSON.stringify(deals));
    } catch {
      console.error("Could not save deals to browser storage.");
    }
  }, [deals]);

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [property, setProperty] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState("New");

  const addDealSectionRef = useRef<HTMLDivElement>(null);

  const openAddDealSection = () => {
    setShowAdd(true);

    setTimeout(() => {
      addDealSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const chooseProperty = (propertyId: string) => {
    const selected = propertyList.find(
      (item) => String(item.id) === propertyId
    );

    if (!selected) {
      setProperty("");
      return;
    }

    setProperty(selected.name);
    setTitle(selected.name);
    setValue(selected.price);
  };

  const activeDeals = deals.filter((deal) => deal.stage !== "Closed");
  const closedDeals = deals.filter((deal) => deal.stage === "Closed");

  const pipelineValue = activeDeals.reduce(
    (total, deal) => total + getDealAmount(deal.value),
    0
  );

  const addDeal = () => {
    if (
      !title.trim() ||
      !client.trim() ||
      !property.trim() ||
      !value.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (!isValidPrice(value)) {
      alert(
        "Enter a valid positive price, such as ₹85 Lakh or ₹1.25 Cr."
      );
      return;
    }

    const deal: Deal = {
      id: Date.now(),
      title: title.trim(),
      client: client.trim(),
      property: property.trim(),
      value: value.trim(),
      stage,
    };

    setDeals((current) => [deal, ...current]);

    setTitle("");
    setClient("");
    setProperty("");
    setValue("");
    setStage("New");
    setShowAdd(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDeal = (id: number) => {
    setDeals((current) => current.filter((deal) => deal.id !== id));
  };

  const moveDeal = (id: number, newStage: string) => {
    setDeals((current) =>
      current.map((deal) =>
        deal.id === id ? { ...deal, stage: newStage } : deal
      )
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Deals</h2>
          <p>Track your sales pipeline from lead to closing.</p>
        </div>

        <button type="button" className="add-button" onClick={openAddDealSection}>
          + Add Deal
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Deals</span>
          <strong>{deals.length}</strong>
        </div>
        <div className="stat-card">
          <span>Active Deals</span>
          <strong>{activeDeals.length}</strong>
        </div>
        <div className="stat-card">
          <span>Closed Deals</span>
          <strong>{closedDeals.length}</strong>
        </div>
        <div className="stat-card">
          <span>Pipeline</span>
          <strong>{formatPipeline(pipelineValue)}</strong>
        </div>
      </div>

      <div className="deal-pipeline">
        {stages.map((stageName) => {
          const stageDeals = deals.filter((deal) => deal.stage === stageName);

          return (
            <div className="deal-column" key={stageName}>
              <div className="deal-column-header">
                <h3>{stageName}</h3>
              </div>

              <div className="deal-column-body">
                {stageDeals.map((deal) => (
                  <div className="deal-card" key={deal.id}>
                    <span className="deal-value">{deal.value}</span>
                    <h3>{deal.title}</h3>
                    <p>{deal.client}</p>
                    <p>{deal.property}</p>

                    <select
                      value={deal.stage}
                      onChange={(event) => moveDeal(deal.id, event.target.value)}
                    >
                      {stages.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => deleteDeal(deal.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                {stageDeals.length === 0 && (
                  <div className="empty-state"><p>No deals</p></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div
          ref={addDealSectionRef}
          style={{ marginTop: "28px", marginBottom: "32px", scrollMarginTop: "24px" }}
        >
          <div
            style={{
              background: "var(--card-bg, #ffffff)",
              border: "1px solid var(--border-color, #e5e7eb)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <div className="modal-header">
              <div>
                <h3>Add Deal</h3>
                <p>Create a new sales opportunity.</p>
              </div>
              <button type="button" className="modal-close" onClick={() => setShowAdd(false)}>
                ×
              </button>
            </div>

            <div className="form-grid">
              {propertyList.length > 0 && (
                <div className="form-group">
                  <label>Select Existing Property</label>
                  <select
                    value=""
                    onChange={(event) => chooseProperty(event.target.value)}
                  >
                    <option value="">Choose a property (optional)</option>
                    {propertyList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — {item.price} ({item.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Deal Name</label>
                <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Skyline Deal" />
              </div>

              <div className="form-group">
                <label>Client</label>
                <input value={client} onChange={(event) => setClient(event.target.value)} placeholder="Rahul Sharma" />
              </div>

              <div className="form-group">
                <label>Property</label>
                <input value={property} onChange={(event) => setProperty(event.target.value)} placeholder="Property name" />
              </div>

              <div className="form-group">
                <label>Deal Value (₹)</label>
                <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="₹85 Lakh or ₹1.25 Cr" inputMode="decimal" />
              </div>

              <div className="form-group">
                <label>Stage</label>
                <select value={stage} onChange={(event) => setStage(event.target.value)}>
                  {stages.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: "16px" }}>
              <button type="button" className="cancel-button" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
              <button type="button" className="add-button" onClick={addDeal}>
                Save Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Deals;
