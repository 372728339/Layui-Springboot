package com.spring.hello.entity;

public class Item {
    private Long id;

    private String name;

    private Byte type;

    private Byte privilege;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public Byte getType() {
        return type;
    }

    public void setType(Byte type) {
        this.type = type;
    }

    public Byte getPrivilege() {
        return privilege;
    }

    public void setPrivilege(Byte privilege) {
        this.privilege = privilege;
    }
}