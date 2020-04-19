package com.spring.hello.vo;

import com.spring.hello.common.ResultCode;

import java.util.List;

public class Response<Entity> {
    private ResultCode resultCode;
    private String rtnMessage;
    private Entity data;
    private long total;
    private List<Entity> table;

    public Response(ResultCode resultCode) {
        this.resultCode = resultCode;
    }

    public Response(ResultCode resultCode, String rtnMessage) {
        this.resultCode = resultCode;
        this.rtnMessage = rtnMessage;
    }

    public Response(Entity data) {
        this.resultCode = ResultCode.SUCCESS_NO_MESSAGE;
        this.data = data;
    }

    public Response(ResultCode resultCode, String rtnMessage, Entity data) {
        this.resultCode = resultCode;
        this.rtnMessage = rtnMessage;
        this.data = data;
    }

    public Response(long total, List<Entity> table) {
        this.resultCode = ResultCode.SUCCESS_NO_MESSAGE;
        this.total = total;
        this.table = table;
    }

    public int getResultCode() {
        return this.resultCode.getCode();
    }

    public String getRtnMessage() {
        return this.rtnMessage;
    }

    public Entity getData() {
        return this.data;
    }

    public long getTotal() {
        return this.total;
    }

    public List<Entity> getTable() {
        return this.table;
    }
}
