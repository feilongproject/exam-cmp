<template>
    <div class="buttons">
        <button @click="cmpData(true)">比较并显示结果</button>
        <button @click="saveData">比较并保存结果</button>
        <!-- <button>读取</button> -->
        <button @click="openNotice">打开数据比较面板</button>
    </div>
    <div class="excelDatas">
        <div class="excelBoard excelData" v-for="(excelData,index) in excelDatas">
            <label class="excelBoard" :for="`inputFile${index}`">
                <span>{{ excelData.desc }}</span>
                <input
                    accept=".xls, .xlsx"
                    type="file"
                    :id="`inputFile${index}`"
                    style="display: none"
                    @change="readExcel($event, index)"
                />
            </label>
            <Excel
                ref="childsExcelData"
                :data="excelData.data"
                :filename="excelData.filename"
                :key="excelData.html"
                :ver="excelData.ver"
            />
            <!-- <div v-html="excelData.html"></div> -->
        </div>
    </div>
    <Notice ref="noticeShow" title="比较后数据">
        <Excel :excelShow="true" :data="{}" :customData="customData" :filename="cmpFilename" />
    </Notice>
</template>

<script setup lang="ts">
import Excel from './Excel.vue';
import Notice from "./Notice.vue";
import { reactive, ref, unref } from 'vue';
import * as XLSX from 'xlsx-js-style';

const excelDatas = reactive([
    { desc: '选择旧数据', html: "", ver: "old", json: {}, data: {}, filename: "" },
    { desc: '选择新数据', html: "", ver: "new", json: {}, data: {}, filename: "" },
]);
const childsExcelData: {
    ver: string;
    finalData: XLSX.CellObject[][];
    finalShortData: XLSX.CellObject[][];
    headInfo: {
        data: { id: number; data: string | undefined; }[];
        selects: { selected: string; name: string; cnName: string; rex: RegExp; }[];
        autoAnalyze: { x: number; name: string; }[];
    }
}[] = reactive([]);
const noticeShow = ref();
const customData = ref();
const cmpDatas: XLSX.CellObject[][] = reactive([]);
var cmpFilename = ref(new Date().getTime());

function openNotice() {
    cmpFilename.value = new Date().getTime();
    customData.value = unref(cmpDatas);
    noticeShow.value.noticeShow = !noticeShow.value.noticeShow;
}

function readExcel(e: any, type: number) {
    const file: FileList = e.target.files;
    //console.log(file[0]);

    if (file.length <= 0) {
        return false;
    } else if (!/\.(xls|xlsx)$/.test(file[0].name.toLowerCase())) {
        alert("上传格式不正确，请上传xls或者xlsx格式");
        return false;
    }

    const fileReader = new FileReader();
    fileReader.onload = ev => {
        const workbook = XLSX.read(ev.target!.result, {
            type: "binary",
        });
        const wsname = workbook.SheetNames[0];
        //console.log(wsname);
        excelDatas[type].filename = file[0].name;
        excelDatas[type].data = workbook.Sheets[wsname];
        excelDatas[type].json = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
        excelDatas[type].html = XLSX.utils.sheet_to_html(workbook.Sheets[wsname]);
        //console.log(excelDatas);
    }
    fileReader.readAsBinaryString(file[0]);
}

function cmpData(openN: boolean): boolean {
    const oldExcel = childsExcelData[0].ver == "old" ? childsExcelData[0] : childsExcelData[1];
    const newExcel = childsExcelData[0].ver == "new" ? childsExcelData[0] : childsExcelData[1];
    //console.log(oldExcel, newExcel);
    if (!oldExcel.finalData.length || !newExcel.finalData.length) {
        alert("错误的数据！请确保双方数据均已经正常解析！");
        return false;
    }
    while (cmpDatas.length) cmpDatas.pop();
    const oldData = oldExcel.finalShortData, newData = newExcel.finalShortData;
    //console.log(oldData, newData);

    for (const [index, oldCells] of oldData.entries()) {
        //console.log(oldCells[0].v);
        for (const [inex, newCells] of newData.entries()) {
            if (oldCells[0].v == newCells[0].v) {
                //console.log(oldCells, newCells);
                newCells.shift();
                //console.log(oldCells[2], newCells[1]);
                if (oldCells[2] && (typeof oldCells[2].v == 'number') && newCells[1] && (typeof newCells[1].v == 'number'))
                    cmpDatas.push([...oldCells, ...newCells, { t: "n", v: oldCells[2].v - newCells[1].v }]);
                else cmpDatas.push([...oldCells, ...newCells,]);
            }
        }
    }
    cmpDatas[0][5] = { t: "s", v: "排名提升" };
    //console.log(cmpDatas);
    if (openN) openNotice();
    return true;
}

function saveData() {
    if (!cmpData(false)) return;
    //cmpDatas.unshift(cmpDatas[0]);
    cmpDatas[0][1] = { t: "s", v: "旧" + cmpDatas[0][1].v };
    cmpDatas[0][2] = { t: "s", v: "旧" + cmpDatas[0][2].v };
    cmpDatas[0][3] = { t: "s", v: "新" + cmpDatas[0][3].v };
    cmpDatas[0][4] = { t: "s", v: "新" + cmpDatas[0][4].v };
    for (const [indexx, cells] of cmpDatas.entries()) {
        for (const [indexy, cell] of cells.entries()) {
            if (cmpDatas[indexx][indexy]) {
                cmpDatas[indexx][indexy].s = {
                    alignment: {
                        wrapText: false,
                        vertical: "center",
                        horizontal: "center",
                    },
                    border: { // 设置边框
                        top: { style: 'thin' },
                        bottom: { style: 'thin' },
                        left: { style: 'thin' },
                        right: { style: 'thin' }
                    }
                }
            }
        }
    }
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(cmpDatas);
    if (!ws['!cols']) ws['!cols'] = [];
    ws['!cols'][2] = { wch: 10 };
    ws['!cols'][4] = { wch: 10 };
    ws['!cols'][5] = { wch: 13 };

    // if (!ws["!merges"]) ws["!merges"] = [];
    // ws['!merges'].push(XLSX.utils.decode_range("A1:A2"));
    // ws['!merges'].push(XLSX.utils.decode_range("B1:C1"));
    // ws['!merges'].push(XLSX.utils.decode_range("D1:E1"));
    // ws['!merges'].push(XLSX.utils.decode_range("F1:F2"));

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    var saveFilenames: {
        filenames: string[];
        endname: string | null;
        default: string;
    } = { filenames: [], endname: null, default: "" };
    for (const excelData of excelDatas) saveFilenames.filenames.push(excelData.filename.replace(/(\.xls)x?$/, ""));
    saveFilenames.default = saveFilenames.filenames.join("and") + "=比较";

    saveFilenames.endname = (prompt("请输入保存文件名称：", saveFilenames.default) || saveFilenames.default) + ".xlsx";
    XLSX.writeFile(wb, saveFilenames.endname);
}
</script>

<style scoped>
.excelDatas {
    display: flex;
    align-items: stretch;
    justify-content: space-around;
}
.excelData {
    /* height: calc(50% - 10px); */
    width: calc(50% - 10px);
    overflow: auto;
    white-space: nowrap;
}
.excelBoard {
    min-height: 300px;
    max-height: 800px;
    padding: 5px;
    border: solid 1px #eea931;
}
</style>