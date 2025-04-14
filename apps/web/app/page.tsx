import React from 'react';
import { Camera, Code, Users, Lock, Home, GitBranch, Zap, Brain } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { ModeToggle } from '@/components/mode-toggle';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar with Mode Toggle */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Code className="h-6 w-6 mr-2 text-primary" />
            <span className="font-bold text-lg">CodeShare</span>
          </div>
          <ModeToggle /> {/* Client component used within server component */}
        </div>
      </nav>


      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center mb-6 animate-pulse">
              <Code className="h-10 w-10 mr-2 text-primary" />
              <h1 className="text-4xl md:text-6xl font-bold">CodeShare</h1>
            </div>
            <h2 className="text-xl md:text-2xl mb-6 text-muted-foreground max-w-2xl">
              Real-time collaborative code editing for seamless team development
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
              <Button size="lg" variant="outline">
                Live Demo
              </Button>
            </div>
          </div>

          {/* Code Editor Preview */}
          <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="bg-muted p-2 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <div className="flex-1 text-xs px-2">collaborative-editor.js</div>
            </div>
            <div className="p-4 font-mono text-sm overflow-x-auto bg-background/95">
              <pre className="text-left">
                <code className="text-foreground">
                  <span className="text-blue-500">import</span> {` { WebSocket } `}<span className="text-blue-500">from</span> <span className="text-green-500">'ws'</span>;{'\n'}
                  <span className="text-blue-500">import</span> {` { Doc } `}<span className="text-blue-500">from</span> <span className="text-green-500">'yjs'</span>;{'\n\n'}
                  <span className="text-purple-500">class</span> <span className="text-yellow-500">CollabServer</span> {'{'}{'\n'}
                  {'  '}<span className="text-blue-500">constructor</span>() {'{'}{'\n'}
                  {'    '}this.rooms = <span className="text-blue-500">new</span> Map();{'\n'}
                  {'    '}this.connections = <span className="text-blue-500">new</span> Map();{'\n'}
                  {'  }'}{'\n\n'}
                  {'  '}<span className="text-yellow-500">createRoom</span>(roomId) {'{'}{'\n'}
                  {'    '}const doc = <span className="text-blue-500">new</span> Doc();{'\n'}
                  {'    '}this.rooms.set(roomId, {'{'} doc, users: [] {'}'});{'\n'}
                  {'    '}<span className="text-blue-500">return</span> roomId;{'\n'}
                  {'  }'}{'\n'}
                  {'}'}{'\n\n'}
                  <span className="text-blue-500">export</span> <span className="text-blue-500">default</span> <span className="text-blue-500">new</span> <span className="text-yellow-500">CollabServer</span>();{'\n'}
                </code>
              </pre>
            </div>

            {/* User Indicators */}
            <div className="flex p-2 bg-muted gap-2">
              <div className="flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Alice
              </div>
              <div className="flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                Bob
              </div>
              <div className="flex items-center px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                Carol
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Collaboration Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Lock className="h-10 w-10 mb-4 text-primary" />,
                title: "Secure Authentication",
                description: "JWT-based security keeps your code and collaboration private"
              },
              {
                icon: <Home className="h-10 w-10 mb-4 text-primary" />,
                title: "Room-based Architecture",
                description: "Create private spaces for focused team collaboration"
              },
              {
                icon: <GitBranch className="h-10 w-10 mb-4 text-primary" />,
                title: "Conflict-free Editing",
                description: "Yjs CRDT technology ensures seamless concurrent edits"
              },
              {
                icon: <Zap className="h-10 w-10 mb-4 text-primary" />,
                title: "Efficient Delta Updates",
                description: "Only changes are synced, making collaboration lightning fast"
              },
              {
                icon: <Brain className="h-10 w-10 mb-4 text-primary" />,
                title: "Smart Syncing",
                description: "Intelligent code update merging and conflict resolution"
              },
              {
                icon: <Users className="h-10 w-10 mb-4 text-primary" />,
                title: "Live User Presence",
                description: "See team members' cursor positions and selections in real-time"
              },
              {
                icon: <Camera className="h-10 w-10 mb-4 text-primary" />,
                title: "Code Snapshots",
                description: "Easily create and restore point-in-time code snapshots"
              },
              {
                icon: <Code className="h-10 w-10 mb-4 text-primary" />,
                title: "WebSocket Communication",
                description: "Fast, reliable real-time connection between collaborators"
              }
            ].map((feature, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex flex-col items-center text-center pt-6">
                  {feature.icon}
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Create a Room",
                  description: "Start a new collaborative session with a unique room ID"
                },
                {
                  step: "2",
                  title: "Invite Collaborators",
                  description: "Share your room ID with team members to join the session"
                },
                {
                  step: "3",
                  title: "Code Together",
                  description: "Edit code simultaneously with real-time updates and conflict resolution"
                },
                {
                  step: "4",
                  title: "Deploy with Confidence",
                  description: "Export your collaborative work when you're ready to ship"
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to code collaboratively?</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building better software together with CodeShare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Code className="h-6 w-6 mr-2 text-primary" />
              <span className="font-bold text-lg">CodeShare</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CodeShare. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;