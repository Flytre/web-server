$(function () {
    $("#edit").click(() => {

        let me = $("#edit")

        if (me.text() === 'Save') {
            $.ajax({
                "type": "POST",
                "url": "./nickname_change",
                "data": JSON.stringify({
                    "nickname": $("#nickname-edit").val()
                }),
                "success": () => {
                    location.reload();
                }
            })
        } else {
            if (!$("#nickname-edit").length) {
                $("#nickname").append("<input id='nickname-edit' type=\"text\"/>")
                $("#current-nickname").remove()
            }
            me.text('Save');
            me.disable();
        }
    });
})