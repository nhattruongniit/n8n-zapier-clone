import { polar, checkout, portal } from "@polar-sh/better-auth"; 
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polarClient } from "./polar";
import * as CONSTANTS from "@/config/constants";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: process.env.NEXT_PUBLIC_BASE_URL
    ? [process.env.NEXT_PUBLIC_BASE_URL]
    : undefined,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({   
      client: polarClient, 
      createCustomerOnSignUp: true, 
      use: [ 
        checkout({ 
          products: [ 
            { 
              productId: process.env.POLAR_PRODUCT_ID as string, // ID of Product from Polar Dashboard
              slug: CONSTANTS.POLAR_SLUG // Custom slug for easy reference in Checkout URL, e.g. /checkout/pro
            } 
          ], 
          successUrl: "/success?checkout_id={CHECKOUT_ID}",
          authenticatedUsersOnly: true
        }), 
        portal(), 
      ], 
    }) 
  ]
});