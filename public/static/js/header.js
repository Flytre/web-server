$.getJSON("/username", (data) => {
    if ("username" in data) {
        $(".topnav").append(`<a href="profile">Welcome, ${data.username}</a>`)
        $(".topnav").append(`<a id="logout" href="logout"><i class="fa fa-sign-out-alt"></i></a>`)
    } else {
        $(".topnav").append(`<a id="profile" href="profile"><i class="fa fa-user-alt"></i></a>`)
    }
});