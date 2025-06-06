import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  pins:string = "";
  pin: string[] = ['', '', '', ''];

  correctPin:string[]=['4', '3', '2', '1'];
  isPinShow: boolean = false;
    @ViewChildren('pinBox') pinBoxes!: QueryList<ElementRef>;
  constructor(private faio: FingerprintAIO, private router: Router) { }
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
      localStorage.setItem("token","success");
      this.router.navigate(['layout']);
    }).catch(error => {
      this.isPinShow = true;
      //this.router.navigate(['layout']);
      //this.loginWithBiometrics();
      // console.error('Auth failed', error);
      //alert('Authentication failed');
    });
  }

 onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < this.pin.length - 1) {
      const nextInput = this.pinBoxes.get(index + 1);
      nextInput?.nativeElement.focus();
    }
    this.pin[index] = value;
    if(this.pin[0] == this.correctPin[0] && this.pin[1] == this.correctPin[1] && this.pin[2] == this.correctPin[2] && this.pin[3] == this.correctPin[3]){
      localStorage.setItem("token","success");
      this.router.navigate(['layout']);
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && input.value === '' && index > 0) {
      const prevInput = this.pinBoxes.get(index - 1);
      prevInput?.nativeElement.focus();
    }
  }
}
