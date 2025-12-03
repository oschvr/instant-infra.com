import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Twitter } from "lucide-react";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="container py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h1 className="text-4xl font-bold mb-6 gradient-text">
              About InstantInfra
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              A fun-focused content channel exploring cloud infrastructure
              through hands-on experiments, Infrastructure as Code challenges,
              and other deployments across multiple cloud providers
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Why?</h2>Doing
                something complex for the sake of it, enjoy the process and
                learn a lot from it. It's close to my personal definition of
                fun.
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground py-2">
                  <li>
                    Wanting to prove myself that I can execute my own crazy
                    ideas. Nothing is more satisfying and accomplishing, I
                    think.
                  </li>
                  <li>
                    I want to become very very good with Terraform/OpenTofu (and
                    whatever comes with it, be it Python, Bash or any other).
                  </li>
                  <li>
                    Again, I'm yearning for learning new things and by doing
                    this publicly, inevitably someone from the audience will
                    suggest a better approach of what I'm doing. That is
                    absolutely golden in my opinion.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">What?</h2>

                <p className="text-muted-foreground">Infra Roulette:</p>
                <ol className="list-decimal pl-6 space-y-2 text-muted-foreground py-2">
                  <li>Randomly pick one cloud provider (AWS, GCP, OCI, etc)</li>
                  <li>
                    Randomly pick one deployment from a list of architectures
                    (Simple VM, Storage bucket, K8s cluster, etc)
                  </li>
                  <li>
                    Try to create and apply the outcome in less than 15/30
                    minutes (depending complexity)
                  </li>
                </ol>
                <p className="text-muted-foreground">Guides:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground py-2">
                  <li>How to setup your local environment like mine</li>
                  <li>Initial setup and helper repository for multicloud</li>
                  <li>How to setup a cloud account with Terraform/OpenTofu</li>
                </ul>
                <p className="text-muted-foreground">Random challenges:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground py-2">
                  <li>Let AI drive a full end to end IaC deployment</li>
                  <li>
                    Search, modify or create weird Terraform/OpenTofu providers
                  </li>
                  <li>Untangle a complex or broken Terraform/OpenTofu state</li>
                  <li>Open to suggestions !</li>
                  <li>¯\_(ツ)_/¯</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Connect </h2>
              <div className="flex gap-4">
                <a
                  href="https://github.com/oschvr/instant-infra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://twitter.com/oschvr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Twitter/X</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default About;
