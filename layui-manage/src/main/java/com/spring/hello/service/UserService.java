package com.spring.hello.service;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Item;
import com.spring.hello.entity.RegCode;
import com.spring.hello.entity.User;
import com.spring.hello.entity.UserExample;
import com.spring.hello.mapper.ItemMapper;
import com.spring.hello.mapper.JiangpinMapper;
import com.spring.hello.mapper.RegCodeMapper;
import com.spring.hello.mapper.UserMapper;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@Service
public class UserService {
    @Resource
    private UserMapper userMapper;
    @Resource
    private RegCodeMapper regCodeMapper;
    @Resource
    private ItemMapper itemMapper;

    public UserService() {
    }

    public Response<UserVO> register(UserVO userVO) throws IOException {
        String roleName = userVO.getRoleName();
        User user = this.userMapper.selectByPrimaryKey(userVO.getUsername());
        if (user != null) {
            return new Response(ResultCode.FAIL, "注册失败，账号已存在");
        }
        UserExample userExample = new UserExample();
        userExample.createCriteria().andRolenameEqualTo(roleName);
        List<User> userList = this.userMapper.selectByExample(userExample);
        if (userList != null && userList.size() > 0) {
            return new Response(ResultCode.FAIL, "注册失败，用户名已存在");
        }
        user = new User();
        BeanUtils.copyProperties(userVO, user);
        user.setRolename(roleName);
        user.setPrivilege(Byte.valueOf((byte) 1));
        this.userMapper.insertSelective(user);
        BeanUtils.copyProperties(user, userVO);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "注册成功！", userVO);
    }

    public Response mail(UserVO userVO, int itemId, int num) throws IOException {
        if (num > 999) {
            return new Response(ResultCode.FAIL, "您发送的物品数量过多，请分次发送");
        }
        Item item = validateItem(userVO, itemId);
        if (item == null) {
            return new Response(ResultCode.FAIL, "您无权发送该物品");
        }
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "物品\"" + item.getName() + "\"已发送至您的邮箱，请查收");
    }

    Item validateItem(UserVO userVO, int itemId) {
        Item item = this.itemMapper.selectByPrimaryKey(Long.valueOf(itemId));
        return (item == null || item.getPrivilege().byteValue() > userVO.getPrivilege().byteValue()) ? null : item;
    }

    public Response resetPassword(UserVO userVO, String newPassword) {
        User user = getUserByUsernameAndPassword(userVO.getUsername(), userVO.getPassword());
        if (user == null) {
            return new Response(ResultCode.FAIL, "原密码错误");
        }
        user.setPassword(newPassword);
        this.userMapper.updateByPrimaryKeySelective(user);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "密码修改成功");
    }

    @Transactional(propagation = Propagation.REQUIRED, rollbackFor = {Throwable.class})
    public Response<UserVO> addPrivilege(UserVO userVO, String code) {
        RegCode regCode = this.regCodeMapper.selectByPrimaryKey(code);
        if (regCode == null) {
            return new Response(ResultCode.FAIL, "激活码不存在，提权失败");
        }
        Byte privilege = regCode.getPrivilege();
        if (userVO.getPrivilege().byteValue() >= privilege.byteValue()) {
            return new Response(ResultCode.FAIL, "该激活码无法为你提权");
        }
        String username = userVO.getUsername();
        User user = new User();
        user.setUsername(username);
        user.setPrivilege(privilege);
        this.userMapper.updateByPrimaryKeySelective(user);
        this.regCodeMapper.deleteByPrimaryKey(code);
        userVO.setPrivilege(privilege);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "提权成功", userVO);
    }

    public UserVO login(User user) {
        user = getUserByUsernameAndPassword(user.getUsername(), user.getPassword());
        if (user != null) {
            UserVO userVO = new UserVO();
            BeanUtils.copyProperties(user, userVO);
            userVO.setRoleName(user.getRolename());
            this.userMapper.updateByPrimaryKeySelective(user);
            return userVO;
        }
        return null;
    }

    private User getUserByUsernameAndPassword(String username, String password) {
        UserExample userExample = new UserExample();
        userExample.createCriteria().andUsernameEqualTo(username).andPasswordEqualTo(password);
        List<User> userList = this.userMapper.selectByExample(userExample);
        if (userList == null || userList.size() == 0) {
            return null;
        }
        return userList.get(0);
    }

    public Response resetPassword(String username) {
        User user = this.userMapper.selectByPrimaryKey(username);
        if (user == null) {
            return new Response(ResultCode.FAIL, "该账号不存在");
        }
        user.setPassword("000000");
        this.userMapper.updateByPrimaryKey(user);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "该账户密码被重置为000000，请及时修改");
    }
}
