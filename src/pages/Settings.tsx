
import { useState } from "react";
import type { FormEvent } from "react";

function Settings() {
  const [name, setName] = useState(
    localStorage.getItem("estatepilot_name") || "Admin"
  );
  const [email, setEmail] = useState(
    localStorage.getItem("estatepilot_email") || ""
  );
  const [agency, setAgency] = useState(
    localStorage.getItem("estatepilot_agency") || "My Real Estate Agency"
  );
  const [saved, setSaved] = useState(false);

  const saveSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    localStorage.setItem("estatepilot_name", name.trim());
    localStorage.setItem("estatepilot_email", email.trim());
    localStorage.setItem("estatepilot_agency", agency.trim());

    setSaved(true);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your EstatePilot profile and agency details.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Profile Settings</h3>
            <p>Your account information</p>
          </div>
        </div>

        <form className="settings-form" onSubmit={saveSettings}>
          <div className="settings-field">
            <label htmlFor="settings-name">Full Name</label>
            <input
              id="settings-name"
              className="search-input"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
              autoComplete="name"
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="settings-email">Email Address</label>
            <input
              id="settings-email"
              className="search-input"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSaved(false);
              }}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="settings-field">
            <label htmlFor="settings-agency">Agency Name</label>
            <input
              id="settings-agency"
              className="search-input"
              value={agency}
              onChange={(event) => {
                setAgency(event.target.value);
                setSaved(false);
              }}
              autoComplete="organization"
              required
            />
          </div>

          <div className="settings-actions">
            <button className="add-button" type="submit">
              Save Settings
            </button>

            {saved && (
              <p className="settings-success" role="status">
                Settings saved successfully!
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
