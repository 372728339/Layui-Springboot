package com.spring.hello.controller;


import com.spring.hello.common.ResultCode;
import com.spring.hello.entity.Function;
import com.spring.hello.entity.Item;
import com.spring.hello.entity.RegCode;
import com.spring.hello.service.FunctionService;
import com.spring.hello.service.ItemService;
import com.spring.hello.service.RegCodeService;
import com.spring.hello.service.UserService;
import com.spring.hello.vo.Response;
import com.spring.hello.vo.UserVO;
import jxl.Sheet;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableCell;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(path = {"/gm"})
public class AdminController {
    @Resource
    private UserService userService;
    @Resource
    private ItemService itemService;
    @Resource
    private RegCodeService regCodeService;
    @Resource
    private FunctionService functionService;

    @GetMapping({"/resetPassword"})
    public Response adminResetPassword(String username, HttpServletRequest request) {
        return this.userService.resetPassword(username);
    }

    @GetMapping({"/findRegCodeList"})
    public Response<RegCode> gmFindRegCodeList(@RequestParam(value = "page", required = false, defaultValue = "1") int offset, HttpServletRequest request) {
        return this.regCodeService.findRegCodeList(offset, (UserVO) request.getSession().getAttribute("user"));
    }

    @GetMapping({"/insertItem"})
    public Response adminInsertItem(Item item, HttpServletRequest request) {
        return this.itemService.insertItem(item);
    }

    @GetMapping({"/deleteItem"})
    public Response adminDeleteItem(long itemId, HttpServletRequest request) {
        return this.itemService.deleteItem(itemId);
    }

    @GetMapping({"/updateItem"})
    public Response adminUpdateItem(Item item, HttpServletRequest request) {
        return this.itemService.updateItem(item);
    }

    @GetMapping({"/export"})
    public ByteArrayResource exportXls() {
        byte[] result = null;
        ByteArrayOutputStream byteArrayOutputStream = null;
        WritableWorkbook writableWorkbook = null;
        try {
            byteArrayOutputStream = new ByteArrayOutputStream();
            writableWorkbook = Workbook.createWorkbook(byteArrayOutputStream);
            WritableSheet writableSheet = writableWorkbook.createSheet("物品列表", 0);
            writableSheet.addCell((WritableCell) new Label(0, 0, "物品类别代号：0：装备，1：药品，2：翅膀，3：坐骑，4：法宝，5：灵器，6：时装，7：法印，8：头像，9：飞行器，10：符文，11：变身卡，12：家具，13：宠物袋，14：宠物书，15：杂货，16：仙侣，17：称谓，18：头衔，19：宠物，20：活动，21：宠物技能，22：装备特效"));
            writableSheet.addCell((WritableCell) new Label(0, 1, "物品ID"));
            writableSheet.addCell((WritableCell) new Label(1, 1, "物品名称"));
            writableSheet.addCell((WritableCell) new Label(2, 1, "物品类别"));
            writableSheet.addCell((WritableCell) new Label(3, 1, "物品权限"));
            List<Item> itemList = this.itemService.exportXls();
            int i = 2;
            for (Item item : itemList) {
                writableSheet.addCell((WritableCell) new Label(0, i, String.valueOf(item.getId())));
                writableSheet.addCell((WritableCell) new Label(1, i, item.getName()));
                writableSheet.addCell((WritableCell) new Label(2, i, String.valueOf(item.getType())));
                writableSheet.addCell((WritableCell) new Label(3, i, String.valueOf(item.getPrivilege())));
                i++;
            }
            writableWorkbook.write();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (writableWorkbook != null) {
                    writableWorkbook.close();
                }
                if (byteArrayOutputStream != null) {
                    result = byteArrayOutputStream.toByteArray();
                    byteArrayOutputStream.close();
                }
            } catch (IOException | jxl.write.WriteException e) {
                e.printStackTrace();
            }
        }
        if (result == null) {
            result = new byte[0];
        }
        return new ByteArrayResource(result);
    }

    @PostMapping({"/import"})
    public Response importXls(MultipartFile file) {
        Workbook workbook = null;
        List<Item> itemList = new ArrayList<>();
        try {
            workbook = Workbook.getWorkbook(file.getInputStream());
            Sheet sheet = workbook.getSheet(0);
            int maxRows = sheet.getRows();
            for (int i = 2; i < maxRows; i++) {
                Item item = new Item();
                long id = Long.valueOf(sheet.getCell(0, i).getContents()).longValue();
                for (Item temp : itemList) {
                    if (temp.getId().longValue() == id) {
                        return new Response(ResultCode.FAIL, "物品ID重复，导入失败");
                    }
                }
                item.setId(Long.valueOf(id));
                item.setName(sheet.getCell(1, i).getContents());
                byte type = Byte.valueOf(sheet.getCell(2, i).getContents()).byteValue();
                if (type < 0 || type > 22) {
                    return new Response(ResultCode.FAIL, "物品类别输入错误，导入失败");
                }
                item.setType(Byte.valueOf(type));
                byte privilege = Byte.valueOf(sheet.getCell(3, i).getContents()).byteValue();
                if (privilege < 1 || privilege > 10) {
                    return new Response(ResultCode.FAIL, "物品权限输入错误，导入失败");
                }
                item.setPrivilege(Byte.valueOf(privilege));
                itemList.add(item);
            }
        } catch (NumberFormatException e) {
            return new Response(ResultCode.FAIL, "文件内容有误，导入失败");
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (workbook != null) {
                workbook.close();
            }
        }
        return this.itemService.importXls(itemList);
    }

    @GetMapping({"/insertRegCode"})
    public Response gmInsertRegCode(byte privilege, HttpServletRequest request) {
        return this.regCodeService.insertRegCode(privilege, (UserVO) request.getSession().getAttribute("user"));
    }

    @GetMapping({"/deleteRegCode"})
    public Response gmDeleteRegCode(String code, HttpServletRequest request) {
        return this.regCodeService.deleteRegCode(code, (UserVO) request.getSession().getAttribute("user"));
    }

    @GetMapping({"/updateFunction"})
    public Response adminUpdateFunction(Function function, HttpServletRequest request) {
        return this.functionService.updateFunction(function);
    }

}
