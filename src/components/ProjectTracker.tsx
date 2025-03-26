import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CloudProvider } from "@/types/cloudProvider";
import { motion } from "framer-motion";
import { Deployment } from "@/types/deployment";

interface ProjectTrackerProps {
  providers: CloudProvider[];
  deployments: Deployment[];
}

type CompletedProject = {
  projectId: string;
  providerId: string;
};

const ProjectTracker: React.FC<ProjectTrackerProps> = ({
  providers,
  deployments,
}) => {
  const [completedProjects, setCompletedProjects] = useState<
    CompletedProject[]
  >([]);

  // Load completed projects from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("completedProjects");
    if (savedProjects) {
      setCompletedProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save completed projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "completedProjects",
      JSON.stringify(completedProjects),
    );
  }, [completedProjects]);

  const toggleCompleted = (projectId: string, providerId: string) => {
    setCompletedProjects((prevState) => {
      const existingEntry = prevState.find(
        (entry) =>
          entry.projectId === projectId && entry.providerId === providerId,
      );

      if (existingEntry) {
        // Remove if already exists
        return prevState.filter(
          (entry) =>
            !(entry.projectId === projectId && entry.providerId === providerId),
        );
      } else {
        // Add if doesn't exist
        return [...prevState, { projectId, providerId }];
      }
    });
  };

  const isCompleted = (projectId: string, providerId: string) => {
    return completedProjects.some(
      (entry) =>
        entry.projectId === projectId && entry.providerId === providerId,
    );
  };

  return (
    <Card>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl mx-auto mt-12 px-4"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Project</TableHead>
                  {providers.map((provider) => (
                    <TableHead
                      key={provider.id}
                      className="text-center"
                      style={{ color: provider.color }}
                    >
                      {provider.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {deployments.map((project) => (
                  <TableRow key={project.name}>
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    {providers.map((provider) => (
                      <TableCell key={provider.id} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`${project.name}-${provider.id}`}
                            checked={isCompleted(project.name, provider.id)}
                            onCheckedChange={() =>
                              toggleCompleted(project.name, provider.id)
                            }
                            className="data-[state=checked]:bg-[--provider-color] data-[state=checked]:border-[--provider-color]"
                            style={
                              {
                                "--provider-color": provider.color,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProjectTracker;
