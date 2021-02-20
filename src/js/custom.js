console.log("in dataset page custom.js up");
const handleUserStateChange = async (user) => {
  if (user) {
  } else {
    document.location.href = "/";
  }
};
netlifyIdentity.on("init", handleUserStateChange);
