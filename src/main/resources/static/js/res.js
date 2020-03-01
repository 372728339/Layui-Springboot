window.onload = function () {
    var $ = layui.$;
    var fun = {};
    var privilege;
    var itemId;
    var mail = document.getElementById("mail");
    setTimeout(function () {
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
	},20);
    setTimeout(function () {
        $.ajax({
            type: "GET",
            url: "/user/login",
            data: "",
            success: function (msg) {
                if (msg.resultCode == 0) {
                    privilege = msg.data.privilege;
                    if (privilege >= fun.mail) {
                        mail.style.cssText = "";
                        var table = layui.table;
                        //第一个实例
                        table.render({
                            elem: '#demo', //对应<table>的id
                            height: 466,
                            url: '/user/itemList', //数据接口
                            page: true, //开启分页
                            id: 'itemTable',
                            parseData: function (items) {
                                var type = {0:"装备",1:"药品",2:"翅膀",3:"坐骑",4:"法宝",5:"灵器",6:"时装",7:"法印",8:"头像",9:"飞行器",10:"符文",11:"变身卡",12:"家具",13:"宠物袋",14:"宠物书",15:"杂货",16:"仙侣",17:"称谓",18:"头衔",19:"宠物",20:"活动",21:"宠物技能",22:"装备特效"};
                                for(var i in items.table){
                                    for(var j in type){
                                        if(items.table[i]["type"] == j)
                                            items.table[i]["type"] = type[j];
                                    }
                                }
                                return {
                                    "code": items.resultCode - 1,
                                    "msg": items.rtnMessage,
                                    "count": items.total,
                                    "data": items.table
                                }
                            },
                            cols: [[ //表头
                                {align: 'center', field: 'name', title: '物品名称'},
                                {align: 'center', field: 'type', title: '物品类别'}
                            ]]
                        });
                        table.on('row(click)', function (obj) { //click对应lay-filter="click"
                            var data = obj.data;
                            document.getElementById("send").disabled = "";
                            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
                            itemId = data.id;
                        });
                    } else {
                        mail.style.cssText = "display: none";
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
    }, 50);

    setTimeout(function () {
        var active = {
            reload: function () {
                var itemName = $('#item');
                layui.table.reload('itemTable', {
                    page: { curr: 1 },
                    where: { name: itemName.val() }
                }, 'data');
            }
        };
        $('#search').on('click', function () {
            var type = $(this).data('type');
            active[type] ? active[type].call(this) : '';
        });
    },100);
    var send = document.getElementById("send");
    var num = document.getElementById("num");
    num.oninput = function (e) {
        if (num.value > 999) {
            num.style.cssText = "border: 1px solid #ed4014;"
            document.getElementById("message").style.cssText = "left: 0;";
        } else {
            document.getElementById("message").style.cssText = "display: none;";
            document.getElementById("message1").style.cssText = "display: none;";
            num.style.cssText = "";
        }
    };
    send.onclick = function () {
        if (num.value == "") {
            num.style.cssText = "border: 1px solid #ed4014;"
            document.getElementById("message1").style.cssText = "left: 0;";
        } else {
            document.getElementById("message1").style.cssText = "display: none;";
            num.style.cssText = "";
            mailItem();
        }
    };
    function mailItem() {
        $.ajax({
            type: "GET",
            url: "/user/mail",
            data: "itemId="+itemId+"&num="+num.value,
            success: function (msg) {
                layer.msg(msg.rtnMessage, {
                    time: 1000,
                    offset: '300px',
                });
            },
            error: function (xhr) {
                alert(xhr.status);
            }
        });
    };
};