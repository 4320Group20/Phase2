import React, { useState } from "react";
import ReportFilterForm from "../components/ReportFilterForm";
import ReportResult from "../components/ReportResult";

const ReportPage = ({ transactions, accounts }) => {
    const [reportData, setReportData] = useState(null);

    const handleGenerate = (filters) => {
        //const data = controller.generateReport(filters.reportType, filters);
        //setReportData(data);
    };

    const handleExport = () => {
        if (reportData) {
            //controller.exportToPDF(reportData);
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <h1 style={styles.title}>Financial Report</h1>

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
