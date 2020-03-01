package com.spring.hello.mapper;

import com.spring.hello.entity.Jiangpin;
import com.spring.hello.entity.JiangpinExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface JiangpinMapper {
    long countByExample(JiangpinExample example);

    int deleteByExample(JiangpinExample example);

    int deleteByPrimaryKey(Long id);

    int insert(Jiangpin record);

    int insertSelective(Jiangpin record);

    List<Jiangpin> selectByExample(JiangpinExample example);

    Jiangpin selectByPrimaryKey(Long id);

    int updateByExampleSelective(@Param("record") Jiangpin record, @Param("example") JiangpinExample example);

    int updateByExample(@Param("record") Jiangpin record, @Param("example") JiangpinExample example);

    int updateByPrimaryKeySelective(Jiangpin record);

    int updateByPrimaryKey(Jiangpin record);
}