import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    clerkId: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),

  plans: defineTable({
    userId: v.string(), // userId
    name: v.string(), // plan name
    workoutPlan: v.object({
      schedule: v.array(v.string()), // ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
      exercises: v.array(
        v.object({
          day: v.string(), // monday
          routines: v.array(
            v.object({
              name: v.string(), // bench press
              sets: v.optional(v.number()), // 3 sets
              reps: v.optional(v.number()), // 8 reps
              duration: v.optional(v.string()), // 60 seconds
              description: v.optional(v.string()), // bench press
              exercises: v.optional(v.array(v.string())),
            })
          ),
        })
      ),
    }),

    dietPlan: v.object({
      dailyCalories: v.number(), // 2000
      meals: v.array(
        v.object({
          name: v.string(), // breakfast
          foods: v.array(v.string()), // ["eggs", "bacon", "toast"]
        })
      ),
    }),

    isActive: v.boolean(), // true if most recent plan
  })
    .index("by_user_id", ["userId"])
    .index("by_active", ["isActive"]),
});
