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
