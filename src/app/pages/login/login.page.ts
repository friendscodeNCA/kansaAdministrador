import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, MenuController, Platform, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  LoginForm: FormGroup;

  // tslint:disable-next-line:max-line-length
  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  loading: any;
  // token: string;
  constructor(private authService: AuthService,
              // private dataSrv: DbDataService,
              private router: Router,
              public storage: StorageService,
              private menuCtrl: MenuController,
              private loadingController: LoadingController,
              // private fcm: FCM,
              private Pltform: Platform,
              private toastController: ToastController,
              private platform: Platform,
              //private splashScreen: SplashScreen
              ) {
    // this.obtenerfcm();
    this.LoginForm = this.createFormGroup();
   }

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (this.platform.is('cordova')) {
      //this.splashScreen.hide();
    }
  }

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(this.emailPattern)] ),
      password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });
  }

  onResetForm() {
    this.LoginForm.reset();
  }

  get email() { return this.LoginForm.get('email') ; }
  get password() { return this.LoginForm.get('password'); }
  // obtenerfcm(){
  //   console.log('entra a funcion de obtener fcm');
  //   if (this.Pltform.is('cordova')) {
  //      this.fcm.getToken().then( tok => {this.token = tok; })
  //      .catch(err => {});
  //   } else { this.token = 'token laptop'; console.log('token', this.token); }

  // }

  logIn() {
    if (this.LoginForm.valid) {
      this.presentLoading('Iniciando Sesión');
      this.authService.loginEmail(this.LoginForm.value.email, this.LoginForm.value.password)
      .then((res) => {
        console.log(res);
        this.storage.cargarDatosLogin().then(() => {
          // actualizar token
         // this.dataSrv.actualizarToken(this.token, this.LoginForm.value.email);
          this.router.navigate(['/home']);
          this.onResetForm();
          this.menuCtrl.enable(true);
          this.loading.dismiss();
        }, err => {
          this.presentToast('ERROR EN STORAGE' + JSON.stringify(err));
        });
      }, (err => {
        this.presentToast('HAY UN PROBLEMA');
      })).catch((error) => {
        this.presentToast('Error al iniciar sesión');
        this.loading.dismiss();
      });
    } else {
      this.presentToast('Ingrese los datos correctos');
    }
  }

  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentLoading(mensaje: string) {
    this.loading = await this.loadingController.create({
      message: mensaje,
      spinner: 'crescent',
      cssClass: 'loading',
      duration: 5000,
      mode: 'ios'
    });
    await this.loading.present();
  }

}
