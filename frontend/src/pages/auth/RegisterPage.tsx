"use client";

import { useState } from "react";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Select } from "@/components/retroui/Select";
import type { Gender, UserType } from "@/models/enums";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [userType, setUserType] = useState<UserType | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      email,
      username,
      password,
      firstName,
      lastName,
      gender,
      userType,
    });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="space-y-6 w-80" aria-label="Register form">
        
        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <label htmlFor="username" className="block mb-1 font-medium">Username</label>
        <Input
          id="username"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <label htmlFor="password" className="block mb-1 font-medium">Password</label>
        <Input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <label htmlFor="firstName" className="block mb-1 font-medium">First Name</label>
        <Input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label htmlFor="lastName" className="block mb-1 font-medium">Last Name</label>
        <Input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label htmlFor="gender" className="block mb-1 font-medium">Gender</label>
        <Select
          value={gender}
          onValueChange={(value) => setGender(value as Gender)}
          aria-label="Gender"
        >
          <Select.Trigger className="w-full" id="gender" />
          <Select.Content>
            <Select.Item value="male">Male</Select.Item>
            <Select.Item value="female">Female</Select.Item>
            <Select.Item value="other">Other</Select.Item>
          </Select.Content>
        </Select>

        <label htmlFor="userType" className="block mb-1 font-medium">User Type</label>
        <Select
          value={userType}
          onValueChange={(value) => setUserType(value as UserType)}
          aria-label="User Type"
        >
          <Select.Trigger className="w-full" id="userType" />
          <Select.Content>
            <Select.Item value="producer">Producer</Select.Item>
            <Select.Item value="labelstaff">Label Staff</Select.Item>
          </Select.Content>
        </Select>

        <Button type="submit" className="w-full">Register</Button>
      </form>
    </div>
  );
}