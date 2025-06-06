import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { IonSpinner } from '@ionic/angular/standalone';
import {
  IonContent,
  IonFab,
 
  IonFabButton,
  IonIcon,
} from '@ionic/angular/standalone';
//import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { search, add,chevronBack,chevronForward } from 'ionicons/icons';
import { ApiService } from '../app.service';
import { count } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonSpinner, FormsModule, IonContent,
    IonFab,
    IonFabButton,
    IonIcon],
    providers: [DatePipe]
})
export class DashboardPage implements OnInit {

  currentYear: number = 2026;
  currentMonth: number = 0;
  monthName: string = "";
  numberOfDays: number = 0;
  condition = true;
 
  highlightedDates = [
    {
      guid: '',
      date: '',
      textColor: '',
      backgroundColor: '',
    }

  ];
  highlightedDatesValue =[ {
  '2025-06-10': ['red', 'green', 'blue'],
  '2025-06-11': ['green'],
}];
  daysInMonth:Day[]=[];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  displayedColumns: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  dataSource: any[] = [];
  calendar: any[] = [];
  obj = {};
  constructor(private datePipe: DatePipe,private router: Router, private location: Location, private apiService: ApiService) {
    addIcons({ search, add,chevronBack,chevronForward });

  }
  ngOnInit(): void {

    const today = new Date();
    this.currentMonth = today.getMonth() + 1;
    this.currentYear = today.getFullYear();
    this.changeEvent(this.currentMonth, this.currentYear);

  }
  isLoading: boolean = false;
  
  ionViewWillEnter() {
      if (!localStorage.getItem('pageReloadedOnce')) {
    localStorage.setItem('pageReloadedOnce', 'true');
    location.reload(); // hard refresh only once
  }
   this.getBookingDetails();
    this.generateDaysValue(this.currentMonth, this.currentYear);
    //console.log("jun", june2025Days);
  }

  getBookingDetails(): void {

    this.dataSource.forEach((element: any) => {
      var heightlightObj = {
        date: element["date"],
        textColor: '',
        guid: '',
        backgroundColor: '',
      }
      this.highlightedDates.push(heightlightObj);
    });

    var dashboardObj = {
      "month": this.currentMonth > 9 ? this.currentMonth : "0" + this.currentMonth,
      "year": this.currentYear
    }
    this.apiService.getDashboardDetails(dashboardObj).subscribe(response => {
      if (response != null && response["status"] == 200) {
        this.isLoading = false;
        var getDetaildataSource = response["data"];
        if (getDetaildataSource.length > 0) {

           this.daysInMonth.forEach((element: any) => {
           
            var isFindDate = getDetaildataSource.find((f: any) => f["bookingDate"] == element["date"])
            if (isFindDate != null) {
                element["guid"] = isFindDate["guid"],
                element["color"] = "black",
                element["background-color"] = isFindDate["status"] == 'active' ? 'rgb(56, 181, 93)' : isFindDate["status"] == 'closed' ? 'rgb(225, 165, 73)' : isFindDate["status"] == 'completed' ? 'grey' : ""
            } else {
                element["background-color"] = "white";
                 element["color"] = "white"
            }
          });

        }
        const uniqueByName = this.highlightedDates.filter((value, index, self) =>
          index === self.findIndex(p => p.date === value.date)
        );
        this.highlightedDates = uniqueByName;

   


      } else {
        this.isLoading = false;

      }
      this.isLoading = false;
    });
  }
  upArrow() {
    this.currentMonth = this.currentMonth - 1;
    if (this.monthName.substring(0, 3).toUpperCase() == "JAN") {
      this.currentYear = this.currentYear - 1;
      this.currentMonth = 12;
    }

    this.changeEvent(this.currentMonth, this.currentYear);
  }
  downArrow() {
    this.currentMonth = this.currentMonth + 1;
    if (this.monthName.substring(0, 3).toUpperCase() == "DEC") {
      this.currentYear = this.currentYear + 1;
      this.currentMonth = 1;
    }
    this.changeEvent(this.currentMonth, this.currentYear);
  }
  changeEvent(month: any, year: any): void {

    const monthNumber = month; // May (1-based)
    const date = new Date(year, monthNumber - 1); // Month is 0-indexed in Date

    this.monthName = date.toLocaleString('default', { month: 'long' });

    this.numberOfDays = new Date(year, month, 0).getDate();

    this.generateDaysValue(month, year);
  }
  generateDays(month: any, year: any): void {
    this.dataSource = [];
    for (let day = 1; day <= this.numberOfDays; day++) {
      for (let days = 0; days <= 6; days++) {
        var getMonth = month > 9 ? month : "0" + month;
        var getDate = day > 9 ? day : "0" + day;
        var currentDate = year + "-" + getMonth + "-" + getDate;
        var formattedDay = this.getDayNameFromDate(currentDate.toString());
        if (formattedDay.substring(0, 3).toUpperCase() == this.displayedColumns[days].toString().toUpperCase()) {
          this.obj = {
            date: currentDate
          }
          this.dataSource.push(this.obj);

        }
      }
    }

    this.arrrangingDays();
  }

  getDayNameFromDate(dateString: string): string {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  arrrangingDays(): void {
    const daysArray = this.dataSource;

    // Helper to map day name to index (SUN=0, MON=1, ..., SAT=6)
    const dayOrder: Record<string, number> = {
      'SUN': 0, 'MON': 1, 'TUE': 2, 'WED': 3, 'THU': 4, 'FRI': 5, 'SAT': 6
    };

    const result: any[][] = [];
    let currentWeek: any[] = [];

    // First, fill empty days before first real 'SUN'
    const firstDay = Object.keys(daysArray[0])[0];
    const emptyDays = (7 + dayOrder[firstDay] - dayOrder['SUN']) % 7;
    for (let i = 0; i < emptyDays; i++) {
      currentWeek.push({});
    }

    // Now process the days
    daysArray.forEach(dayObj => {
      const dayName = Object.keys(dayObj)[0];
      const dayNumber = dayObj[dayName];
      let date = new Date();
      let dayString = ('0' + date.getDate()).slice(-2);

      const today = new Date();
      var targetCurrentMonth = today.getMonth() + 1;
      var targetCurrentYear = today.getFullYear();
      if (dayString == dayNumber && targetCurrentMonth == this.currentMonth && targetCurrentYear == this.currentYear) {
        dayObj["background-color"] = "#0096FF";
        dayObj["guid"] = uuidv4();
      } else {
        dayObj["background-color"] = "";
        dayObj["guid"] = "";
      }

      //console.log("dayObj", dayObj);
      currentWeek.push(dayObj);

      // When reach Saturday or week length reaches 7, push the week
      if (dayName === 'SAT' || currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    // Fill the last week to 7 days if needed
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({});
      }
      result.push(currentWeek);
    }

    // Ensure always 6 rows (add empty weeks if needed)
    while (result.length < 5) {
      result.push([{}, {}, {}, {}, {}, {}, {}]);
    }
    this.calendar = result;
    // console.log(this.calendar);
  }

  getStyleForBox(data: any) {
    var obj = {
      'background-color': "",
      'color': "",
    };
    if (data["background-color"] != null && data["background-color"] != "") {
      obj = {
        'background-color': data["background-color"],
        'color': "black",
      };
    }
    return obj;
  }
  dateClick(guid: any, date: any): void {
    if (guid == "") {
      guid = 0;
     
    }
    var currentMonth = this.currentMonth > 9 ? this.currentMonth : "0" + this.currentMonth;
    var currentDate = Number(date) > 9 ? Number(date) : "0" + Number(date);
    var selectDate = currentDate + "/" + currentMonth + "/" + this.currentYear;
    var object = {
      name: 'Register',
      value: guid,
      date: selectDate.toString()
    }
    //this.messageEvent.emit(object);
  }
  onDateChange(data: any) {
   localStorage.setItem('pageReloadedOnce', '')
    const newValue = data.date;
    var lengthDate = newValue.length - 1;
    var getDate = this.datePipe.transform(newValue, 'yyyy-MM-dd');
    if (data != null && data["guid"]!=null &&  data["guid"]!="") {
      this.router.navigate(['layout/addbooking/' + data["guid"] + '/' + getDate]);
    } else {
      this.router.navigate(['layout/addbooking/' + 0 + '/' + getDate]);
    }


  }
  addBooking(): void {
    var date = "1991-01-01";
    localStorage.setItem('pageReloadedOnce', '')
    this.router.navigate(['layout/addbooking/' + 0 + '/' + date]);
  }
generateDaysValue(month:any, year: number): Day[] {
  const days: Day[] = [];
  // JS months are 0-based internally, so adjust
  const jsMonth = month - 1;

  // Get number of days in month
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dateObj = new Date(year, jsMonth, dayNum);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(dateObj.getDate()).padStart(2, '0');

    days.push({
      date: `${yyyy}-${mm}-${dd}`,
      number: dayNum,
      dayOfWeek: dateObj.getDay(),
    });
  }
  this.daysInMonth = days;
  this.getBookingDetails();
  return days;
}
}

interface Day {
  date: string;   // "2025-06-10"
  number: number; // day number (1-31)
  dayOfWeek: number; // 0=Sunday, 1=Monday ...
}
