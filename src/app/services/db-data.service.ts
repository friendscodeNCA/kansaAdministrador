import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { AdmiInterface } from '../models/AdmiInterface';

@Injectable({
  providedIn: 'root'
})
export class DbDataService {

  constructor(private afs: AngularFirestore) { }

    // datos de administrador

    ObtenerUnAdministrador(correo: string) {
      return this.afs.doc(`Roles/${correo}`).snapshotChanges().pipe(map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as AdmiInterface;
          data.id = action.payload.id;
          return data;
        }
      }));
    }
}
