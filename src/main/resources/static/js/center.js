window.onload = function () {
    var $ = layui.$;
    function change(obj) {
        if (obj.style.cssText == "display: none;")
            obj.style.cssText = "";
        else
            obj.style.cssText = "display: none"
    }

    /*提权*/
    function addPrivilege() {
        btn.onclick = function () {
            $.ajax({
                type: "GET",
                url: "/user/addPrivilege",
                data: "code=" + code.value,
                success: function (msg) {
                    console.log(msg);
                    layer.msg(msg.rtnMessage, {
                        time: 1000,
                        offset: '300px',
                    });
                    role.innerHTML = msg.data.roleName + ":Lv" + msg.data.privilege;
                },
                error: function (xhr) {
                    alert(xhr.status);
                }
            });
        }
    }
    /*获取权限信息*/
    $.ajaxSetup({cache: false});
    var fun = {};
    var privilege;
    var role = document.getElementById("role");
    var code = document.getElementById("code");
    var btn = document.getElementById("addPrivilege");
    $.ajax({
        type: "GET",
        url: "/user/init",
        data: "",
        success: function (msg) {
            for (var i in msg.func.table) {
                fun[msg.func.table[i].name] = msg.func.table[i].privilege;
            }
        },
        error: function (xhr) {
            alert(xhr.status);
        }
    });
    setTimeout(function () {
        $.ajax({
            type: "GET",
            url: "/user/login",
            data: "",
            success: function (msg) {
                if (msg.resultCode == 0) {
                    role.innerHTML = msg.data.roleName + ":Lv" + msg.data.privilege;
                    privilege = msg.data.privilege;
                    if (privilege >= fun.addPrivilege) {
                        setTimeout(change(code), 0);
                        setTimeout(change(btn), 0);
                        addPrivilege();
                    }
                } else {
                    layer.msg(msg.rtnMessage, {
                        time: 1000,
                        offset: '300px',
                    });
                }
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    },50);
    /* 激活码 */
    code.oninput = function (e) {
        if (code.value.length < 32) {
            code.style.cssText = "border: 1px solid #ed4014;"
            document.getElementById("message").style.cssText = "";
        } else {
            document.getElementById("message").style.cssText = "display: none;";
            code.style.cssText = ""
        }
    };
};