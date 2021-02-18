const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { faunaFetch } = require("./utils/fauna");

exports.handler = async (event) => {
  fetch("/.netlify/functions/create-manage-link", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.token.access_token}`,
    },
  })
    .then((res) => res.json())
    .then((link) => {
      window.location.href = link;
    })
    .catch((err) => console.error(err));
};
