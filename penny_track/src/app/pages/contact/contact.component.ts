import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ApiService } from '../../service/api.service';
import { Email } from '../../class/email';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {

  v_title = "Contact Us";
  isCollapsed = true;

  contactform: FormGroup;
  submitted = false;
  contactError: any;
  contactSuccess: any;

  emailing: Email = {
    name: null,
    email: null,
    phone: null,
    type: null,
    message: null
  }

  constructor(
    private titleService:Title,
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {}

  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  
  ngOnInit(): void {
    this.titleService.setTitle(this.v_title);

    this.contactform = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['',  [Validators.required, Validators.email] ],
      phone: ['', Validators.required],
      type: ['', Validators.required],
      message: ['', Validators.required]    
    }, {});

  }

  get f() { return this.contactform.controls; }

  send(form) {

    console.log("Submitted ->",form);

    this.submitted = true;

    // stop if form is invalid
    if (this.contactform.invalid) {
      this.contactError = '<b> Invalid - </b>Please fill up all required info.';
      // console.log("Form invalid");
      return;
    }

    var name = form.value.name;
    var email = form.value.email;
    var phone = form.value.phone;
    var type = form.value.type;
    var message = form.value.message;

    this.emailing.name = name ;
    this.emailing.email = email;
    this.emailing.phone = phone;
    this.emailing.type = type;
    this.emailing.message = message;

    this.apiService.sendEmail(name, email, phone, type, message).subscribe((email: Email)=>{

      if(email == null) {
        this.contactError = '<b> Error! - </b>Failed to send, Try Again.';
        // stay and show error popup

      } else {
        // console.log("New record created");
        this.contactSuccess = 'Enquiry sent successfully';
        this.contactform.reset();
        
      }
    });

  }

}
