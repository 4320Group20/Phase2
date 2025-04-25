
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
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-8">
            <div>
                <label>Report Type</label>
                <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="summary">Summary</option>
                    <option value="byAccount">By Account Type</option>
                    <option value="byCategory">By Category</option>
                </select>
            </div>

            <div>
                <label>Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            <div>
                <label>End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>

            {reportType === "byAccount" && (
                <div>
                    <label>Account Type</label>
                    <input
                        type="text"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        placeholder="Assets, Liabilities, etc."
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}

            {reportType === "byCategory" && (
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Income, Expenses, etc."
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}

            <div className="col-span-2">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded"
                >
                    Generate Report
                </button>
            </div>
        </form>
    );
};

export default ReportFilterForm;
