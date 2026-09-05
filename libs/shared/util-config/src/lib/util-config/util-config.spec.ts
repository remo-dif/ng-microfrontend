import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UtilConfig } from './util-config';

describe('UtilConfig', () => {
  let component: UtilConfig;
  let fixture: ComponentFixture<UtilConfig>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilConfig],
    }).compileComponents();

    fixture = TestBed.createComponent(UtilConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
