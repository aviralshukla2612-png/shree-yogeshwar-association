import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './ExportButton.css';

const ExportButton = ({ 
  data, 
  fileName = 'society-data', 
  sheetName = 'Sheet1',
  buttonText = 'Export to Excel',
  columns = null // Custom column mapping
}) => {
  
  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }

    try {
      let exportData = data;

      // If columns mapping is provided, use it
      if (columns) {
        exportData = data.map(item => {
          const newItem = {};
          columns.forEach(col => {
            newItem[col.header] = item[col.key] || '';
          });
          return newItem;
        });
      }

      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Auto-size columns
      const maxWidth = 50;
      const colWidths = [];
      const headers = Object.keys(exportData[0] || {});
      headers.forEach((header, index) => {
        const maxCellWidth = Math.max(
          header.length,
          ...exportData.map(row => {
            const val = row[header];
            return val ? String(val).length : 0;
          })
        );
        colWidths[index] = { wch: Math.min(maxCellWidth + 2, maxWidth) };
      });
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });

      // Create blob and download
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const date = new Date().toISOString().split('T')[0];
      saveAs(blob, `${fileName}_${date}.xlsx`);

    } catch {
      alert('Error exporting data. Please try again.');
    }
  };

  return (
    <button className="export-btn" onClick={exportToExcel}>
      {buttonText}
    </button>
  );
};

export default ExportButton;
