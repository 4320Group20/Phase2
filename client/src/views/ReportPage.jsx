
import React, { useState } from "react";
import ReportFilterForm from "../components/ReportFilterForm";
import ReportResult from "../components/ReportResult";


const ReportPage = ({ transactions, accounts }) => {
    const [reportData, setReportData] = useState(null);
    //const controller = new GenerateReportController(transactions, accounts);

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Financial Report</h1>

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

export default ReportPage;
