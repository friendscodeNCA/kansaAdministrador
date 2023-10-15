import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { DbDataService } from 'src/app/services/db-data.service';
import { MenuService } from 'src/app/services/menu.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  menuSeleccionado = 'Inicio';
  datosAdmi;
  componentes: Observable<any[]>;
  constructor(private menu: MenuService,
              private authService: AuthService,
              public storage: StorageService,
              private alertController: AlertController) {
                console.log(this.storage.datosAdmi);
                 }

  ngOnInit() {
    this.componentes = this.menu.getMenu();
    console.log('lista del menu', this.componentes);
  }

  menuSelected(page) {
    this.menuSeleccionado = page.name;
  }


  cerrarSesion() {
    this.storage.borrarStorage();
    this.authService.logOut();
  }

  async presentAlertPaway() {
    const alert = await this.alertController.create({
      cssClass: 'paway-alert',
      // header: 'PAWAY TECHNOLOGY',
      // subHeader: 'Aplicación realizada por Paway Perú',
      message: '<img src="../../../../../assets/paway logo.png"><br>www.pawayperu.com<br>+51 910426974',
      mode: 'ios',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

}
