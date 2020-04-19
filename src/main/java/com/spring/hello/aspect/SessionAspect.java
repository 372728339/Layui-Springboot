package com.spring.hello.aspect;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Function;
import com.spring.hello.entity.User;
import com.spring.hello.mapper.FunctionMapper;
import com.spring.hello.mapper.UserMapper;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Aspect
@Component
public class SessionAspect {
    @Resource
    private FunctionMapper functionMapper;
    @Resource
    private UserMapper userMapper;
    private long minDelay = 1000;
    private Map<String, Long> fgj;

    @PostConstruct
    private void init() {
        this.fgj = new HashMap<>();
    }

    @Around("execution(public com.spring.hello.vo.Response com.spring.hello.controller.*Controller.*(..,javax.servlet.http.HttpServletRequest))")
    public Object around(ProceedingJoinPoint joinPoint) {
        try {
            Object[] args = joinPoint.getArgs();
            int index = args.length - 1;
            HttpServletRequest request = (HttpServletRequest) args[index];
            HttpSession session = request.getSession();
            Object obj = session.getAttribute("user");
            if (obj == null) {
                return new Response(ResultCode.FAIL_NO_LOGIN, "尚未登录，无法使用本系统");
            }
            String methodName = joinPoint.getSignature().getName();
            if (methodName.startsWith("find") || methodName.startsWith("gmFind")) {
                return joinPoint.proceed();
            }
            UserVO userVO = (UserVO) obj;
            String username = userVO.getUsername();
            if (StringUtils.isEmpty(username)) {
                return new Response(ResultCode.FAIL_NO_LOGIN);
            }
            User user = this.userMapper.selectByPrimaryKey(username);
            if (user == null) {
                return new Response(ResultCode.FAIL_NO_LOGIN);
            }
            byte userPrivilege = user.getPrivilege().byteValue();
            if (methodName.startsWith("admin")) {
                if (userPrivilege < 10) {
                    return new Response(ResultCode.FAIL, "您无权使用该功能");
                }
            } else {
                Long last = this.fgj.get(username);
                Long now = Long.valueOf(System.currentTimeMillis());
                if (last == null || now.longValue() - last.longValue() >= this.minDelay) {
                    this.fgj.put(username, now);
                } else {
                    return new Response(ResultCode.FAIL, "两次请求间隔小于" + this.minDelay / 1000 + "秒，请稍候再试");
                }
                Function function = this.functionMapper.selectByPrimaryKey(methodName);
                if (function != null && userPrivilege < function.getPrivilege().byteValue()) {
                    return new Response(ResultCode.FAIL, "您无权使用该功能");
                }
            }
            userVO.setPassword(user.getPassword());
            userVO.setPrivilege(Byte.valueOf(userPrivilege));
            session.setAttribute("user", userVO);
            return joinPoint.proceed(args);
        } catch (Throwable throwable) {
            throwable.printStackTrace();
            return new Response(ResultCode.FAIL, "发生错误，请联系管理员");
        }
    }
}
