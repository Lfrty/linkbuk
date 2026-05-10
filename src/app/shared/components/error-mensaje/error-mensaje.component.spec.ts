import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMensajeComponent } from './error-mensaje.component';

describe('ErrorMensajeComponent', () => {
  let component: ErrorMensajeComponent;
  let fixture: ComponentFixture<ErrorMensajeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMensajeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMensajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
