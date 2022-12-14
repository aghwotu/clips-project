import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TabComponent } from './tab.component';
import { By } from '@angular/platform-browser';

describe('Tab Component', () => {
  let component: TabComponent;
  let fixture: ComponentFixture<TabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    const element = fixture.debugElement.query(By.css('.hidden'));
    // const element2 = fixture.nativeElement.querySelector('.hidden')
    // const element3 = document.querySelector('.hidden')

    expect(element).toBeTruthy();
  });
});
