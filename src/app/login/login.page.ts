import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
     providers: [
    FingerprintAIO
  ],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  constructor(private faio: FingerprintAIO,private router: Router) {}
    ngOnInit(): void {
      this.loginWithBiometrics();
    }
    loginWithBiometrics() {
      this.faio.show({
        title: 'Biometric Auth',
        subtitle: 'Authenticate to continue',
        description: 'Use fingerprint',
        disableBackup: true,
      }).then(() => {
        this.router.navigate(['layout']);
      }).catch(error => {
        this.router.navigate(['layout']);
         //this.loginWithBiometrics();
        // console.error('Auth failed', error);
        //alert('Authentication failed');
      });
    }

}
