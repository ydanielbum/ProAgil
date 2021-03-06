import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale, ptBrLocale } from 'ngx-bootstrap/chronos';
import { ToastrService} from 'ngx-toastr';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  titulo = 'Eventos';
  eventos: Evento[] = [] ;
  eventosFiltrados: Evento[] = [];
  evento: Evento;
  modoEdicao = false;
  bodyDeletarEvento = '';
  tituloEvento = '';
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef;
  registerForm: FormGroup;
  file: File;
  dataAtual: string;


  constructor(
      private eventoService: EventoService
    , private modalService: BsModalService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    ){

      this.localeService.use('pt-br');
  }

  _fitroLista: string;
  get filtroLista(): string{
    return this._fitroLista;
  }
  set filtroLista(value: string){
    this._fitroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  salvarAlteracao(template: any){
    if (this.registerForm.valid){

      if (this.modoEdicao){
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);

        this.uploadImagem();

        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
            this.toastr.success('Editado com Sucesso!');
          }, error  => {
            this.toastr.error(`Erro ao tentar editar: ${error}`);
          }
        );
      }else{
        this.evento = Object.assign({}, this.registerForm.value); 

        this.uploadImagem();


        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento) => {
            template.hide();
            this.getEventos();
            this.toastr.success('Inserido com Sucesso!');
          }, error => {
            this.toastr.error(`Erro ao tentar inserir: ${error}`);
          }
        );
      }
    }
  }

  uploadImagem(){
    const nomeArquivo = this.evento.imagemURL.split('\\', 3);
    this.evento.imagemURL = nomeArquivo[2];

    this.eventoService.postUpload(this.file, nomeArquivo[2]) .subscribe(
      () => {
        this.dataAtual = new Date().getMilliseconds().toString();
        this.getEventos();
      }
    );
  }

  onFileChange(event){
    const reader = new FileReader();

    if (event.target.files && event.target.files.length){
      this.file = event.target.files;
    }
  }

  excluirEvento(template: any, evento: Evento) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}?`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.getEventos();
          this.toastr.success('Deletado com Sucesso!');
        }, error => {

          this.toastr.error(`Erro ao tentar deletar: ${error}`);
        }
    );
  }

  validation(){
    this.registerForm = this.fb.group({
      tema:       ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local:      ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      imagemURL:  ['', Validators.required],
      telefone:   ['', Validators.required],
      email:      ['', [Validators.required, Validators.email]]
    });
  }

  novoEvento(template: any){
    this.openModal(template);
    this.tituloEvento = 'Novo Evento';
  }

  editarEvento(template: any, evento: Evento){
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.evento.imagemURL = '';
    this.modoEdicao = true;
    this.tituloEvento = this.evento.tema;
    this.registerForm.patchValue(this.evento);
  }

  openModal(template: any, eventoId: number = 0){
    this.registerForm.reset();
    template.show(template);
  }

  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[]{
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem(){
    this.mostrarImagem = !this.mostrarImagem;
  }

  async getEventos(){
    this.eventoService.getAllEvento().subscribe(
      (_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados =  this.eventos;
      }, error => {
        this.toastr.error(`Erro ao tentar carregar eventos: ${error}`);
      });
  }

}
