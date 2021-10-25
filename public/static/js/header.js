$.getJSON("/username", (data) => {
    if ("username" in data) {
        $(".topnav").append(`<span class="navp">Welcome, ${data.username}</a>`)
        $(".topnav").append(`<a id="logout" href="logout" style="font-size:24px"><i class="fa fa-sign-out"></i></a>
`)

    }
});