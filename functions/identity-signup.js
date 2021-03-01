const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require("./utils/fauna");
import { machineId, machineIdSync } from "node-unique-machine-id";

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);

  // create a new customer in Stripe
  const customer = await stripe.customers.create({ email: user.email });

  // subscribe the new customer to the free plan
  // await stripe.subscriptions.create({
  //   customer: customer.id,
  //   items: [{ price: process.env.STRIPE_DEFAULT_PRICE_PLAN }],
  // });

  await machineId().then((device) => {
    console.log(device);
  });

  const device = machineIdSync(true);
  console.log(device);

  console.log("Hey function");

  let role = "free";
  if (
    user.app_metadata &&
    user.app_metadata.roles &&
    user.app_metadata.roles[0] &&
    user.app_metadata.roles[0] != ""
  ) {
    role = user.app_metadata.roles[0];
  }

  // store the Netlify and Stripe IDs in Fauna
  await faunaFetch({
    query: `
      mutation ($netlifyID: ID!, $stripeID: ID!, $roleID: Int, $device: String!) {
        createUser(data: { netlifyID: $netlifyID, stripeID: $stripeID, roleID: $roleID, device: $device }) {
          netlifyID
          stripeID
          roleID
          device
        }
      }
    `,
    variables: {
      netlifyID: user.id,
      stripeID: customer.id,
      roleID: 0,
      device: device,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: [role],
      },
    }),
  };
};
