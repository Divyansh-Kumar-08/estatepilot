import type { Page } from "../types";

type SidebarProps = {
  activePage: Page;
    onNavigate: (page: Page) => void;
    };

    const navigation: { name: Page; icon: string }[] = [
      { name: "Dashboard", icon: "⌂" },
        { name: "Leads", icon: "◎" },
          { name: "Follow-ups", icon: "◷" },
            { name: "Properties", icon: "▣" },
              { name: "Deals", icon: "◇" },
                { name: "AI Assistant", icon: "✦" },
                ];

                function Sidebar({ activePage, onNavigate }: SidebarProps) {
                  return (
                      <aside className="sidebar">
                            <div className="brand">
                                    <div className="brand-mark">E</div>

                                            <div className="brand-text">
                                                      <strong>EstatePilot</strong>
                                                                <span>Deal Execution Engine</span>
                                                                        </div>
                                                                              </div>

                                                                                    <div className="workspace-label">
                                                                                            WORKSPACE
                                                                                                  </div>

                                                                                                        <nav className="sidebar-nav">
                                                                                                                {navigation.map((item) => (
                                                                                                                          <button
                                                                                                                                      key={item.name}
                                                                                                                                                  className={`nav-item ${
                                                                                                                                                                activePage === item.name ? "active" : ""
                                                                                                                                                                            }`}
                                                                                                                                                                                        onClick={() => onNavigate(item.name)}
                                                                                                                                                                                                  >
                                                                                                                                                                                                              <span className="nav-icon">
                                                                                                                                                                                                                            {item.icon}
                                                                                                                                                                                                                                        </span>

                                                                                                                                                                                                                                                    <span>{item.name}</span>

                                                                                                                                                                                                                                                                {item.name === "Follow-ups" && (
                                                                                                                                                                                                                                                                              <span className="nav-badge">12</span>
                                                                                                                                                                                                                                                                                          )}
                                                                                                                                                                                                                                                                                                    </button>
                                                                                                                                                                                                                                                                                                            ))}
                                                                                                                                                                                                                                                                                                                  </nav>

                                                                                                                                                                                                                                                                                                                        <div className="sidebar-bottom">
                                                                                                                                                                                                                                                                                                                                <button
                                                                                                                                                                                                                                                                                                                                          className={`nav-item ${
                                                                                                                                                                                                                                                                                                                                                      activePage === "Settings" ? "active" : ""
                                                                                                                                                                                                                                                                                                                                                                }`}
                                                                                                                                                                                                                                                                                                                                                                          onClick={() => onNavigate("Settings")}
                                                                                                                                                                                                                                                                                                                                                                                  >
                                                                                                                                                                                                                                                                                                                                                                                            <span className="nav-icon">⚙</span>
                                                                                                                                                                                                                                                                                                                                                                                                      <span>Settings</span>
                                                                                                                                                                                                                                                                                                                                                                                                              </button>

                                                                                                                                                                                                                                                                                                                                                                                                                      <div className="user-card">
                                                                                                                                                                                                                                                                                                                                                                                                                                <div className="avatar">EP</div>

                                                                                                                                                                                                                                                                                                                                                                                                                                          <div className="user-info">
                                                                                                                                                                                                                                                                                                                                                                                                                                                      <strong>My Workspace</strong>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                  <span>Free Plan</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <span className="more-icon">•••</span>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </aside>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          );
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          }

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          export default Sidebar;