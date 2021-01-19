<template>
  <div class="container">
    <div class="page" id="page">
      <div class="title">算术题</div>
      <div class="fill">
        <div class="fill-cell">日期：<div class="fill-cell-underline"></div></div>
        <div class="fill-cell">分数：<div class="fill-cell-underline"></div></div>
      </div>
      <div class="formula">
        <div class="formula-cell" v-for="(item, index) in formulas" :key="index">
          <div class="formula-cell-f">{{ item.a }} {{ item.b >= 0 ? '+' : '-'}} {{ Math.abs(item.b) }} {{ item.c >= 0 ? '+' : '-'}} {{ Math.abs(item.c) }}</div>
        </div>
      </div>
    </div>

    <div class="tool noprint">
      <button @click="refresh">刷新</button>
      <button @click="print">打印</button>
      <button @click="save">保存PDF</button>
    </div>
  </div>
</template>

<script>
import { Printd } from 'printd'
import { run } from 'formula'
import html2pdf from 'html2pdf.js'
const operatorList = ['+', '-']

export default {
  data () {
    return {
      formulas: []
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.formulas = []
      while (1) {
        let formula = this.genFormula()

        if (this.formulas.indexOf(formula) >= 0) {
          continue
        }
        this.formulas.push(this.genFormula())

        if (this.formulas.length >= 30) {
          break
        }
      }

      // console.log(this.formulas)
    },
    genFormula () {
      let params = {
        a: this.getNumber(true),
        b: this.getNumber(),
        c: this.getNumber()
      }
      let ret = run('sum(a, b)', params)
      if (ret < -2 || ret > 20) {
        return this.genFormula()
      }

      ret = run('sum(a, b, c)', params)
      // console.log(params, ret)
      if (ret < -2 || ret > 20) {
        return this.genFormula()
      }
      return params
    },

    getNumber (frist = false) {
      let operator = frist ? '+' : operatorList[parseInt(Math.random() * 10 / 2)]
      let number = parseInt(Math.random() * 100 / 5)
      number = operator === '-' ? number * -1 : number

      if (number < -20 || number > 20 || number === 0) {
        return this.getNumber(frist)
      }
      return number
    },

    print () {
      let p = new Printd()
      console.log(document.getElementById('page'))
      const cssText = `
      .page {
        margin: 0px;
        width: 100%;
        height: 100%;
        padding: 0;
        box-sizing: border-box;
        box-shadow: none;
      }
      .formula-cell {
        width: 240px;
        padding-right: 130px;
      }
      .formula-cell {
        height: 60px;
        line-height: 60px;
      }
      `
      p.print(document.getElementById('page'), ['/static/styles/page.css', cssText])
    },

    save () {
      const element = document.getElementById('page')
      var opt = {
        margin: 1,
        filename: 'myfile.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: 'avoid-all' }

      }

      html2pdf().set(opt).from(element).save()
    }
  }
}
</script>

<style scoped>
@import '../../static/styles/page.css';

.container {
  background-color: #F5F5F5;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 0 30px;
}

.tool {
  min-width: 80px;
  height: 46px;
  line-height: 46px;
  padding: 0 20px;
  background-color: #FFFFFF;
  position: fixed;
  left: 0;
  bottom: 10px;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3);
}
</style>
