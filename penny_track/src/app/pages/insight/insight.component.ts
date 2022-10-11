import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import Chart from "chart.js";

import { ApiService } from '../../service/api.service';
import { UserData } from '../../class/userdata';
import { Category } from '../../class/category';
import { Catcount } from '../../class/catcount';

import * as moment from 'moment';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html'
})
export class InsightComponent implements OnInit {

  title = "Insight";
  insTitle = "All Time";
  isCollapsed = true;
  uID: any;
  sort: any = 0; //filter all time at default 

  savingsCats = [];
  spendingsCats = [];
  customCatCount = [];

  total: any;
  savingsub: any;
  spendingsub: any;
  comparesub: any;

  compareText = false;
  savedText = false;
  overspendText = false;
  noChart = false;

  userdata: UserData[];
  userdata2: UserData[];
  userdataALL: UserData[];
  categories: Category[];
  categorycnt: Catcount[];

  constructor(
    private titleService:Title,
    private apiService: ApiService
  ) {
    this.apiService.getCategory().subscribe((categories: Category[]) => {
      this.categories = categories;
      // console.log(this.categories);
    })
  }

  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  ngOnInit(): void { 

    this.titleService.setTitle(this.title);
    this.uID = JSON.parse(localStorage.getItem('uid'));

    if (localStorage.getItem('graph_filter')) {
      this.sort = localStorage.getItem('graph_filter');
      this.insTitle = localStorage.getItem('graph_title');
    }

    this.loadGraph(this.uID,this.sort); //load graph
    this.categoryPercentage(this.uID); //load category percentage calulations

    //get all record subtotal
    this.apiService.getUserData(this.uID,0).subscribe((userdata: UserData[]) => {
      this.userdataALL = userdata;

      var savingdataALL = [];
      var spendingdataALL = [];
      var subtotal1ALL: any;
      var subtotal2ALL: any;
      var decimalsubALL: any;

      for ( var row in this.userdataALL ){

        if (this.userdataALL[row]['typeID'] == '0') {
          savingdataALL.push( this.userdataALL[row]['amount'] );

        } else {
          spendingdataALL.push( this.userdataALL[row]['amount'] );

        }
      }
      subtotal1ALL = savingdataALL.reduce((acc, cur) => acc + Number(cur), 0);
      subtotal2ALL = spendingdataALL.reduce((acc, cur) => acc + Number(cur), 0);
      decimalsubALL = subtotal1ALL - subtotal2ALL; //this month subtotal

      this.total = parseFloat(decimalsubALL).toFixed(2);
      this.savingsub = parseFloat(subtotal1ALL).toFixed(2);
      this.spendingsub = parseFloat(subtotal2ALL).toFixed(2);
      // console.log(this.total);

    })
    
    //get comparing
    this.apiService.getUserData(this.uID,1).subscribe((userdata: UserData[]) => {
      this.userdata = userdata;

      var savingdata = [];
      var spendingdata = [];
      var subtotal1: any;
      var subtotal2: any;
      var decimalsub: any;

      for ( var row in this.userdata ){

        if (this.userdata[row]['typeID'] == '0') {
          savingdata.push( this.userdata[row]['amount'] );

        } else {
          spendingdata.push( this.userdata[row]['amount'] );

        }
      }
      subtotal1 = savingdata.reduce((acc, cur) => acc + Number(cur), 0);
      subtotal2 = spendingdata.reduce((acc, cur) => acc + Number(cur), 0);
      decimalsub = subtotal1 - subtotal2; //this month subtotal

      //Comparing with past 1 month
      this.apiService.getUserData(this.uID,3).subscribe((userdata: UserData[]) => {
        this.userdata2 = userdata;

        var com_savingdata = [];
        var com_spendingdata = [];
        var com_subtotal1: any;
        var com_subtotal2: any;
        var com_decimalsub: any;
        var lastmonthsub: any;
        var thismonthsub: any;

        for ( var row in this.userdata2 ){

          if (this.userdata2[row]['typeID'] == '0') {
            com_savingdata.push( this.userdata2[row]['amount'] );
  
          } else {
            com_spendingdata.push( this.userdata2[row]['amount'] );
  
          }
        }
        com_subtotal1 = com_savingdata.reduce((acc, cur) => acc + Number(cur), 0);
        com_subtotal2 = com_spendingdata.reduce((acc, cur) => acc + Number(cur), 0);
        com_decimalsub = com_subtotal1 - com_subtotal2; //past 2 months

        lastmonthsub = com_decimalsub - decimalsub; 
        //past 2 months - this month = last 1 month subtotal

        thismonthsub = decimalsub - lastmonthsub;
        //last month - this month = this month's save/overspend

        this.comparesub = parseFloat(thismonthsub).toFixed(2);

        if (thismonthsub == 0) { 
          this.compareText = true;
        } else if (thismonthsub < 0) {
          this.overspendText = true;
        } else {
          this.savedText = true;
        }

      })
    })

  }

  sizeObj(obj) {
    return Object.keys(obj).length;
  }

  categoryPercentage(id: number) {
    //savings
    this.apiService.getCatCount(id,0).subscribe((counts: Catcount[]) => {
      this.categorycnt = counts;

      var total: number;

      var housing_per: any = 0;
      var trans_per: any = 0;
      var food_per: any = 0;
      var utilities_per: any = 0;
      var insurance_per: any = 0;
      var medical_per: any = 0;
      var invest_per: any = 0;
      var personal_per: any = 0;
      var sports_per: any = 0;
      var credit_per: any = 0;
      var loan_per: any = 0;
      var misc_per: any = 0;
      var income_per: any = 0;

      for ( var row in this.categorycnt ){
        total = this.categorycnt[row]['total']; //arry.invest

        credit_per = (100 / total) * this.categorycnt[row]['credit'];
        food_per = (100 / total) * this.categorycnt[row]['food'];
        housing_per = (100 / total) * this.categorycnt[row]['housing'];
        income_per = (100 / total) * this.categorycnt[row]['income'];
        insurance_per = (100 / total) * this.categorycnt[row]['insurance'];
        invest_per = (100 / total) * this.categorycnt[row]['invest'];
        loan_per = (100 / total) * this.categorycnt[row]['loan'];
        medical_per = (100 / total) * this.categorycnt[row]['medical'];
        misc_per = (100 / total) * this.categorycnt[row]['misc'];
        personal_per = (100 / total) * this.categorycnt[row]['personal'];
        sports_per = (100 / total) * this.categorycnt[row]['sports'];
        trans_per = (100 / total) * this.categorycnt[row]['trans'];
        utilities_per = (100 / total) * this.categorycnt[row]['utilities'];
      }

      //Quick check array is NaN
      if (Number.isNaN(credit_per) || Number.isNaN(food_per) ) {
        this.savingsCats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //the ordering is absolute

      } else {
        this.savingsCats = [
          parseFloat(credit_per).toFixed(1), 
          parseFloat(food_per).toFixed(1), 
          parseFloat(housing_per).toFixed(1), 
          parseFloat(income_per).toFixed(1), 
          parseFloat(insurance_per).toFixed(1), 
          parseFloat(invest_per).toFixed(1), 
          parseFloat(loan_per).toFixed(1), 
          parseFloat(medical_per).toFixed(1), 
          parseFloat(misc_per).toFixed(1), 
          parseFloat(personal_per).toFixed(1), 
          parseFloat(sports_per).toFixed(1), 
          parseFloat(trans_per).toFixed(1), 
          parseFloat(utilities_per).toFixed(1), 
        ]; //the ordering is absolute

      }

      // console.log(this.savingsCats);
    })

    //spendings
    this.apiService.getCatCount(id,1).subscribe((counts: Catcount[]) => {
      this.categorycnt = counts;

      var total: number;

      var housing_per: any = 0;
      var trans_per: any = 0;
      var food_per: any = 0;
      var utilities_per: any = 0;
      var insurance_per: any = 0;
      var medical_per: any = 0;
      var invest_per: any = 0;
      var personal_per: any = 0;
      var sports_per: any = 0;
      var credit_per: any = 0;
      var loan_per: any = 0;
      var misc_per: any = 0;
      var income_per: any = 0;

      for ( var row in this.categorycnt ){
        total = this.categorycnt[row]['total'];

        credit_per = (100 / total) * this.categorycnt[row]['credit'];
        food_per = (100 / total) * this.categorycnt[row]['food'];
        housing_per = (100 / total) * this.categorycnt[row]['housing'];
        income_per = (100 / total) * this.categorycnt[row]['income'];
        insurance_per = (100 / total) * this.categorycnt[row]['insurance'];
        invest_per = (100 / total) * this.categorycnt[row]['invest'];
        loan_per = (100 / total) * this.categorycnt[row]['loan'];
        medical_per = (100 / total) * this.categorycnt[row]['medical'];
        misc_per = (100 / total) * this.categorycnt[row]['misc'];
        personal_per = (100 / total) * this.categorycnt[row]['personal'];
        sports_per = (100 / total) * this.categorycnt[row]['sports'];
        trans_per = (100 / total) * this.categorycnt[row]['trans'];
        utilities_per = (100 / total) * this.categorycnt[row]['utilities'];
      }
      
      //Quick check array is NaN
      if (Number.isNaN(credit_per) || Number.isNaN(food_per) ) {
        this.spendingsCats = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //the ordering is absolute

      } else {
        this.spendingsCats = [
          parseFloat(credit_per).toFixed(1), 
          parseFloat(food_per).toFixed(1), 
          parseFloat(housing_per).toFixed(1), 
          parseFloat(income_per).toFixed(1), 
          parseFloat(insurance_per).toFixed(1), 
          parseFloat(invest_per).toFixed(1), 
          parseFloat(loan_per).toFixed(1), 
          parseFloat(medical_per).toFixed(1), 
          parseFloat(misc_per).toFixed(1), 
          parseFloat(personal_per).toFixed(1), 
          parseFloat(sports_per).toFixed(1), 
          parseFloat(trans_per).toFixed(1), 
          parseFloat(utilities_per).toFixed(1), 
        ]; //the ordering is absolute

      }

      // console.log(this.spendingsCats);
      
    })
  }

  loadGraph(id: number, sort: number) {

    this.apiService.getUserData(id,sort).subscribe((userdata: UserData[]) => {

      if (userdata.length == 0) {
        this.noChart = true;
        // console.log("is empty");
      } else {
        this.userdata = userdata;
      }
      
      var savingdata = [];
      var spendingdata = [];
      var datelabels = [];

      for ( var item in this.userdata ){

        if (this.userdata[ item ]['typeID'] == '0') {
          savingdata.push( this.userdata[ item ]['amount'] );
          spendingdata.push('0');
        } else {
          savingdata.push('0');
          spendingdata.push( this.userdata[ item ]['amount'] );
        }
          
        datelabels.push( moment(this.userdata[ item ]['createDTTM'] ).format('MMM DD HH:mm') );
      }
      // console.log(savingdata);
      // console.log(spendingdata);
      // console.log(datelabels);

      var canvas: any = document.getElementById("chartBig");
      var ctx = canvas.getContext("2d");

      var gradientFill = ctx.createLinearGradient(0, 350, 0, 50);
      gradientFill.addColorStop(0, "rgba(62, 224, 34, 0.0)");
      gradientFill.addColorStop(1, "rgba(62, 224, 34, 0.14)");

      var gradientFill2 = ctx.createLinearGradient(0, 350, 0, 50);
      gradientFill2.addColorStop(0, "rgba(255, 0, 144, 0.0)");
      gradientFill2.addColorStop(1, "rgba(255, 0, 144, 0.14)");

      var chartBig = new Chart(ctx, {
        type: "line",
        responsive: true,
        data: {
          labels: datelabels,
          datasets: [
            {
              label: "Saving",
              fill: true,
              backgroundColor: gradientFill,
              borderColor: "#34fa69",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#34fa69",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#20d600",
              //pointHoverBorderColor:'rgba(35,46,55,1)',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: savingdata
            },
            {
              label: "Spending",
              fill: true,
              backgroundColor: gradientFill2,
              borderColor: "#e44c8e",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#e44c8e",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#ff0055",
              //pointHoverBorderColor:'rgba(35,46,55,1)',
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: spendingdata
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
  
          tooltips: {
            backgroundColor: "#fff",
            titleFontColor: "#ccc",
            bodyFontColor: "#666",
            bodySpacing: 4,
            xPadding: 12,
            mode: "nearest",
            intersect: 0,
            position: "nearest"
          },
          responsive: true,
          scales: {
            yAxes: [
              {
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: "rgba(0,0,0,0.0)",
                  zeroLineColor: "transparent"
                },
                ticks: {
                  display: false,
                  suggestedMin: 0,
                  suggestedMax: 350,
                  padding: 20,
                  fontColor: "#9a9a9a"
                }
              }
            ],
  
            xAxes: [
              {
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  color: "rgba(0,0,0,0)",
                  zeroLineColor: "transparent"
                },
                ticks: {
                  padding: 20,
                  fontColor: "#9a9a9a"
                }
              }
            ]
          }
        }
      });
    })

  }

  applyFilter(number) {

    var filterCheck = JSON.parse(localStorage.getItem('graph_filter'));

    if (number == 1 && filterCheck !== 1) {
      this.insTitle = "1 Month";
      window.location.reload();
      localStorage.setItem('graph_filter','1');
      localStorage.setItem('graph_title',"1 Month");
      
    } else if (number == 2 && filterCheck !== 2) {
      this.insTitle = "7 Days";
      window.location.reload();
      localStorage.setItem('graph_filter','2');
      localStorage.setItem('graph_title',"7 Days");

    } else if (number == 0 && filterCheck !== 0){
      this.insTitle = "All Time";
      window.location.reload();
      localStorage.setItem('graph_filter','0');
      localStorage.setItem('graph_title',"All Time");

    }
  }

}
