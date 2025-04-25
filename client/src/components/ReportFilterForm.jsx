import React, { useState } from "react";

const ReportFilterForm = ({ onGenerate }) => {
    const [reportType, setReportType] = useState("summary");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [accountType, setAccountType] = useState("");
    const [category, setCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate({
            reportType,
            startDate,
            endDate,
            accountType,
            category,
        });
    };

    return (
        <div style={styles.formWrapper}>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputWrapper}>
                    <label style={styles.label}>Report Type</label>
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        style={styles.input}
                    >
                        <option value="summary">Summary</option>
                        <option value="byAccount">By Account Type</option>
                        <option value="byCategory">By Category</option>
                    </select>
                </div>

                <div style={styles.inputWrapper}>
                    <label style={styles.label}>Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputWrapper}>
                    <label style={styles.label}>End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={styles.input}
                    />
                </div>

                {reportType === "byAccount" && (
                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>Account Type</label>
                        <input
                            type="text"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            placeholder="Assets, Liabilities, etc."
                            style={styles.input}
                        />
                    </div>
                )}

                {reportType === "byCategory" && (
                    <div style={styles.inputWrapper}>
                        <label style={styles.label}>Category</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Income, Expenses, etc."
                            style={styles.input}
                        />
                    </div>
                )}

                <div style={styles.submitButtonWrapper}>
                    <button type="submit" style={styles.primaryButton}>
                        Generate Report
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    formWrapper: {
        backgroundColor: "rgba(255,255,255,0.85)",
        borderRadius: "12px",
        padding: "3rem 2rem",
        width: "360px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
        textAlign: "center",
        margin: "0 auto",
    },
    inputWrapper: {
        marginBottom: "1.5rem",
        textAlign: "left",
    },
    label: {
        display: "block",
        fontWeight: "bold",
        marginBottom: "0.5rem",
        fontSize: "1rem",
        color: "#2e3b4e",
    },
    input: {
        width: "100%",
        padding: "0.75rem",
        marginBottom: "1rem",
        fontSize: "1rem",
        fontFamily: "inherit",
        borderRadius: "6px",
        border: "1px solid #ccc",
        boxSizing: "border-box",
    },
    primaryButton: {
        display: "block",
        width: "100%",
        padding: "0.75rem",
        fontSize: "1rem",
        fontFamily: "inherit",
        cursor: "pointer",
        border: "none",
        borderRadius: "6px",
        background: "#007bff",
        color: "white",
    },
    submitButtonWrapper: {
        marginTop: "2rem",
    },
};

export default ReportFilterForm;
