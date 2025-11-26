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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Challenge } from "@/types/challenge";
import { CloudProvider } from "@/types/cloudProvider";
import { updateChallengeStatus } from "@/services/challengesService";
import { ExternalLink } from "lucide-react";

interface ProjectTrackerProps {
  challenges: Challenge[];
  providers: CloudProvider[];
}

// Helper function to extract YouTube video ID from various URL formats
const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&]+)/,
    /(?:youtu\.be\/)([^?]+)/,
    /(?:youtube\.com\/embed\/)([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

const ProjectTracker: React.FC<ProjectTrackerProps> = ({
  challenges,
  providers,
}) => {
  const [completedProjects, setCompletedProjects] =
    useState<typeof challenges>(challenges);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleCompleted = async (challengeId: string) => {
    const challenge = completedProjects.find((c) => c.id === challengeId);

    if (!challenge) return;

    const success = await updateChallengeStatus(
      challenge.id,
      !challenge.is_done
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

  const handleVideoClick = (videoUrl: string) => {
    if (videoUrl) {
      setSelectedVideo(videoUrl);
      setDialogOpen(true);
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
                  <TableHead className="w-[150px]">Video</TableHead>
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
                            (p) => p.name === challenge.provider_name
                          )?.color || undefined,
                      }}
                    >
                      {challenge.provider_name}
                    </TableCell>
                    <TableCell>{challenge.deployment_name}</TableCell>
                    <TableCell>
                      {new Date(challenge.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {challenge.video_url ? (
                        <button
                          onClick={() => handleVideoClick(challenge.video_url)}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Watch
                        </button>
                      ) : (
                        <span className="text-gray-400">No video</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Challenge Video</DialogTitle>
          </DialogHeader>
          {selectedVideo && getYouTubeVideoId(selectedVideo) && (
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedVideo)}`}
                title="YouTube video player"
                style={{ border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-md"
              ></iframe>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ProjectTracker;
