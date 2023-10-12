import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Platform } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { DbDataService } from './db-data.service';
import { AdmiInterface } from '../models/AdmiInterface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  datosAdmi: any = {};
  //slidesPrincipal: [];
  constructor(
    private authService: AuthService,
    private dataApi: DbDataService,
    private platform: Platform,
    //private nativeStorage: NativeStorage
  ) { }

  cargarDatosLogin() {
    const promesa = new Promise<void>( (resolve, reject) => {
      this.consultaDatos();
      resolve();
    });
    return promesa;
  }

 async  consultaDatos() {
    this.authService.isAuth().subscribe(user => {
      if (user) {
        console.log(user);
        this.dataApi.ObtenerUnAdministrador(user.email?user.email:'').subscribe( async  (data) => {
          if (data) {
            if (this.platform.is('capacitor')) {
              // celular
              await Preferences.set({key: 'datosAdmi', value: JSON.stringify(user)}) //this.nativeStorage.setItem('datosAdmi', data) // { property: 'value', anotherProperty: 'anotherValue' }
              .then(
                async () => {
                  this.datosAdmi ==JSON.parse( (await Preferences.get({ key: 'datosAdmi' })).value!)
                }, // console.log('Stored first item!', data),
                (error: any) => alert('error' + JSON.stringify(error)) //  window.alert('Error: ' + error),
              );
            } else {
              // escritorio
              localStorage.setItem('datosAdmi', JSON.stringify(data));
              this.datosAdmi = JSON.parse(localStorage.getItem('datosAdmi')!);
            }
          }
        });
      }
    });
  }


  async cargarDatosAdmiStorage() {
    const promesa = new Promise<void>( async (resolve, reject) => {
      if (this.platform.is('capacitor')) {
        // dispositivo
        this.datosAdmi ==JSON.parse( (await Preferences.get({ key: 'datosAdmi' })).value!)
       
      } else {
        // escritorio
        if ( localStorage.getItem('datosAdmi') ) {
          this.datosAdmi = JSON.parse(localStorage.getItem('datosAdmi')!);
        }
      }
      resolve();
    });
    return promesa;
  }


  async borrarStorage() {
    if (this.platform.is('capacitor')) {
      // celular
     await Preferences.clear()
      .then(
        () => {
          // console.log(data);
          this.datosAdmi =  null;
        },
        (error: any) => console.error(error),
      );
    } else {
      // escritorio
      localStorage.clear();
        this.datosAdmi = null;
    }
  }

  // async guardarSlidesPrincipal(slide:any ) {
  //   console.log(slide);
  //   const promesa = new Promise<void>( async (resolve, reject) => {
  //     if (this.platform.is('cordova')) {
  //       // dispositivo
  //       console.log('guarda:', slide);
  //       await Preferences.set({key: 'slidesPrincipal', value: JSON.stringify(slide)}) // { property: 'value', anotherProperty: 'anotherValue' }
  //       .then(
  //         () => {
  //           console.log('guardado');
            
  //             this.slidesPrincipal = JSON.parse(localStorage.getItem('slidesPrincipal')!)
  //       }, // console.log('Stored first item!', data),
  //         (error:any) => console.error('Error storing item', error) , //  window.alert('Error: ' + error)
  //       );
  //     } else {
  //       // escritorio
  //       localStorage.setItem('slidesPrincipal', JSON.stringify(slide));
  //       this.slidesPrincipal = JSON.parse(localStorage.getItem('slidesPrincipal')!);
  //     }
  //     resolve();
  //   });
  //   return promesa;
  // }

  // async cargarSlidesPrincipal() {
  //   const promesa = new Promise<void>( (resolve, reject) => {
  //     if (this.platform.is('cordova')) {
  //       // dispositivo
  //       this.slidesPrincipal = JSON.parse(localStorage.getItem('slidesPrincipal')!)
  //     } else {
  //       // escritorio
  //       if ( localStorage.getItem('slidesPrincipal') ) {
  //         this.slidesPrincipal = JSON.parse(localStorage.getItem('slidesPrincipal')!);
  //       }
  //     }
  //     resolve();
  //   });
  //   return promesa;
  // }
}
