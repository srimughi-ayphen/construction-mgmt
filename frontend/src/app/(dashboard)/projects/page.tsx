"use client";

import { useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/lib/hooks";
import type { ProjectStatus } from "@/lib/types";
import { ProjectForm } from "@/components/projects/ProjectForm";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Planning", value: "planning" },
  { label: "Active", value: "active" },
  { label: "On Hold", value: "on_hold" },
  { label: "Completed", value: "completed" },
];

export default function ProjectsPage() {
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, isError, error } = useProjects({
    status: status === "all" ? undefined : (status as ProjectStatus),
    page,
    limit: 12,
  });

  const projects = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      <PageHeader
        title="Projects"
        description={
          meta ? `${meta.total} project${meta.total !== 1 ? "s" : ""}` : ""
        }
        icon={FolderKanban}
        action={
          <Button
            className="bg-brand-700 hover:bg-brand-800"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <LoadingSpinner size="lg" className="py-16" />}

      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Failed to load projects: {error?.message}
        </div>
      )}

      {!isLoading && !isError && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description="Create your first project to get started."
          actionLabel="New Project"
          onAction={() => setShowForm(true)}
        />
      )}

      {projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!meta.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ProjectForm open={showForm} onClose={() => setShowForm(false)} />
    </div>
  );
}
