package com.spring.hello.service;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.RegCode;
import com.spring.hello.entity.RegCodeExample;
import com.spring.hello.mapper.RegCodeMapper;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.UUID;

@Service
public class RegCodeService {
    @Resource
    private RegCodeMapper regCodeMapper;

    public Response<RegCode> findRegCodeList(int offset, UserVO userVO) {
        RegCodeExample regCodeExample = new RegCodeExample();
        byte privilege = userVO.getPrivilege().byteValue();
        if (privilege < 10) {
            regCodeExample.createCriteria().andPrivilegeLessThan(Byte.valueOf(privilege));
        }
        regCodeExample.setOffset(Integer.valueOf(offset));
        regCodeExample.setLimit(Integer.valueOf(10));
        List<RegCode> regCodeList = this.regCodeMapper.selectByExample(regCodeExample);
        long count = this.regCodeMapper.countByExample(regCodeExample);
        return new Response(count, regCodeList);
    }

    public Response insertRegCode(byte privilege, UserVO userVO) {
        if (privilege > userVO.getPrivilege().byteValue() - 1) {
            return new Response(ResultCode.FAIL, "权限不足");
        }
        RegCode regCode = new RegCode();
        regCode.setCode(UUID.randomUUID().toString().replaceAll("-", ""));
        regCode.setPrivilege(Byte.valueOf(privilege));
        this.regCodeMapper.insert(regCode);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "激活码生成成功");
    }

    public Response deleteRegCode(String code, UserVO userVO) {
        byte privilege = userVO.getPrivilege().byteValue();
        if (privilege < 10) {
            RegCode regCode = this.regCodeMapper.selectByPrimaryKey(code);
            if (regCode.getPrivilege().byteValue() >= privilege) {
                return new Response(ResultCode.FAIL, "权限不足");
            }
        }
        this.regCodeMapper.deleteByPrimaryKey(code);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "激活码删除成功");
    }
}
