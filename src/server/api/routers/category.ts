import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { prisma } from "~/server/db/client";

export const categoryRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
      return await ctx.db.category.findMany();
    }),
  
    select: publicProcedure
      .input(
        z.object({
          userId: z.number(),
          categoryIds: z.array(z.number()),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await ctx.db.user.update({
          where: { id: input.userId },
          data: {
            categories: {
              set: input.categoryIds.map((id) => ({ id })),
            },
          },
        });
        return true;
      }),
  
    seed: publicProcedure
      .input(
        z.array(
          z.object({
            name: z.string().min(1),
          })
        )
      )
      .mutation(async ({ ctx, input }) => {
        const categoryNames = input.map(category => category.name);
        
        // Check if categories already exist to avoid duplicates
        const existingCategories = await ctx.db.category.findMany({
          where: { name: { in: categoryNames } },
          select: { name: true }
        });
  
        const existingCategoryNames = new Set(existingCategories.map(cat => cat.name));
        const newCategories = input.filter(category => !existingCategoryNames.has(category.name));
        console.log("Categories to be added:", newCategories);
        if (newCategories.length > 0) {
          await ctx.db.category.createMany({
            data: newCategories
          });
        }
        
        return { count: newCategories.length };
      }),
  });
  