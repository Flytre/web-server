$(function () {

    function editPoints(class_id, amount) {
        $(class_id).bind("click", function (e) {
            $.ajax({
                "type": "POST",
                "url": "/houses/modify_points",
                "data": JSON.stringify({
                    "member": $(this).attr("data-member"),
                    "house": $(this).attr("data-house"),
                    "points": amount
                }),
                "success": (response) => {
                    $(this).parent().children(".member-points").text(response.points)
                    $(this).parents(".column").children(".house-name").children("p").children(".house-points").text(response.house_points)
                }
            })
        });
    }

    editPoints(".add-points", 10)
    editPoints(".remove-points", -10)

    $("#subject-add-submit").bind("click", function (e) {
        let name = $("#subject-add-name").val();
        let house = $("#subject-add-house").val();
        $.ajax({
            "type": "POST",
            "url": "/houses/add_subject",
            "data": JSON.stringify({
                "member": name,
                "house": house
            }),
            "success": (response) => {
                if (response.status === "success") {
                    let html = `
                    <tr class="house-table">
                    <td>
                            <span class="member-name">${name}</span>
                            <span class="member-separator">: </span>
                            <span class="member-points">0</span>
                            <span class="remove-points" data-member="${name}" data-house="${house}">-</span>
                            <span class="add-points" data-member="${name}" data-house="${house}">+</span>
                        </td>
                    </tr>
                    `
                    $(".column[data-house='" + house + "']").find("tbody").append(html);
                    editPoints(".add-points[data-member='" + name + "']", 10)
                    editPoints(".remove-points[data-member='" + name + "']", -10)
                }
            }
        })
    })
})