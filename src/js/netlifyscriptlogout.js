const button1 = document.getElementById("left");
const button2 = document.getElementById("right");

const login = () => netlifyIdentity.open("login");
const signup = () => netlifyIdentity.open("signup");

// by default, add login and signup functionality
button1.addEventListener("click", login);
button2.addEventListener("click", signup);

const updateUserInfo = (user) => {
  const container = document.querySelector(".user-info");

  // cloning the buttons removes existing event listeners
  const b1 = button1.cloneNode(true);
  const b2 = button2.cloneNode(true);

  // empty the user info div
  container.innerHTML = "";

  if (user) {
    b1.innerText = "Log Out";
    b1.addEventListener("click", () => {
      netlifyIdentity.logout();
    });

    b2.innerText = "Manage Subscription";
    b2.addEventListener("click", () => {
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
    });
  } else {
    $(".summary a")
      .map(function () {
        //if($(this).text().indexOf("Premium") != -1){
        $(this).unbind("click");
        $(this).click(function (e) {
          alert("Please signup & subscribe or login if subscribed alredy");
          e.preventDefault();
          return false;
        });
        //}
        //$(this).attr('href', "javascript:alert('Please signup & subscribe or login if subscribed alredy')");
      })
      .get();
    // if no on is logged in, show login/signup options
    b1.innerText = "Log In";
    b1.addEventListener("click", login);

    b2.innerText = "Sign Up";
    b2.addEventListener("click", signup);
  }

  container.appendChild(b1);
  container.appendChild(b2);
};

const handleUserStateChange = async (user) => {
  updateUserInfo(user);
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
          //window.location = "indledning"
          if (data[0] == "pro") {
            $(".summary a")
              .map(function () {
                if ($(this).text().indexOf("Premium") != -1) {
                  $(this).unbind("click");
                  $(this).click(function (e) {
                    alert("Please subscribe to premium");
                    e.preventDefault();
                    return false;
                  });
                } else {
                  $(this).unbind("click");
                }
              })
              .get();
          } else {
            $(".summary a")
              .map(function () {
                $(this).unbind("click");
              })
              .get();
          }
        }
      });
  }
};

netlifyIdentity.on("init", handleUserStateChange);
netlifyIdentity.on("login", handleUserStateChange);
netlifyIdentity.on("logout", handleUserStateChange);
