$(function () {

    let x = 0;

    $("#cookie").click((e) => {
        let cookies = getCookieCountCookie()
        let cval = parseInt(cookies);
        if (Number.isInteger(cval)) {
            cval++;
            document.cookie = `cookies=${cval};path=/`
            $("#cookie_count").text("" + cval)
        }
        x++;
        $("#premium").append('<div id="x' + x + '" class="plus1" hidden>+1.0</div>');
        let plus1 = $("#x" + x);
        plus1.css("top", e.clientY);
        plus1.css("left", e.clientX - 10);
        plus1.css("position", "absolute");
        plus1.css("width", "25px");
        plus1.css("height", "25px");
        plus1.css("color", "white");
        plus1.css("font-weight", "bold");
        plus1.css("animation", "GoUp 2s forwards linear");
        plus1.show();

    })

    setInterval(() => {
        $(".plus1").each((index, obj) => {
            if ($(obj).css('opacity') == 0) {
                $(obj).remove()
            }
        })
    }, 500);
});


$(function () {
    let cookies = getCookieCountCookie()
    let cval = parseInt(cookies);
    if (Number.isInteger(cval)) {
        document.cookie = `cookies=${cval};path=/`
        $("#cookie_count").text("" + cval)
    }
});

function getCookie(key) {

    if (document.cookie === undefined)
        return undefined;


    let target = decodeURIComponent(document.cookie)
        .split('; ')
        .find(row => row.startsWith(`${key}=`));

    if (target === undefined)
        return undefined

    return target.split('=')[1];
}

function getCookieCountCookie() {
    let cookies = getCookie('cookies')
    if (cookies === undefined) {
        document.cookie = "cookies=0;path=/"
        cookies = getCookie('cookies')
    }
    return cookies;
}
