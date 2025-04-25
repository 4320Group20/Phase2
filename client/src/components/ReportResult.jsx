
import React from "react";

const ReportResult = ({ reportData, onExport }) => {
    return (
        <div className="bg-gray-100 border p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Report Results</h2>
            <pre className="whitespace-pre-wrap text-sm overflow-auto mb-4">
                {JSON.stringify(reportData, null, 2)}
            </pre>
            <button
                onClick={onExport}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Export as PDF
            </button>
        </div>
    );
};

export default ReportResult;
