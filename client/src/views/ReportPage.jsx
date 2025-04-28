import React, { useState } from "react";
import ReportFilterForm from "../components/ReportFilterForm";
import ReportResult from "../components/ReportResult";


/**
 * ReportPage Component
 * 
 * Displays a financial report page with a filter form to generate reports based on user input.
 * Allows users to export the report using the browser's print functionality.
 * 
 * Features:
 * - Provides a form for filtering report data.
 * - Fetches and displays generated report data based on selected filters.
 * - Displays errors if report generation fails.
 * - Allows users to export the report (client-side print functionality).
 * 
 * returns JSX for generating and displaying a financial report.
 */

const ReportPage = () => {
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    const handleGenerate = async (filters) => {
        setError(null);
        try {
            const res = await fetch("http://localhost:5000/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...filters,
                    userId: Number(localStorage.getItem("userId"))
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to generate report");
            setReportData(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleExport = () => {
        if (reportData) {
            // Create a new window or iframe to isolate the report content
            const printWindow = window.open('', '', 'height=600,width=800');

            // Write the content of the report to the new window
            printWindow.document.write('<html><head><title>Report</title></head><body>');
            printWindow.document.write('<h1>Financial Report</h1>');

            printWindow.document.write('<div>' + JSON.stringify(reportData, null, 2) + '</div>');

            printWindow.document.write('</body></html>');
            printWindow.document.close();

            // Trigger the print dialog
            printWindow.print();
        }
    };


    return (
        <div style={styles.pageWrapper}>
            <h1 style={styles.title}>Financial Report</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ReportFilterForm onGenerate={handleGenerate} />

            {reportData && (
                <ReportResult
                    reportData={reportData}
                    onExport={handleExport}
                />
            )}
        </div>
    );
};

const styles = {
    pageWrapper: {
        padding: "2rem 2rem",
        maxWidth: "1000px",
        margin: "0 auto",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        borderRadius: "12px",
        boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#2e3b4e",
        marginBottom: "2rem",
    },
};

export default ReportPage;
