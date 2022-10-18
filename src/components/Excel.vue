<template>
    <div v-show="size">表格大小：{{ size }}</div>
    <div v-if="!customData" class="showInfo">
        是否打开表格可视化：
        <label>
            打开
            <input type="radio" :name="eId" @click="excelShow = !excelShow" :checked="excelShow" />
        </label>
        <label>
            关闭
            <input type="radio" :name="eId" @click="excelShow = !excelShow" :checked="!excelShow" />
        </label>
    </div>
    <div v-if="!customData" class="headInfo">
        <template v-for="select in headInfo.selects">
            {{ select.cnName }}
            <select
                v-model="select.selected"
                @change="selectHeadInfo($event, select.name)"
                required
            >
                <option value="NONE">未选择</option>
                <option
                    v-for="(options,id) in headInfo.data"
                    :key="id"
                    :value="options.id"
                >{{ options.data }}</option>
            </select>
        </template>
    </div>
    <table v-if="excelShow">
        <thead>{{ filename }}{{ fileInfo }}</thead>
        <tbody>
            <tr v-for="htmlData in finalData">
                <template v-for="cellData in htmlData">
                    <td v-if="cellData">
                        <!-- {{ cellData.v ? cellData.v : cellData }} -->
                        {{ cellData ? cellData.v : cellData }}
                    </td>
                </template>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { CellObject, WorkSheet } from 'xlsx-js-style';
import { charToNum, numToChar } from './sheetConver';

const props = defineProps(["data", "filename", "excelShow", "customData", "ver"]);
const data: WorkSheet = props.data;
const filename: string = props.filename;
const customData: CellObject[][] = props.customData;
const finalData: CellObject[][] = reactive([]);
const ver: string = ref(props.ver);

const eId = ref(Math.random().toString());
const excelShow = ref(props.excelShow || false);
const headInfo: {
    data: { id: number; data: string | undefined; }[];
    selects: { selected: string; name: string; cnName: string; rex: RegExp; }[];
    autoAnalyze: { x: number; name: string; }[];
} = reactive({
    data: [],
    selects: [
        { selected: "NONE", name: "username", cnName: "姓名", rex: /(姓)/ },
        { selected: "NONE", name: "total", cnName: "总分", rex: /(总分)/ },
        { selected: "NONE", name: "rank", cnName: "排名", rex: /(班级)/ }
    ],
    autoAnalyze: [],
});
const size = data["!ref"];
const merges = data["!merges"];
const fileInfo = ref("");

if (customData && customData.length > 0) {
    //console.log("已导入数据：", finalData);
    //console.log(customData);
    finalData.push(...customData);

} else if (merges) {
    console.log("merges", merges);
    alert(`暂不支持文件中含有合并单元格部分！请在表格内只留下一行用于对齐数据的表头`);
} else if (size) {
    const exp = size?.match(/([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/) || ["0", "0", "0"];
    const start = {
        x: charToNum(exp[1]),
        y: parseInt(exp[2]),
    };
    const end = {
        x: charToNum(exp[3]),
        y: parseInt(exp[4]),
    };
    //console.log(`start:`, start, `end:`, end);
    //console.log(data['A1']);

    for (let y = start.y; y <= end.y; y++) {
        const _cells = [];
        for (let x = start.x; x <= end.x; x++) {
            const cell = `${numToChar(x)}${y}`;
            _cells.push(data[cell]);
        }
        finalData.push(_cells);
    }

    for (const [index, cell] of finalData[0].entries()) {
        if (!cell) continue;
        for (const [iv, item] of headInfo.selects.entries()) {
            if (item.rex.test(cell.w || "")) {
                headInfo.selects[iv].selected = index.toString();
                headInfo.autoAnalyze[iv] = { x: index, name: cell.w! };
            }
        }
        headInfo.data.push({
            id: index,
            data: cell.w,
        });
    }
    if (headInfo.autoAnalyze.length > 0) {
        const fillStr: string[] = [];
        for (const cell of headInfo.autoAnalyze) {
            fillStr.push(`表头名称：${cell.name}，所在位置：第${cell.x}列`);
        }
        alert(`分析结果：` +
            `\n文件名：${filename}` + `\n自动分析数量：${headInfo.autoAnalyze.length}个` +
            `\n分析数据：\n-- ` +
            fillStr.join("\n-- ") +
            `\n\n注意：可能会存在部分因为表头文字错误、表头并非单独一行导致的出错情况，可以打开表格可视化进行比对`);
    } else {
        alert("无任何分析结果！数据有大概率出错！");
    }

}

defineExpose({
    ver,
    finalData,
    headInfo,
    get finalShortData() {
        const shortData: CellObject[][] = [[]];
        for (const head of headInfo.selects) {
            //console.log(finalData[0], head.selected,);

            shortData[0].push(finalData[0][parseInt(head.selected)]);
            for (const [index, cells] of finalData.entries()) {
                if (index == 0) continue;
                if (!shortData[index]) shortData[index] = [];
                shortData[index].push(cells[parseInt(head.selected)]);
                //console.log(index, head.selected, JSON.parse(JSON.stringify(shortData)));
            }
        }
        return shortData
    }
});

function selectHeadInfo(event: Event, type: string) {
    console.log(eId.value, (event as any).target.value, type);
    headInfo

}
</script>

<style scoped>
.showInfo {
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>