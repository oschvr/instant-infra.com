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
              InstantInfra is a fun and interactive way to learn about cloud
              infrastructure and deployment. Our platform helps developers
              explore different cloud providers and deployment patterns through
              an engaging game-like experience.
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  We believe that learning about cloud infrastructure should be
                  accessible and enjoyable. Our mission is to help developers
                  build confidence in working with different cloud providers and
                  deployment patterns through practical, hands-on experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
                <p className="text-muted-foreground">
                  Using our interactive platform, you can spin the wheel to
                  randomly select a cloud provider, choose a project to deploy,
                  and track your progress across different cloud platforms. It's
                  a fun way to explore and learn about cloud infrastructure!
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Connect With Us</h2>
              <div className="flex gap-4">
                <a
                  href="https://github.com/yourusername/instant-infra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://twitter.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Twitter</span>
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
