$(function () {

    let x = 0;

    $("#cookie").click(() => {
        let cookies = getCookieCountCookie()
        let cval = parseInt(cookies);
        if (Number.isInteger(cval)) {
            cval++;
            document.cookie = `cookies=${cval};path=/`
            $("#cookie_count").text("" + cval)
        }
        x++;
        $("#premium").append('<div id="x' + x + '" class="plus1" hidden> <img src="./img/cookie.png" alt="+1" class="cookie_1"></div>');
        let plus1 = $("#x" + x);

        let bounds = $("#cookie")[0].getBoundingClientRect();

        plus1.css("left", bounds.x + Math.random() * bounds.width);
        plus1.css("top", bounds.y + Math.random() * bounds.height);
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
