"use client";

import Link from "next/link";
import { Calendar, User, ChevronRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-gray-900 group-hover:text-brand-700
                         transition-colors line-clamp-2"
          >
            {project.name}
          </h3>
          <StatusBadge status={project.status} className="shrink-0" />
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {project.description ?? "-"}
        </p>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>
            {formatDate(project.start_date)}
            {project.end_date && ` - ${formatDate(project.end_date)}`}
          </span>
        </div>
        {project.creator && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span>{project.creator.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-1 text-xs font-medium text-brand-700
                     hover:text-brand-800 transition-colors ml-auto pt-2"
        >
          View Details <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}
