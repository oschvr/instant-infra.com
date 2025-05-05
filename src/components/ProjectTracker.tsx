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
import { CloudProvider } from "@/types/cloudProvider";
import { motion } from "framer-motion";
import { Challenge } from "@/types/challenge";
import { Deployment } from "@/types/deployment";
import { updateChallengeStatus } from "@/services/challengesService";

interface ProjectTrackerProps {
  providers: CloudProvider[];
  deployments: Deployment[];
  challenges: Challenge[];
}

const ProjectTracker: React.FC<ProjectTrackerProps> = ({
  providers,
  challenges,
}) => {
  const [completedProjects, setCompletedProjects] =
    useState<typeof challenges>(challenges);

  const toggleCompleted = async (
    deploymentName: string,
    providerName: string
  ) => {
    const challenge = completedProjects.find(
      (c) =>
        c.deployment_name === deploymentName && c.provider_name === providerName
    );

    if (!challenge) return;

    const success = await updateChallengeStatus(
      challenge.id,
      !challenge.is_done
    );

    console.log(success);

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

  const isCompleted = (deploymentName: string, providerName: string) => {
    return completedProjects.some(
      (challenge) =>
        challenge.deployment_name === deploymentName &&
        challenge.provider_name === providerName &&
        challenge.is_done
    );
  };

  const uniqueDeployments = Array.from(
    new Set(challenges.map((c) => c.deployment_name))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto mt-12 px-4"
    >
      {/* <div className="w-full max-w-md mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to <span className="gradient-text">InstantInfra</span>
          </h1>
        </div>
      </div> */}

      <Card className="w-full">
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Deployment</TableHead>
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
                {uniqueDeployments.map((deploymentName) => (
                  <TableRow key={deploymentName}>
                    <TableCell className="font-medium">
                      {deploymentName}
                    </TableCell>
                    {providers.map((provider) => (
                      <TableCell key={provider.id} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            id={`${deploymentName}-${provider.name}`}
                            checked={isCompleted(deploymentName, provider.name)}
                            onCheckedChange={() =>
                              toggleCompleted(deploymentName, provider.name)
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectTracker;
