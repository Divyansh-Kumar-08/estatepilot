import type { Page } from "../types";

type TopbarProps = {
  activePage: Page;
    search: string;
      setSearch: (value: string) => void;
        onNavigate: (page: Page) => void;
        };

        function Topbar({
          activePage,
            search,
              setSearch,
                onNavigate,
                }: TopbarProps) {
                  return (
                      <header className="topbar">
                            <div className="topbar-title">
                                    <div className="breadcrumb">
                                              Workspace / {activePage}
                                                      </div>

                                                              <h1>{activePage}</h1>
                                                                    </div>

                                                                          <div className="topbar-actions">
                                                                                  <div className="search-box">
                                                                                            <span>⌕</span>

                                                                                                      <input
                                                                                                                  value={search}
                                                                                                                              onChange={(event) =>
                                                                                                                                            setSearch(event.target.value)
                                                                                                                                                        }
                                                                                                                                                                    placeholder="Search leads, properties..."
                                                                                                                                                                              />

                                                                                                                                                                                        <kbd>⌘ K</kbd>
                                                                                                                                                                                                </div>

                                                                                                                                                                                                        <button
                                                                                                                                                                                                                  className="icon-button"
                                                                                                                                                                                                                            title="Notifications"
                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                              ◔
                                                                                                                                                                                                                                                        <span className="notification-dot" />
                                                                                                                                                                                                                                                                </button>

                                                                                                                                                                                                                                                                        <button
                                                                                                                                                                                                                                                                                  className="add-button"
                                                                                                                                                                                                                                                                                            onClick={() => onNavigate("Leads")}
                                                                                                                                                                                                                                                                                                    >
                                                                                                                                                                                                                                                                                                              <span>+</span>
                                                                                                                                                                                                                                                                                                                        Add Lead
                                                                                                                                                                                                                                                                                                                                </button>
                                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                                          </header>
                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                            export default Topbar;