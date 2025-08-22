import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Challenge } from "@/types/challenge";
import { CloudProvider } from "@/types/cloudProvider";
import { updateChallengeStatus } from "@/services/challengesService";

interface ProjectTrackerProps {
  challenges: Challenge[];
  providers: CloudProvider[];
}

const ProjectTracker: React.FC<ProjectTrackerProps> = ({
  challenges,
  providers,
}) => {
  const [completedProjects, setCompletedProjects] =
    useState<typeof challenges>(challenges);

  const toggleCompleted = async (challengeId: string) => {
    const challenge = completedProjects.find((c) => c.id === challengeId);

    if (!challenge) return;

    const success = await updateChallengeStatus(
      challenge.id,
      !challenge.is_done,
    );

    if (success) {
      setCompletedProjects((prevState) => {
        return prevState.map((c) => {
          if (c.id === challenge.id) {
            return { ...c, is_done: !c.is_done };
          }
          return c;
        });
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto mt-12 px-4"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead className="w-[200px]">Provider</TableHead>
                  <TableHead className="w-[200px]">Deployment</TableHead>
                  <TableHead className="w-[150px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedProjects.map((challenge) => (
                  <TableRow key={challenge.id}>
                    <TableCell className="text-center">
                      <div className="flex justify-start">
                        <Checkbox
                          id={`challenge-${challenge.id}`}
                          checked={challenge.is_done}
                          onCheckedChange={() => toggleCompleted(challenge.id)}
                          className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                      </div>
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      style={{
                        color:
                          providers.find(
                            (p) => p.name === challenge.provider_name,
                          )?.color || undefined,
                      }}
                    >
                      {challenge.provider_name}
                    </TableCell>
                    <TableCell>{challenge.deployment_name}</TableCell>
                    <TableCell>
                      {new Date(challenge.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectTracker;
