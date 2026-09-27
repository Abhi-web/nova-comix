import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import MangaListPage from "../pages/MangaListPage";
import GenresPage from "../pages/GenresPage";
import RankingsPage from "../pages/RankingsPage";
import MangaDetailPage from "../pages/MangaDetailPage";
import ReaderPage from "../pages/ReaderPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

// Admin Imports
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminStoriesPage from "../pages/admin/AdminStoriesPage";
import AdminStoryFormPage from "../pages/admin/AdminStoryFormPage";
import AdminChaptersPage from "../pages/admin/AdminChaptersPage";
import AdminChapterFormPage from "../pages/admin/AdminChapterFormPage";
import AdminUsersPage from "../pages/admin/AdminUsersPage";
import AdminSettingsPage from "../pages/admin/AdminSettingsPage";

import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

function NotFoundPage() {
  return (
    <div className="py-20">
      <EmptyState
        title="Page not found"
        description="The archival route you entered does not exist or has been relocated."
        action={
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        }
      />
    </div>
  );
}

/**
 * Global Route Definitions for NOVA PANEL
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Distraction-Free Full-Width Reader Route */}
      <Route path="/read/:chapterId" element={<ReaderPage />} />

      {/* Protected Admin Console Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="stories" element={<AdminStoriesPage />} />
        <Route path="stories/new" element={<AdminStoryFormPage />} />
        <Route path="stories/:id/edit" element={<AdminStoryFormPage />} />
        <Route path="stories/:id/chapters" element={<AdminChaptersPage />} />
        <Route path="stories/:id/chapters/new" element={<AdminChapterFormPage />} />
        <Route path="stories/:id/chapters/:chapterId/edit" element={<AdminChapterFormPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Main Shell Layout Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/manga" element={<MangaListPage />} />
        <Route path="/genres" element={<GenresPage />} />
        <Route path="/rankings" element={<RankingsPage />} />
        <Route path="/manga/:id" element={<MangaDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
