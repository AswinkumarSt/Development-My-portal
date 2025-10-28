import { useState } from "react";
import "./Filter.css";

const Filter = ({ onClose, onApplyFilter, districts = [], states = [] }) => {
  const [filters, setFilters] = useState({
    district: "",
    state: ""
  });

  // Normalize districts to lowercase and remove duplicates
  const normalizedDistricts = [...new Set(districts.map(district => 
    district ? district.toLowerCase() : ''
  ))].filter(district => district !== '').sort();

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApply = () => {
    // Apply filters with lowercase district for consistency
    const normalizedFilters = {
      district: filters.district.toLowerCase(),
      state: filters.state
    };
    onApplyFilter(normalizedFilters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      district: "",
      state: ""
    });
    onApplyFilter({ district: "", state: "" });
    onClose();
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal">
        <div className="filter-modal-header">
          <h3>Filter</h3>
          <button className="filter-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="filter-modal-content">
          <div className="filter-form">
            <div className="filter-group">
              <label>District</label>
              <select
                value={filters.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
              >
                <option value="">All Districts</option>
                {normalizedDistricts.map((district, index) => (
                  <option key={index} value={district}>
                    {district.charAt(0).toUpperCase() + district.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>State</label>
              <select
                value={filters.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
              >
                <option value="">All States</option>
                <option value="Kerala">Kerala</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Punjab">Punjab</option>
                <option value="Haryana">Haryana</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Bihar">Bihar</option>
                <option value="Odisha">Odisha</option>
                <option value="Assam">Assam</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="filter-actions">
            <button
              type="button"
              className="filter-reset-button"
              onClick={handleReset}
            >
              Reset
            </button>
            <button
              type="button"
              className="filter-apply-button"
              onClick={handleApply}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;