package com.spring.hello.common;

import java.util.Map;

public interface GameControlMBean {
    void sendNotice(String paramString);

    void mailCompensate(String paramString1, String paramString2, int paramInt1, int paramInt2);

    long getRoleidByName(String paramString);

    String getRoleName(long paramLong);

    void initserverlevelinfo(long paramLong, String paramString);

    void setPetPoint(int paramInt1, long paramLong1, long paramLong2, int paramInt2);

    void wrnmmpkbdlb11(int paramInt);

    long getPetId(long paramLong);

    void addPetSkill(long paramLong, int paramInt1, int paramInt2);

    void mailItemAward(long paramLong, String paramString1, String paramString2, int paramInt1, int paramInt2);

    void mailItemAward(long paramLong, String paramString1, String paramString2, Map<Integer, Integer> paramMap);

    void GmAddGoldIngot(long paramLong, int paramInt);

    void GmAddyb(long paramLong1, long paramLong2);

    void setOpenActivityGm(int paramInt, long paramLong);

    void GmAddGold(long paramLong, int paramInt);

    void Gmsetlevel(long paramLong, int paramInt);

    void addchengwei(long paramLong, int paramInt);

    void rmallpartner(long paramLong);

    void setbaoshidu(long paramLong, int paramInt);

    void atitle(long paramLong, int paramInt);

    void Divorce(long paramLong);

    void setganglevel(long paramLong, int paramInt);

    void setyinbi(long paramLong1, long paramLong2);

    void clearbag(long paramLong1, long paramLong2, int paramInt);

    void AddGeniusPoint(long paramLong1, long paramLong2, int paramInt);

    void closeRoleFight(long paramLong, boolean paramBoolean);

    void ClearHatchDays(long paramLong1, long paramLong2);

    void bidtalk(long paramLong1, long paramLong2, int paramInt1, int paramInt2);

    void winglevelto(long paramLong1, long paramLong2, int paramInt);

    void AddEquip(long paramLong1, long paramLong2, int paramInt1, int paramInt2);

    void AddSkillNumPet(long paramLong, int paramInt1, int paramInt2);

    void GmSetYuanshen(long paramLong1, long paramLong2, int paramInt1, int paramInt2, int paramInt3);

    void GmJail(long paramLong1, long paramLong2);

    void GmUnJail(long paramLong1, long paramLong2);

    void AddChildren(long paramLong, int paramInt);

    void Apartner(long paramLong, int paramInt);

    void addpoint(long paramLong, int paramInt);

    void setfightvalue(long paramLong, int paramInt);

    void resetmultioccupcd(long paramLong1, long paramLong2);

    void addgangmoney(long paramLong, int paramInt);

    void addgangvit(long paramLong, int paramInt);

    void addganggongxun(long paramLong1, long paramLong2, int paramInt);

    void setsedata(long paramLong1, long paramLong2, int paramInt1, int paramInt2, int paramInt3, int paramInt4);

    void Equipqilin(long paramLong1, long paramLong2, int paramInt1, int paramInt2, int paramInt3);

    void AddChildHealth(long paramLong1, long paramLong2, int paramInt);

    void ResetPKTimes(long paramLong1, long paramLong2);

    void ClearChildTired(long paramLong1, long paramLong2);

    void FullCourse(long paramLong1, long paramLong2, long paramLong3);

    void GmSetBlessLevel(long paramLong1, long paramLong2, int paramInt1, int paramInt2, int paramInt3);

    void SetFeiSheng(long paramLong1, long paramLong2, int paramInt);

    void ForbidRole(long paramLong, int paramInt, String paramString);

    void forbiduser(long paramLong, int paramInt, String paramString);

    void unforbiduser(long paramLong1, long paramLong2);

    void UnforbidRole(long paramLong1, long paramLong2);

    void unbidtalk(long paramLong1, long paramLong2);

    long getLevel(long paramLong);

    long getMoney(long paramLong);

    void CostBuyYuanBao(long paramLong1, long paramLong2);

    void setOnlineTime(int paramInt);

    void setOnlineItem(int paramInt1, int paramInt2);

    void setOnlineYuanbao(int paramInt);

    void deleteItem(long paramLong, int paramInt1, int paramInt2, int paramInt3, int paramInt4, int paramInt5, int paramInt6, Map<Integer, Integer> paramMap);
}


