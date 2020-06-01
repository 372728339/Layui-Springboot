package com.spring.hello.service;

import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Item;
import com.spring.hello.entity.ItemExample;
import com.spring.hello.mapper.ItemMapper;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.List;

@Service
public class ItemService {
    @Resource
    private ItemMapper itemMapper;

    public Response<Item> findItemList(UserVO userVO,Item item, int offset, boolean wupinOnly) {
        ItemExample itemExample = new ItemExample();
        ItemExample.Criteria criteria = itemExample.createCriteria();
        if (!StringUtils.isEmpty(item.getName())) {
            criteria.andNameLike("%" + item.getName() + "%");
        }
        if (!StringUtils.isEmpty(item.getType())) {
            criteria.andTypeEqualTo(item.getType());
        }
        if (!StringUtils.isEmpty(item.getPrivilege())) {
            criteria.andPrivilegeLessThanOrEqualTo(item.getPrivilege());
        }
        if (wupinOnly) {
            criteria.andTypeLessThan(Byte.valueOf((byte) 16));
        }
        itemExample.setOrderByClause("id asc");
        itemExample.setLimit(Integer.valueOf(10));
        itemExample.setOffset((offset-1)*10);
        criteria.andPrivilegeLessThanOrEqualTo(userVO.getPrivilege());
        List<Item> itemList = this.itemMapper.selectByExample(itemExample);
        long count = this.itemMapper.countByExample(itemExample);
        return new Response(count, itemList);
    }

    public Response<Item> findItemList() {
        ItemExample itemExample = new ItemExample();
        //itemExample.createCriteria().andTypeGreaterThan(Byte.valueOf((byte) 15));
        return new Response(-1L, this.itemMapper.selectByExample(itemExample));
    }

    public Response insertItem(Item item) {
        if (this.itemMapper.selectByPrimaryKey(item.getId()) != null) {
            return new Response(ResultCode.FAIL, "添加失败，物品ID重复");
        }
        this.itemMapper.insert(item);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "物品添加成功");
    }

    public Response deleteItem(long itemId) {
        this.itemMapper.deleteByPrimaryKey(Long.valueOf(itemId));
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "物品删除成功");
    }

    public Response updateItem(Item item) {
        this.itemMapper.updateByPrimaryKeySelective(item);
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "物品修改成功");
    }

    public Response importXls(List<Item> itemList) {
        this.itemMapper.deleteByExample(null);
        if (itemList != null && !itemList.isEmpty()) {
            this.itemMapper.batchInsert(itemList);
        }
        return new Response(ResultCode.SUCCESS_HAS_MESSAGE, "导入成功");
    }


    public List<Item> exportXls() {
        return this.itemMapper.selectByExample(null);
    }
}
