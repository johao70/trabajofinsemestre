import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  table_header: any
  pedidosForm: FormGroup
  detallepedidosForm: FormGroup

  constructor(private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit() {
    this.formularioPedidos()
    this.formularioDetallePedidos()

    this.getDataPedidos()
    this.getDataProveedores()
    this.getDataMateriales()

    this.table_header = [
      {
        id: 'N°',
        idproveedor: 'Proveedor',
        fecha: 'Fecha del Pedido',
        total: 'Total'
      }
    ]

  }

  formularioPedidos(){
    this.pedidosForm = this.formBuilder.group({
      id: [''],
      idproveedor: ['',[Validators.required]],
      fecha: [''],
      total: ['',[Validators.required]],
    });
  }

  formularioDetallePedidos(){
    this.detallepedidosForm = this.formBuilder.group({
      id: [''],
      nombre: ['',[Validators.required]],
      cantidad: ['',[Validators.required]],
      precio: ['',[Validators.required]],
      idpedido: ['',[Validators.required]],
      idmaterial: ['',[Validators.required]],
    });
  }

  //PAGINA PRINCIPAL
  respuestaOrdenes: any[]

  getDataPedidos = () => {
    let tabla = 'pedido'
    this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
    .subscribe(data => {
        this.respuestaOrdenes = data.datos
    })
  }

  idPedidoVariable: number

  getDatabyID = (value) => {
    let tabla = 'pedido'
    this.http.get<any>(environment.API_URL + `byid?tabla=${tabla}&&id=${value}`)
    .subscribe( data => { 
      this.idPedidoVariable = data.datos[0].id
      localStorage.setItem("id", this.idPedidoVariable.toString() )
    })
  }

  deleteDataTable = (value) => {
    let tabla = 'pedido'
    this.http.delete(environment.API_URL + `?tabla=${tabla}&&id=${value}`)
    .subscribe( data => { })
    window.location.reload()
  }
  //PAGINA PRINCIPAL


  //MODAL NEW PEDIDO
  respuestaProveedores: any[]

  getDataProveedores = () => {
    let tabla = 'proveedor'
    this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
    .subscribe(data => {
        this.respuestaProveedores = data.datos
    })
  }
  
  nuevafecha = new Date()
  fecha_orden = this.nuevafecha.getDate() + "/" + (this.nuevafecha.getMonth() +1) + "/" + this.nuevafecha.getFullYear()

  postDataPedidos = () => {
    let id
    let idproveedor = this.pedidosForm.get('idproveedor').value
    let total = this.pedidosForm.get('total').value

    let tabla = 'pedido'
    let register = {tabla: tabla, datos: [{id: id, fecha: this.fecha_orden, idproveedor: idproveedor, total: total}]}
    this.http.post(environment.API_URL, register)
    .subscribe( data => {
      // this.postData = data
    })
    window.location.reload()
  }
  //MODAL NEW PEDIDO

  //MODAL DETALLE PEDIDO 
  respuestaMateriales: any[]

  getDataMateriales = () => {
    let tabla = 'material'
    this.http.get<any>(environment.API_URL + `?tabla=${tabla}`)
    .subscribe(data => {
        this.respuestaMateriales = data.datos
    })
  }
  

  postDataDetallePedidos = () => {
    let nombre = this.detallepedidosForm.get('nombre').value
    let cantidad = this.detallepedidosForm.get('cantidad').value
    let precio = this.detallepedidosForm.get('precio').value
    let idmaterial = this.detallepedidosForm.get('idmaterial').value

    let tabla = 'detalle_pedido'
    let register = {tabla: tabla, datos: [{nombre: nombre, cantidad: cantidad, precio: precio, idpedido: this.idPedidoVariable, idmaterial: idmaterial}]}
    this.http.post(environment.API_URL, register)
    .subscribe( data => {
      // this.postData = data
    })
    window.location.reload()
  }
  //MODAL DETALLE PEDIDO
}
