import React, { useState } from 'react';
import SearchBar from '../Common/SearchBar';
import ResidentCard from './ResidentCard';
import './ResidentTable.css';

const ResidentTable = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((resident) => {
    const search = searchTerm.toLowerCase();

    return (
      resident.name.toLowerCase().includes(search) ||
      resident.flat.toLowerCase().includes(search) ||
      resident.phone.includes(search)
    );
  });

  return (
    <div className="resident-table-container">

      {/* Header */}
      <div className="table-header">
        <h2>Residents</h2>

        <SearchBar
          placeholder="Search residents..."
          onSearch={setSearchTerm}
        />
      </div>

      {/* ================= Desktop Table ================= */}

      <div className="table-wrapper desktop-view">
        <table className="resident-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Flat</th>
              <th>Phone</th>
              <th>Maintenance Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((resident) => (
                <tr key={resident.id}>
                  <td>{resident.name}</td>

                  <td>{resident.flat}</td>

                  <td>{resident.phone}</td>

                  <td>
                    <span
                      className={`status-badge ${resident.maintenanceStatus.toLowerCase()}`}
                    >
                      {resident.maintenanceStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "25px",
                    color: "#7f8c8d",
                  }}
                >
                  No residents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile Cards ================= */}

      <div className="mobile-view">
        {filteredData.length > 0 ? (
          filteredData.map((resident) => (
            <ResidentCard
              key={resident.id}
              resident={resident}
            />
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "25px",
              color: "#7f8c8d",
            }}
          >
            No residents found.
          </div>
        )}
      </div>

    </div>
  );
};

export default ResidentTable;