console.log("in dataset page custom.js up");
const handleUserStateChange = async (user) => {
  if (user) {
    const token = user ? await netlifyIdentity.currentUser().jwt(true) : false;
    const type = "";
    fetch("/.netlify/functions/get-user-role", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data[0]);
        if (data[0] == "free") {
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
        } else {
          if (data[0] == "premium") {
            $("body").show();
          }
        }
      });
  } else {
    document.location.href = "/";
  }
};
netlifyIdentity.on("init", handleUserStateChange);
