import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  interval,
  map,
  switchMap,
} from 'rxjs';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { CommentCaseService } from 'src/app/services/comment-case.service';
import { CommentCase } from 'src/app/services/model';
import { DataService } from 'src/app/services/shared/data.service';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';

@Component({
  selector: 'app-view-document',
  templateUrl: './view-document.component.html',
  styleUrls: ['./view-document.component.css'],
})
export class ViewDocumentComponent implements OnInit, OnDestroy {
  idCase: string = '';
  dataCaseProcess: any = [];
  dataCaseLawyer: any = [];
  dataCommentsCase: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado
  tabs: { [key: string]: boolean } = {
    caseLawyer: true,
    commentCase: false,
  };
  addCommentControl = new FormControl('');
  isCommentNew: boolean = false; // Manejar el boton que permite agregar nuevo comentario
  timeActual: string = this.time.getTime().slice(0, -3); // Obtener fecha, hora y minuto
  private interval_id: any;
  edit: boolean = false; // ¿Actualizar?
  editCommentControl = new FormControl(''); // Input para editar comentario
  positionCommentEdit: number = -1; // Obtener la posición del comentario que se va editar
  private interval_idComment: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private caseService: CaseProcessService,
    private dataService: DataService,
    private router: Router,
    private commentsService: CommentCaseService,
    private time: TimeActualService,
    private auth: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idCase = params.get('id') || '';
      this.caseProcess();
      this.caseLawyer();
      this.commentsCase();
    });
    this.heightInfo();

    this.addCommentControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map((comment) => {
          this.isCommentNew = !!comment; // Habilitar / Deshabilitar boton de crear comentario
        })
      )
      .subscribe();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
    });

    // Dejar de actulizar los comentarios, cuando se va a editar uno
    if (!this.edit) {
      this.activateInterval();
    }

    this.interval_id = setInterval(() => {
      this.timeActual = this.time.getTime().slice(0, -3);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.interval_id) clearInterval(this.interval_id);
    if (this.interval_idComment) this.deactivateInterval();
  }
  // Obtener información caso
  caseProcess() {
    this.caseService.getCaseProcessById(parseInt(this.idCase)).subscribe(
      (rs) => (this.dataCaseProcess = rs),
      (err) => console.log(err)
    );
  }
  // Obtener los abogados asignados al caso
  caseLawyer() {
    this.caseService.getCaseLawyerByIdCase(parseInt(this.idCase)).subscribe(
      (rs) => (this.dataCaseLawyer = rs),
      (err) => console.log(err)
    );
  }
  // Obtener comentarios del caso
  commentsCase() {
    this.commentsService.getCommentsCaseById(this.idCase).subscribe(
      (rs) => (this.dataCommentsCase = rs),
      (err) => console.log(err)
    );
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 140}px`;
  }
  // Redirigir a editar caso
  editCase() {
    this.router.navigate(['edit-case', this.dataCaseProcess.idCase]);
  }

  // Cambiar tabs
  changeTab(tab: string) {
    for (let key in this.tabs) {
      this.tabs[key] = false;
    }
    this.tabs[tab] = true;
  }

  // ---- Metodos para los comentarios ----

  // Crear / Actualizar Comentario
  saveComment(idComment?: string) {
    let comment: CommentCase = {
      idComment: this.edit ? idComment : undefined,
      description: this.edit
        ? this.editCommentControl.value
        : this.addCommentControl.value,
      dateRegister: this.edit ? undefined : this.time.getTime(),
      lastUpdate: this.time.getTime(),
      idCase: this.edit ? undefined : this.idCase,
      idUser: this.edit ? undefined : this.auth.getIdUser(),
    };

    this.commentsService
      .saveComment(comment, this.edit, idComment || '')
      .subscribe(
        (rs) => {
          if (rs.success) {
            let message = this.edit ? 'actualizo' : 'registro';
            this.dataService.changeMessage(
              true,
              `Se ${message} el comentario con exito.`
            );
            if (this.edit) {
              this.edit = false;
              this.positionCommentEdit = -1;
              this.activateInterval();
            }
            // Se recarga la lista con los comentarios
            this.commentsService.getCommentsCaseById(this.idCase).subscribe(
              (rs1) => (this.dataCommentsCase = rs1),
              (err) => console.log(err)
            );
          } else {
            console.log(rs.message);
          }
        },
        (err) => console.log('Hubo un error' + err)
      );
  }

  // Marcar / Desmarcar como importante comentario
  importanceComment(id: string, important: boolean) {
    let comment: CommentCase = {
      lastUpdate: this.time.getTime(),
    };

    this.commentsService.changeImportance(id, comment).subscribe(
      (rs) => {
        if (rs.success) {
          let importance = important ? 'desmarco' : 'marco';
          this.dataService.changeMessage(
            true,
            `Se ${importance} como importante el comentario.`
          );
          // Recargar lista con los comentarios
          this.commentsService.getCommentsCaseById(this.idCase).subscribe(
            (rs1) => (this.dataCommentsCase = rs1),
            (err) => console.log(err)
          );
        } else {
          console.log(rs.message);
        }
      },
      (err) =>
        console.log(
          'Hubo un error al cambiar la importancia del comentario' + err
        )
    );
  }
  // Eliminar comentarios
  deleteComment(id: string) {
    this.commentsService.deleteComment(id).subscribe(
      (rs) => {
        if (rs.success) {
          this.dataService.changeMessage(
            true,
            'Se elimino el comentario con exito.'
          );
          // Recargar lista de comentarios
          this.commentsService.getCommentsCaseById(this.idCase).subscribe(
            (rs1) => (this.dataCommentsCase = rs1),
            (err) => console.log(err)
          );
        } else {
          console.log(rs.message);
        }
      },
      (err) => console.log('Hubo un error al eliminar el comentario' + err)
    );
  }

  // Activar Intervalo Comentario
  activateInterval() {
    this.interval_idComment = interval(5000) // Cada 5 segundos se obtienen todos los comentarios
      .pipe(
        switchMap(() => this.commentsService.getCommentsCaseById(this.idCase))
      )
      .subscribe((rs) => {
        this.dataCommentsCase = rs;
      });
  }

  // Desactivar Intervalo Comentario
  deactivateInterval() {
    if (this.interval_idComment) {
      this.interval_idComment.unsubscribe();
      this.interval_idComment = null;
    }
  }

  // Activar modo editar y agregar el input para modificar comentario
  showEditComment(i: number, comment: string) {
    if (!this.edit) {
      this.edit = true;
      this.positionCommentEdit = i;
      this.editCommentControl.setValue(comment);
      this.deactivateInterval();
    }
  }
}
