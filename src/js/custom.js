console.log("in dataset page custom.js up");
const handleUserStateChange = async (user) => {
  if (user) {
    $(body).show();
  } else {
    document.location.href = "/";
  }
};
netlifyIdentity.on("init", handleUserStateChange);
