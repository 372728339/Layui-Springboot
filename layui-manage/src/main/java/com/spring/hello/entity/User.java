package com.spring.hello.entity;

public class User {
    private String username;

    private String password;

    private Byte privilege;

    private String rolename;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username == null ? null : username.trim();
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password == null ? null : password.trim();
    }

    public Byte getPrivilege() {
        return privilege;
    }

    public void setPrivilege(Byte privilege) {
        this.privilege = privilege;
    }

    public String getRolename() {
        return rolename;
    }

    public void setRolename(String rolename) {
        this.rolename = rolename == null ? null : rolename.trim();
    }
}