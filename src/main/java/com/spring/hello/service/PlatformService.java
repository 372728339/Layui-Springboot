package com.spring.hello.service;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
@ConfigurationProperties(prefix = "platform")
public class PlatformService {
    private MessageDigest mdInst = null;

    private char[] hexDigits = null;

    private String key;

    public void setKey(String key) {
        this.key = key;
    }

    String md5(String s) {
        byte[] btInput = s.getBytes();
        this.mdInst.update(btInput);
        byte[] md = this.mdInst.digest();
        int j = md.length;
        char[] str = new char[j * 2];
        int k = 0;
        for (byte byte0 : md) {
            str[k++] = this.hexDigits[byte0 >>> 4 & 0xF];
            str[k++] = this.hexDigits[byte0 & 0xF];
        }
        return new String(str);
    }
}
