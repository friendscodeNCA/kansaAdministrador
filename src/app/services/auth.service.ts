import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth,
    private router: Router,
    //private fcm: FCM,
    private menuCtrl: MenuController) { }

loginEmail(email:string, password: string) {
return this.auth.signInWithEmailAndPassword(email, password);
}

logOut() {
return this.auth.signOut().then(() => {
// localStorage.removeItem('user');
this.router.navigate(['/login']);
this.menuCtrl.enable(false);
});
}

isAuth() {
return this.auth.authState.pipe(map(auth => auth));
}
}
