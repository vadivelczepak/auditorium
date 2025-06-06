import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCol, IonGrid, IonRow } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search } from 'ionicons/icons';

import {
  IonSearchbar,
  InfiniteScrollCustomEvent,
  IonContent,

  IonInfiniteScroll,
  IonInfiniteScrollContent,

} from '@ionic/angular/standalone';
import cloneDeep from 'lodash/cloneDeep';
import { ApiService } from '../app.service';
import { Router } from '@angular/router';
//import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonCol, IonGrid, IonRow,
    IonContent,
    IonInfiniteScroll, IonSearchbar,

    IonInfiniteScrollContent,


  ],
  providers: [ApiService],
})
export class BookingPage implements OnInit {

  items: any = [];
  bookingListClone: any = [];
  constructor(private apiService: ApiService, private router: Router) {
    addIcons({ search });
    this.generateItems();
    //setInterval(() => this.generateItems(), 10000); 
  }
  ngOnInit() {

  }
  ionViewWillEnter() {
    this.searchValue=""
    this.generateItems(); // Called every time page comes into view
  }
  generateItems() {
    this.apiService.getDataBooking()
      .subscribe((response) => {
        this.items = response["data"];
        this.bookingListClone = cloneDeep(this.items);

      });

    // this.apiService.getDataBooking().subscribe(response => {
    //   next: res => console.log('Response:', res),
    // error: err => console.error('HTTP Error:', err)
    //  this.items =response["data"];
    // });

    // const count = this.items.length + 1;
    // for (let i = 0; i < 50; i++) {
    //   this.items.push(`Item ${count + i}`);
    // }
  }
  searchValue="";
  search(e: any): void {
    var value = e.target.value;
    this.searchValue = e.target.value;
    this.items = this.bookingListClone.filter((item: any) => item["name"].toLowerCase().includes(value.toLowerCase()) || item["slot_type"].toLowerCase().includes(value.toLowerCase()) || item["bookingDate"].toLowerCase().includes(value.toLowerCase()) || item["event"].toLowerCase().includes(value.toLowerCase()));
  }
  editClick(item: any) {
    this.router.navigate(['layout/addbooking/' + item.guid + "/" + item.bookingDate]);
  }
  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.generateItems();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
}
