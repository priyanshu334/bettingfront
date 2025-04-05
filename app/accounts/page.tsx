"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AccountStatement = () => {
  const [currentPage, setCurrentPage] = useState(2);

  const data = [
    { sNo: "01", date: "03-03-2025", credit: "2,000", debit: "1,000", balance: "1,000", sports: "Cricket", remarks: "Opening pts" },
    { sNo: "02", date: "04-03-2025", credit: "2,000", debit: "-", balance: "2,000", sports: "Cricket", remarks: "Opening pts" },
    { sNo: "03", date: "05-03-2025", credit: "2,000", debit: "0.00", balance: "0.00", sports: "Cricket", remarks: "Closing pts" },
  ];

  return (
    <div className="p-4 w-full  mx-auto bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Account Statement</h1>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-4">
        <Input type="date" />
        <Input type="date" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Withdraw/Deposit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Withdraw">Withdraw</SelectItem>
            <SelectItem value="Deposit">Deposit</SelectItem>
          </SelectContent>
        </Select>
        <Button>Submit</Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-orange-500 text-white">
              {['S.no', 'Date', 'Credit', 'Debit', 'Balance', 'Sports', 'Remarks'].map((heading) => (
                <th key={heading} className="border p-2">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.sNo} className="bg-yellow-300">
                <td className="border p-2 text-center">{row.sNo}</td>
                <td className="border p-2 text-center">{row.date}</td>
                <td className="border p-2 text-center text-green-700">{row.credit}</td>
                <td className="border p-2 text-center text-red-700">{row.debit}</td>
                <td className="border p-2 text-center text-green-700">{row.balance}</td>
                <td className="border p-2 text-center">{row.sports}</td>
                <td className="border p-2 text-center">{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 mt-4">
        <Button variant="outline">&lt;</Button>
        <span className="px-4">{currentPage}</span>
        <Button variant="outline">&gt;</Button>
      </div>
      <p className="text-center mt-2">Page {currentPage} of 5</p>
    </div>
  );
};

export default AccountStatement;
