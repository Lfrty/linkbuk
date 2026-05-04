import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { LibroService } from '../core/services/libro.service';
import { Libro } from '../models/Libro.model';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.scss',
})
export class BuscadorComponent implements OnInit, OnDestroy {
  public libroService = inject(LibroService);

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  searchQuery = signal<string>('');
  results = signal<Libro[]>([]);
  showResults = signal(false);

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(async (query) => {
      if (query.length >= 3) {
        const libros = await this.libroService.buscarLibros(query);
        this.results.set(libros);
        this.showResults.set(true);
      } else {
        this.results.set([]);
        this.showResults.set(false);
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchQuery.set(value);
    if (value.length < 3) this.showResults.set(false);
    this.searchSubject.next(value);
  }

  async verDetalle(libro: Libro) {
    // 💡 Aquí es donde ocurre el cambio:
    // Llamaremos al método que crearemos en LibroService para obtener el ID de Laravel
    await this.libroService.obtenerDetalleLibro(libro.work_key);
    
    this.showResults.set(false);
    this.searchQuery.set('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}