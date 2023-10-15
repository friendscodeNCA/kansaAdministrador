import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { AdmiInterface } from '../models/AdmiInterface';
import { categoriaInterface } from '../models/CategoriaInterface';
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
    //obtener categorias
  obtenerCategorias() {
    return this.afs.collection('categorias', ref => ref.orderBy('fechaRegistro', 'desc'))
    .snapshotChanges().pipe(map(changes => {
      const datos: categoriaInterface[] = [];

      changes.map((action: any) => {
        datos.push({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        });
      });

      return datos;
    }));
  }

  //obtener subcategorias
  obtenerSubCategorias(idCategoria: string) {
    return this.afs.collection('subcategorias', ref => ref.where('idCategoria', '==', idCategoria).orderBy('fechaRegistro', 'desc'))
    .snapshotChanges().pipe(map(changes => {
      const datos: categoriaInterface[] = [];

      changes.map((action: any) => {
        datos.push({
          id: action.payload.doc.id,
          ...action.payload.doc.data()
        });
      });

      return datos;
    }));
  }
  //guardar categoria

  guardarCategoria(newCategoria: categoriaInterface) {
    newCategoria.fechaRegistro = new Date();
    return this.afs.collection('categorias').add(newCategoria).then( data=> {
        if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }

    }).catch(err => err);
  }
  guardarSubCategoria(newSubCategoria: categoriaInterface, id: string) {
    newSubCategoria.idCategoria = id;
    newSubCategoria.fechaRegistro = new Date();
    return this.afs.collection('subcategorias').add(newSubCategoria).then(data => {
      if (data.id) {
        return data.id;
      } else {
        return 'fail';
      }
    })
  }

}
