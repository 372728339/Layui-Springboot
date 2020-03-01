package com.spring.hello.common;

public enum ResultCode {
    SUCCESS_HAS_MESSAGE(0), SUCCESS_NO_MESSAGE(1), FAIL(2), FAIL_NO_LOGIN(3);
    private int code;
    ResultCode(int code) { this.code = code; }
    public int getCode() { return this.code; }
}
