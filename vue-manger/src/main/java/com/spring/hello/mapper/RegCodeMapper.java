package com.spring.hello.mapper;

import com.spring.hello.entity.Item;
import com.spring.hello.entity.RegCode;
import com.spring.hello.entity.RegCodeExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface RegCodeMapper {
    long countByExample(RegCodeExample example);

    int deleteByExample(RegCodeExample example);

    int deleteByPrimaryKey(String code);

    int insert(RegCode record);

    int insertSelective(RegCode record);

    List<RegCode> selectByExample(RegCodeExample example);

    RegCode selectByPrimaryKey(String code);

    int updateByExampleSelective(@Param("record") RegCode record, @Param("example") RegCodeExample example);

    int updateByExample(@Param("record") RegCode record, @Param("example") RegCodeExample example);

    int updateByPrimaryKeySelective(RegCode record);

    int updateByPrimaryKey(RegCode record);

    public abstract void batchInsert(@Param("itemList") List<Item> paramList);


}