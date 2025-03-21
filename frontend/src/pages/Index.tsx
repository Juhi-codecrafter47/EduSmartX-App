import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, BookOpen, BarChart2, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Index = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          ref={heroRef}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
          variants={staggerChildren}
          className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div variants={fadeIn} className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                  Welcome to EduSmartX
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Your personalized learning platform for exam preparation and academic success.
                </p>
              </motion.div>
              <motion.div variants={fadeIn} className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/login">
                  <Button size="lg" className="gap-1.5 bg-primary hover:bg-primary/90 text-white">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
              <motion.img
                variants={fadeIn}
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                alt="Students studying"
                className="mt-8 rounded-xl shadow-2xl w-full max-w-4xl aspect-video object-cover"
              />
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          ref={featuresRef}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
          variants={staggerChildren}
          className="w-full py-12 md:py-24 lg:py-32 bg-white"
        >
          <div className="container px-4 md:px-6">
            <motion.div variants={fadeIn} className="text-center mb-12">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">
                Everything you need to excel in your studies
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                EduSmartX provides a comprehensive learning experience with cutting-edge features
              </p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <motion.div variants={fadeIn}>
                <Card className="hover:shadow-lg transition-shadow border-none bg-secondary">
                  <CardHeader>
                    <BookOpen className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Adaptive Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Smart quizzes that adapt to your learning style and pace, ensuring optimal progress.</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="hover:shadow-lg transition-shadow border-none bg-secondary">
                  <CardHeader>
                    <BarChart2 className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>Progress Tracking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Advanced analytics and insights to monitor your improvement over time.</p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Card className="hover:shadow-lg transition-shadow border-none bg-secondary">
                  <CardHeader>
                    <Brain className="h-8 w-8 mb-2 text-primary" />
                    <CardTitle>AI Assistance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">24/7 AI-powered support to help you overcome challenging topics.</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          ref={ctaRef}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={staggerChildren}
          className="w-full py-12 md:py-24 lg:py-32 bg-secondary"
        >
          <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
            <motion.div variants={fadeIn} className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                Join Today
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Transform your learning journey
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of successful students who have already improved their academic performance with EduPrep.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/login">
                  <Button size="lg" className="gap-2 bg-primary hover:bg-primary/90 text-white">
                    Get Started Free <Sparkles className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div variants={fadeIn} className="relative">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80"
                alt="Student success"
                className="rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-xl" />
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 EduSmartX. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline" to="#">
              Terms
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline" to="#">
              Privacy
            </Link>
            <Link className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline" to="#">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;