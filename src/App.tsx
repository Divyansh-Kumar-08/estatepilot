import { useState } from "react";
import "./App.css";
import type { Page } from "./types";


import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import FollowUps from "./pages/FollowUps";
import Properties from "./pages/Properties";
import Deals from "./pages/Deals";
import AIAssistant from "./pages/AIAssistant";
import Settings from "./pages/Settings";

function App() {
  const [activePage, setActivePage] = useState<Page>("Dashboard");
  const [search, setSearch] = useState("");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
       return <Dashboard onNavigate={setActivePage} />;

      case "Leads":
        return <Leads />;

      case "Follow-ups":
        return <FollowUps />;

      case "Properties":
        return <Properties />;

      case "Deals":
        return <Deals />;

      case "AI Assistant":
        return <AIAssistant />;

      case "Settings":
        return <Settings />;

      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <div className="main-layout">
        <Topbar
  activePage={activePage}
  onNavigate={setActivePage}
  search={search}
  setSearch={setSearch}
/>

        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;