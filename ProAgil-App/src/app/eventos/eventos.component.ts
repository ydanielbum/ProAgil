import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  _fitroLista: string;
  get filtroLista(): string{
    return this._fitroLista;
  }
  set filtroLista(value: string){
    this._fitroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  eventos: any = [] ;
  eventosFiltrados: any = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  textoBotaoImagem = 'Mostrar Imagem';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): any{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
    this.textoBotaoImagem = this.mostrarImagem ? 'Esconder Imagem' : 'Mostrar Imagem';
  }

  async getEventos(){
    this.http.get('http://localhost:5000/api/values').subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados =  this.eventos;
        console.log(response);
      }, error => {
          console.log(error);
      });
  }

}
