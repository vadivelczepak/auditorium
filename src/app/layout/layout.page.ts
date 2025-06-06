import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { IonContent,IonMenu,IonApp,IonRouterOutlet,  IonHeader, IonTitle, IonToolbar,IonList,IonIcon,IonLabel,IonItem } from '@ionic/angular/standalone';
import { MenuController } from '@ionic/angular';

import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenu,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonList,
 IonBackButton,
  IonItem,
  IonRouterOutlet,
  
  IonMenuToggle,


} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { caretBack } from 'ionicons/icons';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
  standalone: true,
  imports: [IonLabel, IonRouterOutlet,
    IonList, IonMenuToggle,IonBackButton, IonButtons,
    
    IonItem, IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonTitle, IonToolbar],
  //imports: [IonContent,IonMenu,IonApp,IonRouterOutlet,IonList,IonIcon,IonLabel,IonItem, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LayoutPage implements OnInit {
  menu: string = "Dashboard";
  constructor(private cont: MenuController, private router: Router,private navCtrl: NavController) {
    addIcons({ caretBack });
   }

  ngOnInit() {
    this.cont.enable(true);
  }
  routing(name: any) {
    this.menu = name.charAt(0).toUpperCase() + name.slice(1);
    this.router.navigate(['layout/' + name]);
  }
  goBack() {
  this.navCtrl.back();
}
}
