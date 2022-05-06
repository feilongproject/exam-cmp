<template>
  <el-main class="main">
    <el-button type="primary" @click="analysisHead">分析表头</el-button>
    <el-button type="primary" @click="analysisBody">分析主体</el-button>
    <el-button type="primary" @click="cmpDatas">比较data</el-button>
    <el-button type="primary" @click="saveLocalStorage">保存到本地</el-button>
    <el-button type="primary" @click="loadLocalStorage">从本地加载</el-button>

    <el-radio-group v-model="splitString">
      <el-radio :label="`,`">csv格式</el-radio>
    </el-radio-group>
    <div class="selectKey">
      <span>选择1</span>
      <el-select v-model="choiceVerticalLineNum1.name" placeholder="1姓名">
        <el-option
          v-for="item in tableDataHead1"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <el-select v-model="choiceVerticalLineNum1.total" placeholder="1分数">
        <el-option
          v-for="item in tableDataHead1"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <el-select v-model="choiceVerticalLineNum1.rank" placeholder="1名次">
        <el-option
          v-for="item in tableDataHead1"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <br />
      <span>选择2</span>
      <el-select v-model="choiceVerticalLineNum2.name" placeholder="2姓名">
        <el-option
          v-for="item in tableDataHead2"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <el-select v-model="choiceVerticalLineNum2.total" placeholder="2分数">
        <el-option
          v-for="item in tableDataHead2"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <el-select v-model="choiceVerticalLineNum2.rank" placeholder="2名次">
        <el-option
          v-for="item in tableDataHead2"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        >
        </el-option>
      </el-select>
    </div>

    <div class="input">
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="请输入内容"
        v-model="exam1"
      >
      </el-input>
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 5 }"
        placeholder="请输入内容"
        v-model="exam2"
      >
      </el-input>
    </div>
    <div class="tableDatas" style="display: flex">
      <el-table :data="tableDataBody1" height="500">
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column prop="name" label="姓名" sortable> </el-table-column>
        <el-table-column prop="total" label="总分" sortable> </el-table-column>
        <el-table-column prop="rank" label="排名" sortable> </el-table-column>
      </el-table>
      <el-table :data="tableDataBody2" style="margin-left: 10px" height="500">
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column prop="name" label="姓名" sortable> </el-table-column>
        <el-table-column prop="total" label="总分" sortable> </el-table-column>
        <el-table-column prop="rank" label="排名" sortable> </el-table-column>
      </el-table>

      <el-table
        :data="cmpData"
        style="flex-basis: 350px; margin-left: 10px"
        height="500"
      >
        <el-table-column type="index" :index="indexMethod"> </el-table-column>
        <el-table-column prop="name" label="姓名" width="100" sortable>
        </el-table-column>
        <el-table-column prop="total1" label="总分1" width="100" sortable>
        </el-table-column>
        <el-table-column prop="rank1" label="排名1" width="100" sortable>
        </el-table-column>
        <el-table-column prop="total2" label="总分2" width="100" sortable>
        </el-table-column>
        <el-table-column prop="rank2" label="排名2" width="100" sortable>
        </el-table-column>
        <el-table-column prop="up" label="提升" width="100" sortable>
        </el-table-column>
      </el-table>
    </div>
  </el-main>
</template>

<style lang="scss">
div.input {
  display: flex;
  flex-direction: row;
  width: 70%;
}
.el-textarea {
  margin: 10px 10px 10px 10px;
}
</style>
<script lang='ts'>
import Vue from "vue";

export default Vue.extend({
  data: () => {
    return {
      exam1: "",
      exam2: "",
      splitString: `,`,

      choiceVerticalLineNum1: {
        name: 0,
        total: 0,
        rank: 0,
      },
      choiceVerticalLineNum2: {
        name: 0,
        total: 0,
        rank: 0,
      },
      tableDataHead1: [{ value: String(), key: Number() }],
      tableDataHead2: [{ value: String(), key: Number() }],
      tableDataBody1: [{ name: String(), total: Number(), rank: Number() }],
      tableDataBody2: [{ name: String(), total: Number(), rank: Number() }],
      cmpData: [
        {
          name: String(),
          total1: Number(),
          rank1: Number(),
          total2: Number(),
          rank2: Number(),
          up: Number(),
        },
      ],
    };
  },
  mounted() {
    console.log("ok");
  },
  methods: {
    saveLocalStorage() {
      var { exam1, exam2 } = this;

      this.$confirm("是否保存？注意：这将会覆盖本地记录", "确认通告", {
        distinguishCancelAndClose: true,
        confirmButtonText: "是",
        cancelButtonText: "否",
      })
        .then(() => {
          localStorage.setItem("exam1", exam1);
          localStorage.setItem("exam2", exam2);
          localStorage.setItem(
            "choice",
            JSON.stringify({
              choice1: this.choiceVerticalLineNum1,
              choice2: this.choiceVerticalLineNum2,
            })
          );
          this.$message({
            type: "info",
            message: "已保存到本地",
          });
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: "取消保存",
            //action === "cancel" ? "放弃保存并离开页面" : "停留在当前页面",
          });
        });

      //
    },
    loadLocalStorage() {
      this.$confirm(
        "是否读取？注意：这将会覆盖显示界面，在本地中未存储的值将覆盖为空",
        "确认通告",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "是",
          cancelButtonText: "否",
        }
      )
        .then(() => {
          var exam1 = localStorage.getItem("exam1");
          var exam2 = localStorage.getItem("exam2");
          var choice = localStorage.getItem("choice");

          this.exam1 = exam1 ? exam1 : "";
          this.exam2 = exam2 ? exam2 : "";

          if (choice) {
            var c: storageChoice = JSON.parse(choice);
            this.choiceVerticalLineNum1 = c.choice1;
            this.choiceVerticalLineNum2 = c.choice2;
          }
          if (exam1 || exam2) {
            this.analysisHead();
            this.analysisBody();
          }

          this.$message({
            type: "info",
            message: "已从本地中读取",
          });
        })
        .catch((action) => {
          this.$message({
            type: "info",
            message: "取消读取",
            //action === "cancel" ? "放弃保存并离开页面" : "停留在当前页面",
          });
        });
    },

    indexMethod(index: number) {
      return index + 1;
    },
    analysisHead() {
      this.tableDataHead1 = [];
      this.tableDataHead2 = [];

      var { exam1, exam2, splitString } = this;

      //console.log(splitString);
      var examList1 = exam1.split("\n");
      var examList2 = exam2.split("\n");

      examList1[0].split(splitString).forEach((item, key) => {
        this.tableDataHead1.push({
          value: item,
          key: key,
        });
      });
      examList2[0].split(splitString).forEach((item, key) => {
        this.tableDataHead2.push({
          value: item,
          key: key,
        });
      });
    },
    analysisBody() {
      this.tableDataBody1 = [];
      this.tableDataBody2 = [];

      var { exam1, exam2, splitString } = this;

      //console.log(splitString);
      var examList1 = exam1.split("\n");
      var examList2 = exam2.split("\n");

      console.log(this.choiceVerticalLineNum1);

      examList1.forEach((item, key) => {
        var lineSplit = item.split(splitString);
        if (key != 0) {
          this.tableDataBody1.push({
            name: lineSplit[this.choiceVerticalLineNum1.name],
            total: parseInt(lineSplit[this.choiceVerticalLineNum1.total]),
            rank: parseInt(lineSplit[this.choiceVerticalLineNum1.rank]),
          });
        }
      });

      examList2.forEach((item, key) => {
        var lineSplit = item.split(splitString);
        if (key != 0) {
          this.tableDataBody2.push({
            name: lineSplit[this.choiceVerticalLineNum2.name],
            total: parseInt(lineSplit[this.choiceVerticalLineNum2.total]),
            rank: parseInt(lineSplit[this.choiceVerticalLineNum2.rank]),
          });
        }
      });

      console.log(this.tableDataBody1);
      console.log(this.tableDataBody2);
    },
    cmpDatas() {
      this.cmpData = [];

      var data1: ExamStudent[] = this.tableDataBody1;
      var data2: ExamStudent[] = this.tableDataBody2;

      console.log(data1, data2);

      data1.forEach((item1, key1) => {
        data2.forEach((item2, key2) => {
          if (item1.name == item2.name) {
            this.cmpData.push({
              name: item1.name,
              total1: item1.total,
              rank1: item1.rank,
              total2: item2.total,
              rank2: item2.rank,
              up: item1.rank - item2.rank,
            });
          }
        });
      });
      console.log(this.cmpData);
    },
  },
});
</script>

