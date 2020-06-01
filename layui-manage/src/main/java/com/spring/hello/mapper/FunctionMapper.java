package com.spring.hello.mapper;

import com.spring.hello.entity.Function;
import com.spring.hello.entity.FunctionExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface FunctionMapper {
    long countByExample(FunctionExample example);

    int deleteByExample(FunctionExample example);

    int deleteByPrimaryKey(String name);

    int insert(Function record);

    int insertSelective(Function record);

    List<Function> selectByExample(FunctionExample example);

    Function selectByPrimaryKey(String name);

    int updateByExampleSelective(@Param("record") Function record, @Param("example") FunctionExample example);

    int updateByExample(@Param("record") Function record, @Param("example") FunctionExample example);

    int updateByPrimaryKeySelective(Function record);

    int updateByPrimaryKey(Function record);
}