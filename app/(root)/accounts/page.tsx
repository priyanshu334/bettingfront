"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AccountStatement = () => {
  const [currentPage, setCurrentPage] = useState(2);
  
  const data = [
    { sNo: "01", date: "03-03-2025", credit: "2,000", debit: "1,000", balance: "1,000", sports: "Cricket", remarks: "Opening pts" },
    { sNo: "02", date: "04-03-2025", credit: "2,000", debit: "-", balance: "2,000", sports: "Cricket", remarks: "Opening pts" },
    { sNo: "03", date: "05-03-2025", credit: "2,000", debit: "0.00", balance: "0.00", sports: "Cricket", remarks: "Closing pts" },
  ];
  
  return (
    <div className="p-6 w-full mx-auto bg-gray-50 min-h-screen">
      <Card className="shadow-lg">
        <CardHeader className="bg-blue-600 text-white">
          <CardTitle className="text-3xl font-bold">Account Statement</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input type="date" placeholder="From Date" className="border-2" />
            <Input type="date" placeholder="To Date" className="border-2" />
            <Select>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Withdraw">Withdraw</SelectItem>
                <SelectItem value="Deposit">Deposit</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">Submit</Button>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  {['S.no', 'Date', 'Credit', 'Debit', 'Balance', 'Sports', 'Remarks'].map((heading) => (
                    <th key={heading} className="border border-gray-300 p-3 text-left font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={row.sNo} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="border border-gray-200 p-3 text-center font-medium">{row.sNo}</td>
                    <td className="border border-gray-200 p-3">{row.date}</td>
                    <td className="border border-gray-200 p-3 text-center font-medium text-green-600">{row.credit}</td>
                    <td className="border border-gray-200 p-3 text-center font-medium text-red-600">{row.debit}</td>
                    <td className="border border-gray-200 p-3 text-center font-medium text-blue-600">{row.balance}</td>
                    <td className="border border-gray-200 p-3">{row.sports}</td>
                    <td className="border border-gray-200 p-3">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Showing page {currentPage} of 5
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:bg-gray-100"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map(page => (
                  <Button 
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    className={`w-10 h-10 ${currentPage === page ? 'bg-blue-600 text-white' : 'border-2 border-gray-300'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="border-2 border-gray-300 hover:bg-gray-100"
                onClick={() => setCurrentPage(prev => Math.min(5, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountStatement;