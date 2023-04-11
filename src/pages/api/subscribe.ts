import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions);

    const stripeCustomer = await stripe.customers.create({
      email: session.user.email
    });

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      mode: 'subscription',
      allow_promotion_codes: true,
      line_items: [
        { price: 'price_1MjBa1IF8e3GyUqHmrGBFpIs', quantity: 1 }
      ],
      success_url: process.env.SUCCESS_URL,
      cancel_url: process.env.CANCEL_URL,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }
}
