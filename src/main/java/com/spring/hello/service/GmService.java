package com.spring.hello.service;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Item;
import com.spring.hello.entity.User;
import com.spring.hello.entity.UserExample;
import com.spring.hello.mapper.UserMapper;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@Service
public class GmService {

    @Resource
    private UserService userService;

    @Resource
    private UserMapper userMapper;

    public Response mail(String uname, int itemId, int num, HttpServletRequest request) {
        UserVO userVO = (UserVO)request.getSession().getAttribute("user");
        if(uname == null || uname == ""){
            return new Response(ResultCode.FAIL, "账号不能为空");
        }
        Item item = this.userService.validateItem(userVO, itemId);
        if (item == null) {
            return new Response(ResultCode.FAIL, "您无权发送该物品");
        }
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "给"+uname + "物品发送成功");
    }

    public Response getUname(String roleName) {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andRolenameEqualTo(roleName);
        List<User> userList = this.userMapper.selectByExample(userExample);
        if (userList == null || userList.size() == 0) {
            return new Response(ResultCode.FAIL, "查询失败，用户名不存在");
        }
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE,userList.get(0).getUsername());
    }
}
