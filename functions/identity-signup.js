const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require("./utils/fauna");

exports.handler = async (event) => {
  const { user } = JSON.parse(event.body);

  // create a new customer in Stripe
  const customer = await stripe.customers.create({ email: user.email });

  // subscribe the new customer to the free plan
  await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: process.env.STRIPE_DEFAULT_PRICE_PLAN }],
  });

  // let roleID = 0;
  // if (user.role != "") {
  //   roleID = 2;
  // }

  // store the Netlify and Stripe IDs in Fauna
  await faunaFetch({
    query: `
      mutation ($netlifyID: ID!, $stripeID: ID!, $roleID: Int) {
        createUser(data: { netlifyID: $netlifyID, stripeID: $stripeID, roleID: $roleID }) {
          netlifyID
          stripeID
          roleID
        }
      }
    `,
    variables: {
      netlifyID: user.id,
      stripeID: user.app_metadata.roles[0],
      roleID: 0,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      app_metadata: {
        roles: ["free"],
      },
    }),
  };
};
