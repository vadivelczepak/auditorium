import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { IonSelect, IonCheckbox, IonSelectOption, NavController } from '@ionic/angular/standalone';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
//import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonButton, IonInput } from '@ionic/angular/standalone';
import { ApiService } from '../app.service';
import { ActivatedRoute } from '@angular/router';
import { IonSpinner } from '@ionic/angular/standalone';
import { IonCol, IonGrid, IonDatetime,IonRow } from '@ionic/angular/standalone';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
@Component({
  selector: 'app-addbooking',
  templateUrl: './addbooking.page.html',
  styleUrls: ['./addbooking.page.scss'],
  standalone: true,
  imports: [CommonModule,IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  
  IonToolbar,
  IonDatetime, IonCol, IonGrid, IonRow,IonSpinner, ReactiveFormsModule, IonCheckbox, IonButton, FormsModule, IonInput, IonSelect, IonSelectOption]
})
export class AddbookingPage implements OnInit {
  eventValue: string = "0";
  isLoading:boolean =false;
  addbookingForm!: FormGroup;
  Id: string = "";
  currentDate: any;
  constructor(private modalCtrl: ModalController,private _fb: FormBuilder, private navCtrl: NavController, private apiService: ApiService, private actroute: ActivatedRoute) {
    this.actroute.params.subscribe(data => {
      this.Id = data['id'];
      this.currentDate = data['date']
    });
    this.formbuild();
  }
  formbuild() {
    this.addbookingForm = this._fb.group({
      "guid": new FormControl(''),
      "name": new FormControl('', [Validators.required]),
      "mobile": new FormControl('', [Validators.required]),
      "slot_type": new FormControl('', [Validators.required]),
      "event": new FormControl('', [Validators.required]),
      "father": new FormControl('',),
      "mother": new FormControl('',),
      "payment": new FormControl(''),
      "amount": new FormControl(''),
      "address": new FormControl(''),
      "check_box": new FormControl(0),
      "status": new FormControl('active'),
      "bookingDate": new FormControl('')
    })
  }
  ngOnInit() {

    if (this.Id != "0") {
      this.getBookingById(this.Id);
    }

  }
  onEventChange(event: CustomEvent): void {

    this.eventValue = event.detail.value;
  }
  isSubmit = false;
  saveBooking() {
    this.isSubmit = true;
    if (this.addbookingForm.valid) {
      this.isSubmit = false;
      var saveObj = {
        "guid": this.Id == "0" ? uuidv4() : this.addbookingForm.value["guid"],
        "name": this.addbookingForm.value["name"],
        "mobile": this.addbookingForm.value["mobile"],
        "slot_type": this.addbookingForm.value["slot_type"],
        "event": this.addbookingForm.value["event"],
        "father": this.addbookingForm.value["father"],
        "mother": this.addbookingForm.value["mother"],
        "payment": this.addbookingForm.value["payment"],
        "amount": this.addbookingForm.value["amount"],
        "address": this.addbookingForm.value["address"],
        "check_box": this.addbookingForm.value["check_box"] ? "1" : "0",
        "status": this.addbookingForm.value["status"],
        "bookingDate": this.Id == "0" ?this.currentDate =="1991-01-01"?this.addbookingForm.value["bookingDate"]:this.currentDate : this.addbookingForm.value["bookingDate"]
      }
      var finalObject = JSON.stringify(saveObj);
      this.isLoading = true;
      this.apiService.saveBookingData(finalObject).subscribe(response => {
        if (response["status"] == 200) {
          this.isLoading = false;
          alert(response["message"]);
          this.navCtrl.back();
        } else {
          this.isLoading = false;
          alert("Something went wrong");
        }
        this.isLoading = false;
      });
    }

  }

  getBookingById(id: any) {
     this.isLoading = true;
    this.apiService.getDataBookingById(id).subscribe(response => {
       this.isLoading = false;
      var getData = response["data"];
      getData['check_box'] = getData['check_box'] == "1" ? 1 : 0;
      this.addbookingForm.patchValue(getData);
      this.eventValue = this.addbookingForm.controls["event"].value;

    });
  }

  goBack(): void {
    this.navCtrl.back();
  }
  isShowDate:boolean=false;
  selectDate():void{
    if(this.currentDate =="1991-01-01")
    this.isShowDate =true;
  }
  closeDate():void{
      this.isShowDate =false;
  }
 selectedDate:string =""; 
  onDateChange(event: CustomEvent) {
    const newValue = event.detail.value;
    this.selectedDate=newValue;
   
  }
  cancel(){
   this.addbookingForm.controls["bookingDate"].setValue(this.addbookingForm.controls["bookingDate"].value);
  this.isShowDate =false;
  }
  confirm(){
    if(this.selectedDate !=""){
     this.addbookingForm.controls["bookingDate"].setValue(this.selectedDate);
    this.isShowDate =false;
    }
    
  }
}
