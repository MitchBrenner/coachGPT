"use client";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id as string;

  const allPlans = useQuery(api.plans.getUserPlans, { userId });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const activePlan = allPlans?.find((plan) => plan.isActive);

  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  console.log("helollasjdflaskhdj;flaksdjf;alksjdf;aslkdfja;sldkjf");
  console.log("currentPlan.dietPlan.meals", activePlan?.dietPlan);

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4">
      <ProfileHeader user={user} />

      {allPlans && allPlans?.length ? (
        <div className="space-y-8">
          {/* Plan selector */}
          <div className="relative backdrop-blur-sm border border-border p-6">
            <CornerElements />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight">
                <span className="text-primary">Your</span>
                <span className="text-foreground"> Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs text-muted-foreground">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allPlans.map((plan) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`text-foreground border hover:text-white ${
                    selectedPlanId === plan._id
                      ? "bg-primary/20 text-primary border-primary"
                      : "bg-transparent border-border hover:border-primary/50"
                  }`}
                >
                  {plan.name}
                  {plan.isActive && (
                    <span className="ml-2 bg-green-500/50 text-green-500 text-xs px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Plan details */}
          {currentPlan && (
            <div className="relative backdrop-blur-sm border border-border roundedlg p-6">
              <CornerElements />

              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-lg font-bold">
                  PLAN: <span className="text-primary">{currentPlan.name}</span>
                </h3>
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="mb-6 w-full grid-cols-2 bg-cyber-terminal-bg border">
                  <TabsTrigger
                    value="workout"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <DumbbellIcon className="mr-2 size-4" />
                    Workout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                  >
                    <AppleIcon className="mr-2 size-4" />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="size-4 text-primary" />
                      <span className="font-mono text-sm text-muted-foreground">
                        SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                      </span>
                    </div>
                  </div>

                  <Accordion type="multiple" className="space-y-4">
                    {currentPlan.workoutPlan.exercises.map(
                      (exerciseDay, index) => (
                        <AccordionItem
                          key={index}
                          value={exerciseDay.day}
                          className="border rounded-lg overflow-hidden "
                        >
                          <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono">
                            <div className="flex justify-between items-center w-full">
                              <span className="text-primary">
                                {exerciseDay.day}
                              </span>
                              <div className="text-xs text-muted-foreground">
                                {exerciseDay.routines.length} exercises
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 mt-2 px-6">
                              {exerciseDay.routines.map(
                                (routine, routineIndex) => (
                                  <div
                                    key={routineIndex}
                                    className="border border-border rounded p-3 bg-background/50"
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="flex justify-between text-foreground text-semibold text-md">
                                        {routine.name}
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <div className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mone">
                                          {routine.sets} SETS{" "}
                                        </div>
                                        <div className="px-2 py-1 rounded bg-secondary/20 text-secondary text-xs font-mone">
                                          {routine.reps} REPS
                                        </div>
                                      </div>
                                    </div>
                                    {routine.description && (
                                      <p className="text-sm text-muted-foreground">
                                        {routine.description}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </TabsContent>

                <TabsContent value="diet">
                  {/* <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="size-4 text-primary" />
                      <span className="font-mono text-sm text-muted-foreground">
                        SCHEDULE: {currentPlan.dietPlan.schedule.join(", ")}
                      </span>
                    </div>
                  </div> */}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 font-mono">
                      <p className="text-xs text-muted-foreground">
                        DAILY COLORIE TARGET:{" "}
                      </p>
                      <span className="text-xl text-semibold text-primary">
                        {currentPlan.dietPlan.dailyCalories} CAL
                      </span>
                    </div>
                    {currentPlan.dietPlan.meals.map((meal, index) => (
                      <div
                        key={index}
                        className="border rounded-lg overflow-hidden"
                      >
                        {/* <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-primary/10 font-mono"> */}
                        <div className="flex justify-between items-center w-full px-4 py-2 border-b bg-primary/10 font-mono">
                          <span className="text-primary font-semibold text-lg">
                            {meal.name}
                          </span>
                          <div className="text-xs text-muted-foreground">
                            {meal.foods.length} items
                          </div>
                        </div>
                        <div className="pb-4">
                          <div className="space-y-3 mt-2">
                            {meal.foods.map((meal, index) => (
                              <div key={index} className="overlfow-hidden">
                                <ul className="space-y-2">
                                  <li
                                    key={index}
                                    className="flex space-x-2 items-center pl-8"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                                    <span className="text-foreground">
                                      {meal}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;
