const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fetch = require("node-fetch");
const { faunaFetch } = require("./utils/fauna");

exports.handler = async ({ body, headers }, context) => {
  try {
    // make sure this event was sent legitimately.
    const stripeEvent = stripe.webhooks.constructEvent(
      body,
      headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // bail if this is not a subscription update event
    if (stripeEvent.type !== "customer.subscription.updated") return;

    const subscription = stripeEvent.data.object;

    const result = await faunaFetch({
      query: `
          query ($stripeID: ID!) {
            getUserByStripeID(stripeID: $stripeID) {
              netlifyID
            }
          }
        `,
      variables: {
        stripeID: subscription.customer,
      },
    });

    const { netlifyID } = result.data.getUserByStripeID;

    // take the first word of the plan name and use it as the role
    // const plan = subscription.items.data[0].plan.nickname;
    // const role = plan.split(" ")[0].toLowerCase();

    let role = "";
    let roleID = 0;
    if (subscription.items.data[0].plan.product == "prod_IyCAbZ8bewfWEx") {
      role = "pro";
      roleID = 1;
    } else {
      role = "premium";
      roleID = 2;
    }

    // send a call to the Netlify Identity admin API to update the user role
    const { identity } = context.clientContext;
    await fetch(`${identity.url}/admin/users/${netlifyID}`, {
      method: "PUT",
      headers: {
        // note that this is a special admin token for the Identity API
        Authorization: `Bearer ${identity.token}`,
      },
      body: JSON.stringify({
        app_metadata: {
          roles: [role],
        },
        role: role,
      }),
    });

    await faunaFetch({
      query: `
        mutation ($netlifyID: ID!, $roleID: ID!) {
          updateUser(netlifyID:$netlifyID
                    data: { roleID: $roleID }) {
            netlifyID
            roleID
          }
        }
      `,
      variables: {
        netlifyID: netlifyID,
        roleID: roleID,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
