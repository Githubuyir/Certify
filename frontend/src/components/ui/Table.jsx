import React from 'react';

export const Table = ({ columns, data, keyExtractor }) => {
  return (
    <div className="table-container shadow-sm border rounded-lg" style={{ borderColor: 'var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <table>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={col.className || ''}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={keyExtractor ? keyExtractor(row) : rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={col.className || ''}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-muted">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
