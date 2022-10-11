import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Chart from "chart.js";

import { ApiService } from '../../service/api.service';
import { Category } from '../../class/category';
import { UserData } from '../../class/userdata';
import { Record } from '../../class/record';
import { CusCatCount } from '../../class/catcount_custom';
import { UserCategory } from '../../class/usercategory';
import { Target } from '../../class/target';
import { Daycounts } from '../../class/daycount';

import * as moment from 'moment';

@Component({
  selector: "app-index",
  templateUrl: "index.component.html"
})
export class IndexComponent implements OnInit {

  quickform: FormGroup;
  submitted = false;
  quickError: any;
  quickSuccess: any;
  
  title = "Home";
  isCollapsed = true;
  uID: any;
  maxDate: Date;
  comparesub: any;
  highestCat: any;
  percentCat: any;
  totalPostSaving: any;
  totalPostSpending: any;
  eachDay: any;
  daysorday: any;

  noRecord = false;
  noChart = false;
  noChart2 = false;
  compareText = false;
  savedText = false;
  overspendText = false;
  priority1 = false;
  priority2 = false;
  targetExist: boolean = false;
  targetSucceed: boolean = false;

  userdata: UserData[];
  userdata2: UserData[];
  categories: Category[];
  records: Record[];

  newrecord: UserData = { 
    id: null,
    userID: null,
    name: null,
    typeID: null,
    categoryID: null,
    amount: null,
    description: null,
    createDTTM: null
  };

  targets: Target = { 
    targetID: null,
    userID: null,
    salary: null,
    target: null,
    payday: null,
    targetDate: null,
    targetStat: null,
    createDTTM: null
  };

  daysdiff: Daycounts ={
    days: null,
    months: null
  }

  constructor(
    private titleService:Title,
    private router: Router, 
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7); //Limiting forward 7 day

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
    localStorage.setItem('page_title', this.title);

    this.uID = JSON.parse(localStorage.getItem('uid'));

    this.quickform = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required]    
    }, {});

    this.loadGraph(this.uID,1); //load summery graph (1 Month)
    this.loadWeeklyGraph(this.uID,2); //load weekly graph

    this.apiService.getTopRecent(this.uID).subscribe((records: Record[]) => {
      
      if (records.length == 0) {
        this.noRecord = true;
        // console.log("is empty");
      } else {
        this.records = records;
      }

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
      this.apiService.getUserData(this.uID,3).subscribe((userdata2: UserData[]) => {
        this.userdata2 = userdata2;

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

    //Recommend system
    this.apiService.getCatCountSpen(this.uID).subscribe((counts: CusCatCount[]) => {
      // console.log(counts);

      var categoryIDs = [];
      var catCounts = []
      var catArr = Object.keys(counts[0]).length;

      //extract category counts and related category IDs
      for ( var row in counts) {

        for (var i=0; i<catArr; i++) { 

          if (counts[row][i] != '0') {
            catCounts.push(counts[row][i]);
            categoryIDs.push(i);
          } 
        }
      }

      this.apiService.getCatByIDs(this.uID,categoryIDs).subscribe((data: UserCategory[]) => {
        // console.log(data);

        var spendingdata = [];

        for ( var key in data ){
          spendingdata.push( data[key]['amount'] );
 
        }
        var totalspend = spendingdata.reduce((acc, cur) => acc + Number(cur), 0);

        //for priority 1
        var totalSub1 = {};
        var tempSub1: any = 0;
        var tempID1: any;
        var highestID1: any;

        //for priority 2
        var totalSub2 = {};
        var tempSub2: any = 0;
        var tempID2: any = null;
        var highestID2: any;

        for ( var row in data) {
          //loop according to the categoryIDs
          for (var y = 0; y < categoryIDs.length; y++) { 

            if ( data[row]['categoryID'] == categoryIDs[y] ){

              if ( data[row]['priority'] == '1' ) {
                
                if ( categoryIDs[y] == tempID1 ) { //find exiested ID to sum up
                  
                  totalSub1[categoryIDs[y]] = Number(data[row]['amount']) + tempSub1;
                  tempSub1 = totalSub1[categoryIDs[y]]; //store current sub temp for next loop

                } else if ( categoryIDs[y] !== tempID1 )  { //new entry
                  tempID1 = categoryIDs[y]; //set current accepted id for next loop
                  
                  totalSub1[categoryIDs[y]] = Number(data[row]['amount']);
                  tempSub1 = Number(data[row]['amount']);
                }

              } else if (( data[row]['priority'] == '2' )) {

                if ( categoryIDs[y] == tempID2 ) { //find exiested ID to sum up
                  
                  totalSub2[categoryIDs[y]] = Number(data[row]['amount']) + tempSub2;
                  tempSub2 = totalSub2[categoryIDs[y]]; //store current sub temp for next loop

                } else if ( categoryIDs[y] != tempID2 )  { //new entry

                  tempID2 = categoryIDs[y]; //set current accepted id for next loop 
                  
                  totalSub2[categoryIDs[y]] = Number(data[row]['amount']);
                  tempSub2 = Number(data[row]['amount']);
                  
                }

              } else if (( data[row]['priority'] == '3' )) {
                //ignore this priority level
              }

            } 
          }
        }
        // console.log("results p1 ->",totalSub1);
        // console.log("results p2 ->",totalSub2);

        //get max total priority 1
        var arr1 = Object.keys( totalSub1 ).map(function ( key ) { return totalSub1[key]; });
        var max1 = Math.max.apply( null, arr1 );
        // console.log("max p1", max1); 
        
        //check max number's category ID priority 1
        var results = Object.keys( totalSub1 ).map(function ( key ) { return totalSub1[key] == max1; });
        for (var x=0; x < Object.keys( totalSub1 ).length; x++) {
          if (results[x]) {
            highestID1 = Object.keys( totalSub1 )[x];
          }
        }
        // console.log("highest ID p1 - >", highestID1);

        //get max total priority 2
        var arr2 = Object.keys( totalSub2 ).map(function ( key ) { return totalSub2[key]; });
        var max2 = Math.max.apply( null, arr2 );
        // console.log("max p2", max2); 
        
        //check max number's category ID priority 2
        var results = Object.keys( totalSub2 ).map(function ( key ) { return totalSub2[key] == max2; });
        for (var x=0; x < Object.keys( totalSub2 ).length; x++) {
          if (results[x]) {
            highestID2 = Object.keys( totalSub2 )[x];
          }
        }
        // console.log("highest ID p2 - >", highestID2);

        var percent: any;
        //comparing the highest id
        if ( max1 > max2 ) {
          this.apiService.getCategoryName(highestID1).subscribe((cname: Category[]) => {
            this.highestCat = cname[0]['category'];
            percent = (100 / totalspend) * max1;
            this.percentCat = parseFloat(percent).toFixed(1);
            this.priority1 = true; 
          })

        } else if ( max1 < max2 ) {
          this.apiService.getCategoryName(highestID2).subscribe((cname: Category[]) => {
            this.highestCat = cname[0]['category'];
            percent = (100 / totalspend) * max2;
            this.percentCat = parseFloat(percent).toFixed(1);
            this.priority2 = true; 
          })
        } else {
          this.highestCat = "Not enough data to generate recommendations";
          this.priority1 = false; 
          this.priority2 = false; 
        }
        
      })
    })

    //Get all targets by userID
    this.apiService.getTarget(this.uID).subscribe((target: Target[]) => {

      if (target.length < 1 || target == undefined) {
        this.targetExist = false;
        //show set target form
      } else {
        this.targetExist = true;

        this.targets.targetID = target[0]['targetID'];
        this.targets.target = target[0]['target'];
        this.targets.targetDate = target[0]['targetDate'];
        this.targets.salary = target[0]['salary'];
        this.targets.payday = target[0]['payday'];
        this.targets.createDTTM = target[0]['createDTTM'];
        // console.log(this.targets);

        //Calulation
        this.apiService.getCountdown(this.uID).subscribe((days: Daycounts[]) => {
          this.daysdiff.days = days[0]['days'];
          this.daysdiff.months = days[0]['months'];
          // console.log(this.daysdiff);

          var day = Number(this.daysdiff.days);
          if ( day > 1) {
            this.daysorday = "Days";
          } else {
            this.daysorday = "Day";
          }

          //Get all post target savings
          this.apiService.getPostSaving(this.uID,this.targets.targetDate,this.targets.createDTTM).subscribe((amounts: UserData[]) => {
            // console.log(amounts);

            var post_saving = [];
            for ( var item in amounts ){
              post_saving.push( amounts[item]['amount'] );
            }
            this.totalPostSaving = post_saving.reduce((acc, cur) => acc + Number(cur), 0)
            // console.log(this.totalPostSaving);

            //Get all post target spendings
            this.apiService.getPostSpending(this.uID,this.targets.targetDate,this.targets.createDTTM).subscribe((amounts: UserData[]) => {
              // console.log(amounts);
  
              var post_saving = [];
              for ( var item in amounts ){
                post_saving.push( amounts[item]['amount'] );
              }
              this.totalPostSpending = post_saving.reduce((acc, cur) => acc + Number(cur), 0)
              // console.log(this.totalPostSpending);
              
              //Main calulation
              var sub = Number(this.targets.target) - this.totalPostSaving + this.totalPostSpending; //Saving(-) Spending(+)
              var divided: any = sub / this.daysdiff.days;
              this.eachDay = parseFloat(divided).toFixed(2) 
              //average saving each day to reach the target

              if ( this.eachDay <= 0 ){
                //target complete
                this.targetSucceed = true;

              }
            })
          })
        })
        
      }
    })
    
  }

  create(form) {

    // console.log("Submitted ->",form);

    this.submitted = true;

    // stop if form is invalid
    if (this.quickform.invalid) {
      this.quickError = '<b> Invalid - </b>Please fill up all required data.';
      // console.log("Form invalid");
      return;
    }

    var type = form.value.type;
    var name = form.value.name;
    var amount = form.value.amount;
    var category = form.value.category;
    var date = form.value.date;

    this.newrecord.userID = this.uID;
    this.newrecord.typeID = type ;
    this.newrecord.name = name;
    this.newrecord.amount = amount;
    this.newrecord.categoryID = category;
    this.newrecord.description = "#Quick recorded";
    this.newrecord.createDTTM = moment(date).format('YYYY-MM-DD hh:mm:ss');
    // console.log(this.newrecord);

    this.apiService.createRecord(this.newrecord).subscribe((newrecord: UserData)=>{

      if(newrecord == null) {
        // console.log("Record fail");
        this.quickError = '<b> Error! - </b>Failed to create record, Try Again.';
        // stay and show error popup

      } else {
        // console.log("New record created");
        this.quickSuccess = 'New record created successfully';
        this.quickform.reset();
        
      }
    });

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
          
        datelabels.push( moment(this.userdata[ item ]['createDTTM'] ).format('MMM DD') );
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

  loadWeeklyGraph(id: number, sort: number) {

    this.apiService.getUserData(id,sort).subscribe((userdata: UserData[]) => {

      if (userdata.length == 0) {
        this.noChart2 = true;
        // console.log("is empty");
      } else {
        this.userdata2 = userdata;
      }
      
      var savingdata = [];
      var spendingdata = [];
      var datelabels = [];

      for ( var item in this.userdata2 ){

        if (this.userdata2[ item ]['typeID'] == '0') {
          savingdata.push( this.userdata2[ item ]['amount'] );
          spendingdata.push('0');
        } else {
          savingdata.push('0');
          spendingdata.push( this.userdata2[ item ]['amount'] );
        }
          
        datelabels.push( moment(this.userdata2[ item ]['createDTTM'] ).format('MMM DD HH:mm') );
      }
      // console.log(savingdata);
      // console.log(spendingdata);
      // console.log(datelabels);

      var canvas: any = document.getElementById("chartBig2");
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

}
