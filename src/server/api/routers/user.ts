import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

import { sendOTP } from "~/utils/mailerSend";
const JWT_SECRET = process.env.JWT_SECRET || "moonsecret"; 

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) throw new Error("User already exists");

      const otp = Math.floor(10000000 + Math.random() * 90000000).toString();
      await ctx.db.oTP.create({
        data: {
          name: input.name,
          email: input.email,
          code: otp,
          password: input.password,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      });

      // sendOTP(input.email, otp);
      return true;
    }),

  verifyOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        code: z.string().length(8),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      const otpEntry = await ctx.db.oTP.findFirst({
        where: { email: input.email },
      });
      // if (!otpEntry || otpEntry.code !== input.code || otpEntry.expiresAt < new Date()) {
      //   throw new Error('Invalid or expired OTP');
      // }
      if(otpEntry?.password){
        const hashedPassword = await bcrypt.hash(otpEntry.password, 10);
        await ctx.db.user.create({
          data: {
            name: otpEntry?.name || "user",
            email: input.email,
            password: hashedPassword,
          },
        });
  
        await ctx.db.oTP.delete({
          where: { id: otpEntry?.id },
        });
      }

      return true;
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
        include: { categories: true },
      });
      if (!user || !(await bcrypt.compare(input.password, user.password))) {
        throw new Error("Invalid credentials");
      }
      const token = jwt.sign(
        { id: user.id, categories: user.categories }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );
      return { user, token };
    }),
    getUserDetails: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: { categories: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    }),
});
