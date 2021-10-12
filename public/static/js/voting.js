$(function () {
    $(".dog_name").click((x) => {
        let dog = $(x.target).attr('id');
        window.location = "./" + "voting_result?dog=" + dog;
    })
})