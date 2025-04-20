"use client"
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      alert('New passwords do not match.');
      return;
    }
    // Call API or handle password change logic
    alert('Password changed successfully.');
  };

  return (
    <div className="w-full mx-auto mt-10 p-6  bg-white">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Current Password</label>
          <Input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">New Password</label>
          <Input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <Input type="password" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} required />
        </div>
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">Change Password</Button>
      </form>
    </div>
  );
}


const statsData = [
  { title: "Total Wickets in IPL", pink: 925, blue: 945, total: "Matches Played :- 24" },
  { title: "Total Wides in IPL", pink: 865, blue: 895, total: "314" },
  { title: "Total LBW in IPL", pink: 44, blue: 49, total: "12 (Matches Played :- 24)" },
  { title: "Total Stumpings in IPL", pink: 15, blue: 17, total: "5 (Matches Played :- 24)" },
  { title: "Total Run Outs in IPL", pink: 48, blue: 53, total: "13 Run Outs (Matches Played :- 24)" },
  { title: "Total Duck Outs in IPL", pink: 84, blue: 90, total: "25 (Matches Played :- 24)" },
  { title: "Total Dot Balls in IPL", pink: 178, blue: 182, total: "62 (Matches Played :- 24)" },
  { title: "Total Free Hits in IPL", pink: 0, blue: 1, total: "0 (Matches Played :- 24)" },
  { title: "Total No Balls in IPL", pink: 1, blue: 1, total: "0 (Matches Played :- 24)" },
  { title: "Total Highest Scoring Overs", pink: 157, blue: 157, total: "504" },
  
  // Additional Stats
  { title: "Total 50s in IPL", pink: 46, blue: 51, total: "Total: 97 (Matches Played :- 24)" },
  { title: "Total 100s in IPL", pink: 5, blue: 4, total: "Total: 9 (Matches Played :- 24)" },
  { title: "Highest Partnership in IPL", pink: 142, blue: 138, total: "280 Runs (RCB vs MI)" },
  { title: "Total Purple Caps", pink: "Mohammed Siraj", blue: "Kuldeep Yadav", total: "Wickets: 24 (Season)" },
  { title: "Total Orange Caps", pink: "Virat Kohli", blue: "David Warner", total: "Runs: 741 (Season)" },
  { title: "Most No Balls by Team", pink: 12, blue: 14, total: "26 (Season Total)" },
  { title: "Most Run Outs by Team", pink: 7, blue: 8, total: "15 (Season Total)" },
  { title: "Most Stumpings by Team", pink: 3, blue: 4, total: "7 (Season Total)" },
  { title: "Most Ducks by Team", pink: 9, blue: 7, total: "16 (Season Total)" },
  {title:"Total Wides in IPL" , pink: 865, blue: 895, total: "314"}
];