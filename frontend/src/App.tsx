import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Syllabus from "./pages/Syllabus";
import QuestionPapers from "./pages/QuestionPapers";
import Quiz from "./pages/Quiz";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Signup from './pages/SignUp'; // Import the Signup component
import Profile from "./pages/Profile";
import Planner from "./pages/Planner";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Simple admin route guard component
const AdminRoute = ({ element }: { element: React.ReactElement }) => {
  // In a real app, you would check if the user is logged in and is an admin
  // For demo purposes, we'll just use a simple check
  const isAdmin = localStorage.getItem('role') === 'admin';

  return isAdmin ? element : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/question-papers" element={<QuestionPapers />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} /> {/* Add the Signup route */}
            <Route path="/profile" element={<Profile />} />

            {/* Admin routes with guard */}
            <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
            <Route path="/admin/students" element={<AdminRoute element={<AdminDashboard />} />} />
            <Route path="/admin/syllabus" element={<AdminRoute element={<AdminDashboard />} />} />
            <Route path="/admin/papers" element={<AdminRoute element={<AdminDashboard />} />} />
            <Route path="/admin/settings" element={<AdminRoute element={<AdminDashboard />} />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
