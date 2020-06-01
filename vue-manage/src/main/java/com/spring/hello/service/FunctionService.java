package com.spring.hello.service;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Function;
import com.spring.hello.mapper.FunctionMapper;
import com.spring.hello.vo.Response;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

@Service
public class FunctionService {
    @Resource
    private FunctionMapper functionMapper;

    public Response<Function> findFunctionList() {
        List<Function> functionList = this.functionMapper.selectByExample(null);
        return new Response(-1L, functionList);
    }

    public Response updateFunction(Function function) {
        this.functionMapper.updateByPrimaryKeySelective(function);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "权限修改成功");
    }
}
