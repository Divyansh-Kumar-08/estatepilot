import { useEffect, useMemo, useState } from "react";
import { properties as initialProperties } from "../data";

type Property = {
  id: number;
  name: string;
  location: string;
  type: string;
  price: string;
  status: "Available" | "Reserved" | "Sold";
};

function Properties() {
 const [propertyList, setPropertyList] = useState<Property[]>(() => {
  try {
    const saved = localStorage.getItem("estatepilot_properties");

    if (saved !== null) {
      return JSON.parse(saved) as Property[];
    }
  } catch {
    console.error("Could not load saved properties.");
  }

  return initialProperties as Property[];
});
useEffect(() => {
  try {
    localStorage.setItem(
      "estatepilot_properties",
      JSON.stringify(propertyList)
    );
  } catch {
    console.error("Could not save properties to browser storage.");
  }
}, [propertyList]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [showAdd, setShowAdd] = useState(false);
  const [selectedProperty, setSelectedProperty] =
    useState<Property | null>(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Apartment");
  const [price, setPrice] = useState("");
  const [status, setStatus] =
    useState<Property["status"]>("Available");

  const filteredProperties = useMemo(() => {
    return propertyList.filter((property) => {
      const searchText =
        `${property.name} ${property.location} ${property.type}`
          .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesFilter =
        filter === "All" ||
        property.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [propertyList, search, filter]);

  const resetForm = () => {
    setName("");
    setLocation("");
    setType("Apartment");
    setPrice("");
    setStatus("Available");
  };

  const addProperty = () => {
    if (
      !name.trim() ||
      !location.trim() ||
      !price.trim()
    ) {
      alert(
        "Please enter property name, location and price."
      );
      return;
    }

    const newProperty: Property = {
      id: Date.now(),
      name: name.trim(),
      location: location.trim(),
      type,
      price: price.trim(),
      status,
    };

    setPropertyList((current) => [
      newProperty,
      ...current,
    ]);

    resetForm();
    setShowAdd(false);
  };

  const deleteProperty = (id: number) => {
    if (!confirm("Delete this property?")) {
      return;
    }

    setPropertyList((current) =>
      current.filter(
        (property) => property.id !== id
      )
    );

    setSelectedProperty(null);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Properties</h2>
          <p>
            Manage your property inventory and
            availability.
          </p>
        </div>

        <button
          type="button"
          className="add-button"
          onClick={() => setShowAdd(true)}
        >
          + Add Property
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <div className="filter-row">
          {[
            "All",
            "Available",
            "Reserved",
            "Sold",
          ].map((item) => (
            <button
              type="button"
              key={item}
              className={`filter-button ${
                filter === item ? "active" : ""
              }`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <div>
            <h3>Property Inventory</h3>
            <p>
              {filteredProperties.length} properties
            </p>
          </div>
        </div>

        <div className="property-grid">
          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <h3>No properties found</h3>
              <p>
                Add a property or change your search.
              </p>
            </div>
          ) : (
            filteredProperties.map((property) => (
              <div
                className="property-card"
                key={property.id}
              >
                <div className="property-card-top">
                  <span className="property-type">
                    {property.type}
                  </span>

                  <span
                    className={`status status-${property.status.toLowerCase()}`}
                  >
                    {property.status}
                  </span>
                </div>

                <h3>{property.name}</h3>

                <p className="property-location">
                  📍 {property.location}
                </p>

                <div className="property-card-bottom">
                  <strong>{property.price}</strong>

                  <div>
                    <button
                      type="button"
                      className="view-button"
                      onClick={() =>
                        setSelectedProperty(property)
                      }
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        deleteProperty(property.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAdd && (
        <div
          className="modal-overlay"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h3>Add Property</h3>
                <p>
                  Add a new property to EstatePilot.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAdd(false)}
              >
                ×
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Property Name *</label>
                <input
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Skyline Residency"
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Gomti Nagar, Lucknow"
                />
              </div>

              <div className="form-group">
                <label>Property Type</label>

                <select
                  value={type}
                  onChange={(event) =>
                    setType(event.target.value)
                  }
                >
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>House</option>
                  <option>Plot</option>
                  <option>Office</option>
                  <option>Shop</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price *</label>
                <input
                  value={price}
                  onChange={(event) =>
                    setPrice(event.target.value)
                  }
                  placeholder="₹85 Lakh"
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as Property["status"]
                    )
                  }
                >
                  <option>Available</option>
                  <option>Reserved</option>
                  <option>Sold</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  resetForm();
                  setShowAdd(false);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="add-button"
                onClick={addProperty}
              >
                Add Property
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedProperty && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProperty(null)}
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h3>{selectedProperty.name}</h3>
                <p>
                  {selectedProperty.type} •{" "}
                  {selectedProperty.status}
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  setSelectedProperty(null)
                }
              >
                ×
              </button>
            </div>

            <div className="property-details">
              <p>
                <strong>Location:</strong>{" "}
                {selectedProperty.location}
              </p>

              <p>
                <strong>Price:</strong>{" "}
                {selectedProperty.price}
              </p>

              <p>
                <strong>Type:</strong>{" "}
                {selectedProperty.type}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {selectedProperty.status}
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  setSelectedProperty(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="delete-button"
                onClick={() =>
                  deleteProperty(selectedProperty.id)
                }
              >
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;