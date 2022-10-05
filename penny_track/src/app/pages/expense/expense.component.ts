import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ApiService } from '../../service/api.service';
import { Record } from '../../class/record';
import { Category } from '../../class/category';
import { UserData } from '../../class/userdata';
import { Target } from '../../class/target';
import { Daycounts } from '../../class/daycount';

import * as moment from 'moment';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {

  editform: FormGroup;
  createform: FormGroup;
  targetform: FormGroup;

  submitted = false;
  editError: any;
  editSuccess: any;
  createError: any;
  createSuccess: any;
  targetError: any;
  targetExist: boolean = false;
  targetSucceed: boolean = false;
  noRecord = false;

  title = "Expense";
  uID: any;
  reload: any;
  maxDate: Date;
  minDate: Date;

  //pagination
  config = {
    id: 'custom',
    itemsPerPage: 10, // can be change
    currentPage: 1
  };
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  
  eachDay: any;
  totalPostSaving: any;
  totalPostSpending: any;
  daysorday: any;
  totalBalance: any;

  categories: Category[];
  records: Record[];

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

  selectedRecord: Record = {
    id: null,
    userID: null,
    name: null,
    type: null,
    typeID: null,
    category: null,
    categoryID: null,
    amount: null,
    description: null,
    createDTTM: null
  }

  editedrecord: UserData = { 
    id: null,
    userID: null,
    name: null,
    typeID: null,
    categoryID: null,
    amount: null,
    description: null,
    createDTTM: null
  };

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

  newtarget: Target = { 
    targetID: null,
    userID: null,
    salary: null,
    target: null,
    payday: null,
    targetDate: null,
    targetStat: null,
    createDTTM: null
  };

  edittarget: Target = { 
    targetID: null,
    userID: null,
    salary: null,
    target: null,
    payday: null,
    targetDate: null,
    targetStat: null,
    createDTTM: null
  };

  constructor(
    private titleService: Title,
    private router: Router, 
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 7); //Limiting forward 7 days

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() - 7); //Limiting backward 7 days
  }

  onPageChange(event){
    console.log(event);
    this.config.currentPage = event;
  }

  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }

  ngOnInit(): void {

    this.titleService.setTitle(this.title);

    this.uID = JSON.parse(localStorage.getItem('uid'));

    //Get all targets by userID
    this.apiService.getTarget(this.uID).subscribe((target: Target[]) => {

      var now = moment().format('YYYY-MM-DD hh:mm:ss');

      if (target.length < 1 || target == undefined) {
        this.targetExist = false;
        //show set target form
      } else if (target[0]['targetDate'] < now) { 
        //target date reached, target auto failed

        this.edittarget.userID = this.uID;
        this.edittarget.targetID = target[0]['targetID'] ;
        this.edittarget.targetStat = 0; //Disable/Inactivate

        this.apiService.updateTarget(this.edittarget).subscribe((update: Target) => {
          
          window.location.reload();
        });

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
            // console.log(this.targets);

            //Get all post target spendings
            this.apiService.getPostSpending(this.uID,this.targets.targetDate,this.targets.createDTTM).subscribe((amounts: UserData[]) => {
              // console.log(amounts);
  
              var post_spending = [];
              for ( var item in amounts ){
                post_spending.push( amounts[item]['amount'] );
              }
              this.totalPostSpending = post_spending.reduce((acc, cur) => acc + Number(cur), 0)
              // console.log(this.totalPostSpending);
              
              //Main calulation
              var sub: any = Number(this.targets.target) - Number(this.totalPostSaving) + Number(this.totalPostSpending); 
              //Saving(-) Spending(+)
              var divided: any = sub / this.daysdiff.days;
              this.eachDay = parseFloat(divided).toFixed(2) 
              //average saving each day to reach the target

              //get balance
              var balance: any = Number(this.totalPostSaving) - Number(this.totalPostSpending);
              this.totalBalance = parseFloat(balance).toFixed(2);
              
              if ( this.eachDay <= 0 ){
                //target complete
                this.targetSucceed = true;

              }
            })
          })
        })
        
      }
    })

    //Get all record by userID
    this.apiService.getRecords(this.uID).subscribe((records: Record[]) => {
      
      if (records.length == 0 || records[0].id == null) {
        this.noRecord = true;
        // console.log("is empty");
      } else {
        this.records = records;
      }
      // console.log(this.records);
    })

    //Get all category for dropdown sellection
    this.apiService.getCategory().subscribe((categories: Category[]) => {
      this.categories = categories;
      // console.log(this.categories);
    })

    this.createform = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: ['', Validators.required]    
    }, {});
    
    this.editform = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      amount: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required]    
    }, {});
    
    this.targetform = this.formBuilder.group({
      // salary: ['', Validators.required],
      target: ['', Validators.required],
      // paydate: ['', Validators.required],
      enddate: ['', Validators.required]  
    }, {});
    
  }

  //Get selected record
  selectRecord(record: Record) {
    this.selectedRecord = record;
    // console.log(this.selectedRecord);

    this.editform.patchValue({
      type: this.selectedRecord.typeID,
      name: this.selectedRecord.name,
      amount: this.selectedRecord.amount,
      category: this.selectedRecord.categoryID,
      description: this.selectedRecord.description
    });

  }

  //Create Record
  create(form) {

    // console.log("Submitted ->",form);

    this.submitted = true;

    // stop if form is invalid
    if (this.createform.invalid) {
      this.createError = '<b> Invalid - </b>Please fill up all required data.';
      // console.log("Form invalid");
      return;
    }

    var type = form.value.type;
    var name = form.value.name;
    var amount = form.value.amount;
    var category = form.value.category;
    var date = form.value.date;
    var des = form.value.description;

    this.newrecord.userID = this.uID;
    this.newrecord.typeID = type ;
    this.newrecord.name = name;
    this.newrecord.amount = amount;
    this.newrecord.categoryID = category;
    this.newrecord.description = des;
    this.newrecord.createDTTM = moment(date).format('YYYY-MM-DD hh:mm:ss');
    console.log(this.newrecord);

    this.apiService.createRecord(this.newrecord).subscribe((newrecord: UserData)=>{

      if(newrecord == null) {
        // console.log("Record fail");
        this.createError = '<b> Error! - </b>Failed to create record, Try Again.';
        // stay and show error popup

      } else {
        // console.log("New record created");
        this.createSuccess = 'New record created successfully';
        this.createform.reset();
        
        localStorage.setItem('reload_req',"1");
      }
    });

  }

  //Delete Record
  deleteRecord(id: number) {
    
    this.apiService.deleteRecord(id, this.uID).subscribe((delrecord: Record) => {
      // console.log("Record deleted, ", delrecord);
      window.location.reload();
    });
  }

  //Edit Record
  edit(form) {

    // console.log("Submitted ->",form);

    this.submitted = true;

    // stop if form is invalid
    if (this.editform.invalid) {
      this.editError = '<b> Invalid - </b>Please fill up all required data.';
      // console.log("Form invalid");
      return;
    }

    var type = form.value.type;
    var name = form.value.name;
    var amount = form.value.amount;
    var category = form.value.category;
    var des = form.value.description;

    this.editedrecord.id = this.selectedRecord.id;
    this.editedrecord.userID = this.uID;
    this.editedrecord.typeID = type ;
    this.editedrecord.name = name;
    this.editedrecord.amount = amount;
    this.editedrecord.categoryID = category;
    this.editedrecord.description = des;
    console.log(this.editedrecord);

    if (this.editedrecord.typeID == this.selectedRecord.typeID && 
      this.editedrecord.name == this.selectedRecord.name && 
      this.editedrecord.amount == this.selectedRecord.amount &&
      this.editedrecord.categoryID == this.selectedRecord.categoryID &&
      this.editedrecord.description == this.selectedRecord.description) {

      this.editError = 'No data changes.';
      // console.log("No change");
      return;
    }

    this.apiService.updateRecord(this.editedrecord).subscribe((editrecord: UserData)=>{

      if(editrecord == null) {
        // console.log("Update fail");
        this.editError = '<b> Error! - </b>Failed to update record, Try Again.';
        // stay and show error popup

      } else {
        // console.log("Record updated");
        this.editSuccess = 'Record update successfully';
        
        this.editform.patchValue({
          type: this.editedrecord.typeID,
          name: this.editedrecord.name,
          amount: this.editedrecord.amount,
          category: this.editedrecord.categoryID,
          description: this.editedrecord.description
        });

        localStorage.setItem('reload_req',"1");
      }
    });

  }

  closeReload() {
    this.reload = localStorage.getItem('reload_req');

    if (this.reload == '1') {
      localStorage.removeItem('reload_req'); //reset
      window.location.reload();
    }
  }

  //Create Target
  targetSet(form) {

    // console.log("Submitted ->",form);

    this.submitted = true;

    // stop if form is invalid
    if (this.targetform.invalid) {
      this.targetError = '<b> Invalid - </b>Please fill up all required data.';
      // console.log("Form invalid");
      return;
    }

    // var salary = form.value.salary;
    var target = form.value.target;
    // var paydate = form.value.paydate;
    var enddate = form.value.enddate;


    this.newtarget.userID = this.uID;
    this.newtarget.salary = 0 ;
    this.newtarget.target = target;
    this.newtarget.payday = moment().format('YYYY-MM-DD hh:mm:ss');
    this.newtarget.targetDate = moment(enddate).format('YYYY-MM-DD hh:mm:ss');
    this.newtarget.targetStat = 1; //Active 
    console.log(this.newtarget);

    this.apiService.createTarget(this.newtarget).subscribe((newtarget: Target)=>{

      if(newtarget == null) {
        // console.log("Record fail");
        this.targetError = '<b> Error! - </b>Failed to set target, Try Again.';
        // stay and show error popup

      } else {

        window.location.reload();
      }
    });

  }

  giveUp(id: number) {

    this.edittarget.userID = this.uID;
    this.edittarget.targetID = id;
    this.edittarget.targetStat = 0; //Disable/Inactivate

    this.apiService.updateTarget(this.edittarget).subscribe((update: Target) => {
      
      window.location.reload();
    });

  }

  complete(id: number) {

    this.edittarget.userID = this.uID;
    this.edittarget.targetID = id;
    this.edittarget.targetStat = 2; //Complete/Fullfiled

    this.apiService.updateTarget(this.edittarget).subscribe((update: Target) => {
      
      window.location.reload();
    });

  }


}
