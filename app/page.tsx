"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Users, Share2, Globe, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 pt-12 md:pt-24">
      {/* Hero Section */}
      <section className="container mx-auto px-[10%] py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Hero content */}
            <div className="text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-tr from-blue-900 via-indigo-900 to-gray-900 bg-clip-text text-transparent">
                Share Your Name Pronunciation
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Help others learn the correct pronunciation of your name with
                audio recordings, phonetic spellings, and shareable cards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {user ? (
                  <>
                    <Link href="/create">
                      <Button size="lg" className="w-full sm:w-auto">
                        <Mic className="mr-2 h-5 w-5" />
                        Create Name Card
                      </Button>
                    </Link>
                    <Link href="/gallery">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        <Globe className="mr-2 h-5 w-5" />
                        Explore Gallery
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth?mode=signup">
                      <Button size="lg" className="w-full sm:w-auto">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/gallery">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        <Globe className="mr-2 h-5 w-5" />
                        View Gallery
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right side - Demo Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="max-w-sm w-full perspective-1000">
                <Card className="hover:shadow-2xl transition-all duration-500 bg-gradient-to-tr from-blue-900 via-indigo-900 to-gray-900 backdrop-blur-sm border-white/20 rounded-2xl overflow-hidden group transform hover:rotate-y-6 hover:scale-105 shadow-xl hover:shadow-blue-900/20">
                  <CardContent className="p-10">
                    <div className="space-y-8">
                      <div className="text-center space-y-3">
                        <h3 className="text-3xl font-bold text-blue-200">
                          Faiaz
                        </h3>

                        <p className="text-white font-mono text-base">
                          faa-ai-aaz
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-white/80 px-4 py-1"
                          >
                            <span>🇸🇦</span>
                            <span className="ml-1">Arabic</span>
                          </Badge>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-white/80 px-4 py-1"
                        >
                          he/him
                        </Badge>
                      </div>

                      <div
                        className={`relative rounded-2xl overflow-hidden text-white backdrop-blur-sm`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                        <p
                          className={`text-sm text-white p-6 text-center relative z-10 leading-relaxed`}
                        >
                          <span className="opacity-70 block mb-2">
                            Origin or Meaning:
                          </span>
                          <span className="font-medium">
                            Faiaz Means &apos;charitable&apos; in Arabic
                          </span>
                        </p>
                      </div>

                      <div className="relative flex justify-center py-4">
                        {/* Ripple Effects */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#2b5876] to-[#4e4376] opacity-20 animate-ripple"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#2b5876] to-[#4e4376] opacity-20 animate-ripple-delayed"></div>
                        </div>

                        {/* Play Button */}
                        <Button
                          size="lg"
                          className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800 text-white border-0 hover:opacity-90 transition-all duration-300 hover:scale-110 shadow-2xl relative z-10"
                        >
                          <Play className="h-10 w-10 ml-1 text-white" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Help People Say Your Name Right!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Simple steps to share your name pronunciation with the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-blue-50 rounded-2xl">
            <CardContent className="pt-6">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Record Your Name</h3>
              <p className="text-muted-foreground">
                Record a 5-second audio clip of your name pronunciation with our
                built-in recorder
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-green-50 rounded-2xl">
            <CardContent className="pt-6">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Details</h3>
              <p className="text-muted-foreground">
                Include phonetic spelling, pronouns, and the meaning or origin
                of your name
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-purple-50 rounded-2xl">
            <CardContent className="pt-6">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share Everywhere</h3>
              <p className="text-muted-foreground">
                Generate shareable links, QR codes, and share on social media
                platforms
              </p>
            </CardContent>
          </Card>
        </div>
        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 max-w-6xl">
          <Card className="bg-indigo-100 text-black">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Share Your Name?
              </h2>
              <p className="text-gray-800 mb-8 max-w-2xl mx-auto">
                Join thousands of people who are helping others learn the
                correct pronunciation of their names.
              </p>
              {user ? (
                <Link href="/create">
                  <Button size="lg" variant="secondary">
                    <Mic className="mr-2 h-5 w-5" />
                    Create Your Name Card
                  </Button>
                </Link>
              ) : (
                <Link href="/auth?mode=signup">
                  <Button size="lg" variant="secondary">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </section>
      </section>
    </div>
  );
}
