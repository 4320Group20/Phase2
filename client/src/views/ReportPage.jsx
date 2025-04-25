import React, { useState } from "react";
import ReportFilterForm from "../components/ReportFilterForm";
import ReportResult from "../components/ReportResult";

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
        // Simple client-side print/export fallback
        if (reportData) {
            window.print();
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
