window.onload = function() {
	/*初始化*/
	var $ = layui.$;
	var fun = {};
	var privilege;
	var list = new Array();
	var reg = /^gm/;
	var index;
	var gm;
	$.ajaxSetup({ cache: false });
	$.ajax({
		type: "GET",
		url: "/user/init",
		data: "",
		success: function(msg) {
			for(var i in msg.func.table){
				fun[msg.func.table[i].name] = msg.func.table[i].privilege;
			}
			for(var i in fun){
				if(reg.test(i))
					list.push(fun[i]);
			}
			list.sort(function (a,b) {
			    return a-b;
			});
			gm = list[0];
		},
		error: function(xhr) {
			alert(xhr.status);
		}
	});

	//登录弹窗
	function window() {
		index = layer.open({
			title: false,
			area: ['500px', '450px'],
			type: 1,
			closeBtn: 0,
			//area: ['2000px', '1000px'],
			content: '<div class="layui-tab layui-tab-brief"lay-filter=""><div class="login">欢迎使用本系统，请先登录或注册</div><div class="line"></div><ul class="layui-tab-title"><li class="layui-this">登录</li><li>注册</li><li>修改密码</li></ul><div class="layui-tab-content"><div class="layui-tab-item layui-show"><div class="resdiv"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>账号:<input type="text"autocomplete="off"id="username"class="logininput"placeholder="账号"/><br/><div id="usermsg"class="msg"style="display: none">账号至少6位</div><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>密码:<input type="password"autocomplete="off"id="pwd"class="logininput"placeholder="密码"/><br/><div id="pwdmsg"class="msg"style="display: none">密码至少6位</div><button class="loginbtn"id="login"data-type="reload"type="button"><span>登录</span></button></div></div><div class="layui-tab-item"><div class="resdiv"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>账号:<input type="text"autocomplete="off"id="username1"class="logininput"placeholder="账号"/><br/><div id="usermsg1"class="msg"style="display: none">账号至少6位</div><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>密码:<input type="password"autocomplete="off"id="pwd1"class="logininput"placeholder="密码"/><br/><div id="pwdmsg1"class="msg"style="display: none">密码至少6位</div><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>确认密码:<input type="password"style="margin-left: 32px;"autocomplete="off"id="repwd"class="logininput"placeholder="确认密码"/><br/><div id="repwdmsg"class="msg"style="display: none">密码至少6位</div><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>用户名:<input type="text"style="margin-left: 45px;"autocomplete="off"id="rolename"class="logininput"placeholder="用户名"/><br/><button class="loginbtn"id="register"data-type="reload"type="button"><span>注册</span></button></div></div><div class="layui-tab-item"><div class="resdiv"><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>原密码:<input type="password"autocomplete="off"style="margin-left: 45px;"id="pwd2"class="logininput"placeholder="原密码"/><br/><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>新密码:<input type="password"style="margin-left: 45.5px;"autocomplete="off"id="newpwd"class="logininput"placeholder="新密码"/><br/><font style="margin-left: 20px;font-size: 16px;"color="red">*</font>确认密码:<input type="password"style="margin-left: 32px;"autocomplete="off"id="repwd1"class="logininput"placeholder="确认密码"/><br/><button class="loginbtn"id="reset"data-type="reload"type="button"><span>修改密码</span></button></div></div></div></div>',
		});
		register();
		login();
		reset();
	}
	window();
	function loading(msg) {
		if (msg.resultCode == 0) {
			layer.close(index);
			/*加载iframe*/
			iframe.src = "./center.html";
			layer.msg("欢迎来到魔仙堡", {
				time: 1000,
				offset: '300px',
			});
			/*修改底部*/
			document.getElementsByClassName("mb-1")[0].innerHTML = msg.data.roleName;
			document.getElementsByClassName("layui-badge-dot")[0].style.cssText = "";
			document.getElementById("isLine").innerHTML = "Online"
			/*修改头部*/
			document.getElementById("name").innerHTML = msg.data.roleName;
			privilege = msg.data.privilege;
			if(privilege >= 10) {
				document.getElementById("fdl2").style.cssText = "";
			}else {
				document.getElementById("fdl2").style.cssText = "display: none";
			}
			if(privilege >= gm) {
				gmChangesrc();
				document.getElementById("adres").style.cssText = "";
			}else {
				document.getElementById("adres").style.cssText = "display: none"
			}
			if(privilege >= fun.gmInsertRegCode || privilege >= fun.gmDeleteRegCode) {
				mChangesrc();
				document.getElementById("fdl2").style.cssText = "";
			}else {
				document.getElementById("fdl2").style.cssText = "display: none";
			}
		} else {
			layer.msg(msg.rtnMessage, {
				time: 1000,
				offset: '200px',
			});
		}
	}
	/* 注册 */
	function register() {
		document.getElementById("register").onclick = function() {
			var username = $('#username1').val();
			var pwd = $('#pwd1').val();
			var rolename = $('#rolename').val();
			$.ajax({
				type: "POST",
				url: "/user/register",
				data: "username=" + username + "&password=" + pwd + "&roleName=" + rolename,
				success: function(msg) {
					loading(msg);
				},
				error: function(xhr) {
					alert(xhr.status);
				}
			});
		};
	}

	/* 登录 */
	function login() {
		document.getElementById("login").onclick = function() {
			var username = $('#username').val();
			var pwd = $('#pwd').val();
			$.ajax({
				type: "GET",
				url: "/user/login/",
				data: "username=" + username + "&password=" + pwd,
				success: function(msg) {
					loading(msg);
				},
				error: function(xhr) {
					alert(xhr.status);
				}
			});
		};
	}

	/* 登出 */
	document.getElementById("logout").onclick = function() {
		layer.confirm('是否确认退出本系统？', {
			title: false,
			btn: ['是', '否'],
			yes: function(index, layero) {
				$.ajax({
					type: "GET",
					url: "/user/logout/",
					data: "",
					success: function(msg) {
						location.replace(location);
					},
					error: function(xhr) {
						alert(xhr.status);
					}
				});
				layer.closeAll();
			}
		}, function(index, layero) {
		});
	};
	/*修改密码*/
	document.getElementById("setpwd").onclick = function() {
		window();
	};
	function reset() {
		document.getElementById("reset").onclick = function() {
			var username = $('#pwd2').val();
			var pwd = $('#newpwd').val();
			$.ajax({
				type: "GET",
				url: "/user/resetPassword/",
				data: "password=" + username + "&newPassword=" + pwd,
				success: function(msg) {
					loading(msg);
				},
				error: function(xhr) {
					alert(xhr.status);
				}
			});
		};
	}
	/* 账号信息 */
	function msg(obj, id) {
		var save = obj.style.cssText;
		obj.oninput = function(e) {
			if (obj.value.length < 6) {
				obj.style.cssText = obj.style.cssText + "border: 1px solid #ed4014;"
				document.getElementById(id).style.cssText = "";
			} else {
				document.getElementById(id).style.cssText = "display: none;";
				obj.style.cssText = save;
			}
		};
	}

	function remsg(obj, reobj, id) {
		var save = obj.style.cssText;
		obj.oninput = function(e) {
			if (obj.value.length < 6) {
				obj.style.cssText = obj.style.cssText + "border: 1px solid #ed4014;"
				document.getElementById(id).style.cssText = "";
			} else if (obj.value != reobj.value) {
				obj.style.cssText = obj.style.cssText + "border: 1px solid #ed4014;"
				document.getElementById(id).innerHTML = "两次密码不一致";
				document.getElementById(id).style.cssText = "";
			} else {
				document.getElementById(id).style.cssText = "display: none;";
				obj.style.cssText = save;
			}
		};
		reobj.oninput = function() {
			if (obj.value != reobj.value) {
				obj.style.cssText = obj.style.cssText + "border: 1px solid #ed4014;"
				document.getElementById(id).innerHTML = "两次密码不一致";
				document.getElementById(id).style.cssText = "";
			} else {
				document.getElementById(id).style.cssText = "display: none;";
				obj.style.cssText = save;
			}
		};
	}
	var user = document.getElementById("username");
	var pwd = document.getElementById("pwd");
	var user1 = document.getElementById("username1");
	var pwd1 = document.getElementById("pwd1");
	var repwd = document.getElementById("repwd");
	msg(user, "usermsg");
	msg(pwd, "pwdmsg");
	msg(user1, "usermsg1");
	remsg(pwd1, repwd, "pwdmsg1");
	remsg(repwd, pwd1, "repwdmsg");
	/* 侧边箭头 */
	var item1 = document.getElementById("layui-nav-side1");

	function transfer(event, obj, pClassName, psClassName, oClassName, osClassName) {
		event = event || window.event;
		if (obj.parentNode.className == pClassName) {
			obj.parentNode.className = psClassName;
			obj.className = oClassName;
		} else {
			obj.parentNode.className = pClassName;
			obj.className = osClassName;
		}
		event.cancelBubble = true;
	};
	item1.onclick = function(event) {
		transfer(event, item1, "layui-nav-item", "layui-nav-item layui-nav-itemed", "acollapse", "acollapsed");
	};
	var item2 = document.getElementById("layui-nav-side2");
	item2.onclick = function() {
		transfer(event, item2, "layui-nav-item", "layui-nav-item layui-nav-itemed", "acollapse", "acollapsed");
	};
	/* 侧边切换 */
	var uld = document.getElementsByClassName("layui-nav layui-nav-tree layui-nav-side")[0].getElementsByTagName("dd");
	for (var i = 0; i < uld.length; i++) {
		uld[i].onclick = function() {
			var a = this.parentNode.getElementsByTagName("a");
			var dl = this.parentNode.parentNode.parentNode.getElementsByClassName("layui-nav-child");
			for (var j = 0; j < a.length; j++) {
				a[j].className = "";
			}
			for (var k = 0; k < dl.length; k++) {
				var as = dl[k].getElementsByTagName("a");
				for(var n = 0;n < as.length; n++){
					as[n].className = "";
				}
			}
			this.firstChild.className = "mya";
		}
	}
	/* 全屏 */
	document.getElementById("fullScreen").onclick = function() {
		if (document.documentElement.RequestFullScreen) {
			document.documentElement.RequestFullScreen();
		}
		//兼容火狐
		if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		}
		//兼容谷歌等可以webkitRequestFullScreen也可以webkitRequestFullscreen
		if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen();
		}
		//兼容IE,只能写msRequestFullscreen
		if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		}
	}
	/* 资料显示 */
	var user = document.getElementById("user");
	var as = user.getElementsByTagName("a");
	var dl = user.getElementsByTagName("dl")[0];
	as[1].className = "";
	as[2].className = "";
	user.onclick = function() {
		if (dl.className == "layui-nav-child layui-anim layui-anim-upbit layui-show" && as[0].className == "mya2d") {
			dl.className = "layui-nav-child layui-anim layui-anim-upbit";
			as[0].className = "mya2";
		} else {
			dl.className = "layui-nav-child layui-anim layui-anim-upbit layui-show";
			as[0].className = "mya2d";
		}
	};
	/* 侧边跳转 */
	var iframe = document.getElementsByClassName("layadmin-iframe")[0];

	function changeiframe(id, src) {
		document.getElementById(id).onclick = function() {
			iframe.src = src;
		};
	};

	function mChangesrc() {
		changeiframe("manager", "./manager.html");
		changeiframe("userControl", "./control.html");
	}

	function gmChangesrc() {
		changeiframe("center", "./center.html");
		changeiframe("res", "./res.html");
		changeiframe("adres", "./adres.html");
	}

	function changesrc() {
		changeiframe("center", "./center.html");
		changeiframe("res", "./res.html");
	}
	changesrc();
	/* 侧边收缩 */
	var flexible = document.getElementById("flexible")
	flexible.onclick = function() {
		if (flexible.getAttribute("flag") == 0) {
			document.getElementById("fspan").style.cssText = "display: none";
			//document.getElementById("fspan").style.cssText = "";
			document.getElementsByClassName("layui-logo")[0].style.cssText = "width: 65px";
			//document.getElementsByClassName("layui-logo")[0].style.cssText = "";
			document.getElementById("layui-nav-side1").className = "";
			//document.getElementById("layui-nav-side1").className = "acollapse";
			document.getElementById("layui-nav-side2").className = "";
			//document.getElementById("layui-nav-side1").className = "acollapse";
			document.getElementById("fli1").style.cssText = "width: 20%";
			//document.getElementById("fli1").style.cssText = "";
			document.getElementById("fli2").style.cssText = "width: 20%";
			//document.getElementById("fli2").style.cssText = "";
			document.getElementById("fdl1").style.cssText = "display: none;";
			//document.getElementById("fdl1").style.cssText = "";
			document.getElementById("fdl2").style.cssText = "display: none;";
			//document.getElementById("fdl2").style.cssText = "";
			document.getElementsByClassName("bottom")[0].style.cssText = "width: 35px;left: -5px;";
			//document.getElementsByClassName("bottom")[0].style.cssText = "";
			document.getElementsByClassName("media-body")[0].style.cssText = "display: none;";
			//document.getElementsByClassName("media-body")[0].style.cssText = "";
			document.getElementsByClassName("layui-nav layui-layout-left")[0].style.cssText = "left: 65px;";
			//document.getElementsByClassName("layui-nav layui-layout-left")[0].style.cssText = "";
			document.getElementById("LAY_app_body").style.cssText = "left: 65px;";
			//document.getElementById("LAY_app_body").style.cssText = "";
			flexible.setAttribute("flag", 1);
		} else {
			document.getElementById("fspan").style.cssText = "";
			document.getElementsByClassName("layui-logo")[0].style.cssText = "";
			document.getElementById("layui-nav-side1").className = "acollapse";
			document.getElementById("layui-nav-side2").className = "acollapsed";
			document.getElementById("fli1").style.cssText = "";
			document.getElementById("fli2").style.cssText = "";
			document.getElementById("fdl1").style.cssText = "";
			document.getElementById("fdl2").style.cssText = "";
			document.getElementsByClassName("bottom")[0].style.cssText = "";
			document.getElementsByClassName("media-body")[0].style.cssText = "";
			document.getElementsByClassName("layui-nav layui-layout-left")[0].style.cssText = "";
			document.getElementById("LAY_app_body").style.cssText = "";
			flexible.setAttribute("flag", 0);
		}
	}
};
