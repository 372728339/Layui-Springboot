package com.spring.hello.controller;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Function;
import com.spring.hello.entity.Item;
import com.spring.hello.entity.User;
import com.spring.hello.mapper.FunctionMapper;
import com.spring.hello.service.FunctionService;
import com.spring.hello.service.ItemService;
import com.spring.hello.service.UserService;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping(path = {"/user"})
public class UserController {

    @Resource
    private UserService userService;

    @Resource
    private ItemService itemService;

    @Resource
    private FunctionService functionService;

    @GetMapping({"/init"})
    public Map<String, Object> init() {
        Map<String, Object> map = new HashMap<>();
        map.put("func", this.functionService.findFunctionList());
        //map.put("item", this.itemService.findItemList());
        //map.put("gm", Integer.valueOf(this.gmPrivilegeMapper.getGmPrivilege()));
        return map;
    }

    @GetMapping({"/itemList"})
    public Response<Item> itemList(HttpServletRequest request, Item item, @RequestParam(value = "page",required = false, defaultValue = "1") int offset) {
        HttpSession session = request.getSession();
        UserVO userVO = (UserVO) session.getAttribute("user");
        if (userVO == null) {
            return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "尚未登录", userVO);
        }
        return this.itemService.findItemList(userVO,item, offset, false);
    }

    @GetMapping({"/mail"})
    public Response mail(int itemId, int num, HttpServletRequest request) throws IOException {
        UserVO userVO = (UserVO) request.getSession().getAttribute("user");
        return this.userService.mail(userVO, itemId, num);
    }

    @GetMapping({"/findFunctionList"})
    public Response<Function> findFunctionList() {
        return this.functionService.findFunctionList();
    }

    @GetMapping({"/addPrivilege"})
    public Response<UserVO> addPrivilege(String code, HttpServletRequest request) {
        HttpSession session = request.getSession();
        UserVO userVO = (UserVO) session.getAttribute("user");
        Response<UserVO> response = this.userService.addPrivilege(userVO, code);
        if (response.getResultCode() == ResultCode.SUCCESS_HAS_MESSAGE.getCode()) {
            session.setAttribute("user", response.getData());
        }
        return response;
    }

    @GetMapping({"/register"})
    public Response register(HttpSession session, UserVO userVO) throws IOException {
        Response response = this.userService.register(userVO);
        if (response.getResultCode() == ResultCode.SUCCESS_HAS_MESSAGE.getCode()) {
            session.setAttribute("user", userVO);
        }
        return response;
    }

    @GetMapping({"/resetPassword"})
    public Response resetPassword(String password, String newPassword, HttpServletRequest request) {
        UserVO userVO = (UserVO) request.getSession().getAttribute("user");
        if (userVO == null)
            return new Response(ResultCode.FAIL, "尚未登录，无法修改密码");
        userVO.setPassword(password);
        return this.userService.resetPassword(userVO, newPassword);
    }

    @GetMapping({"/login"})
    public Response<UserVO> login(HttpServletRequest request, User user) throws IOException {
        HttpSession session = request.getSession();
        UserVO userVO = (UserVO) session.getAttribute("user");
        if (userVO != null) {
            return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "登录成功", userVO);
        }
        if (user == null || StringUtils.isEmpty(user.getUsername()) || StringUtils.isEmpty(user.getPassword())) {
            return new Response(ResultCode.FAIL, "登录失败，账号或密码错误");
        }
        userVO = this.userService.login(user);
        if (userVO == null) {
            return new Response(ResultCode.FAIL, "登录失败，账号或密码错误");
        }
        session.setAttribute("user", userVO);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "登录成功", userVO);
    }

    @GetMapping({"/logout"})
    public Response logout(HttpSession session, String param) {
        session.invalidate();
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "退出成功");
    }
}
