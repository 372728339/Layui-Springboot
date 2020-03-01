package com.spring.hello.controller;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Item;
import com.spring.hello.service.GmService;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
@RequestMapping(value = {"/gm"})
public class GmController {
    @Resource
    private GmService gmService;

    @GetMapping({"/mail"})
    public Response gmMail(String uname, int itemId, int num, HttpServletRequest request) throws IOException {
        return this.gmService.mail(uname, itemId, num, request);
    }

    @GetMapping({"/getUname"})
    public Response getUname (String roleName) throws IOException {
        return this.gmService.getUname(roleName);
    }
}
