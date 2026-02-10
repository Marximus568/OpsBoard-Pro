import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ButtonComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should render with primary variant by default', () => {
        const button = fixture.nativeElement.querySelector('button');
        expect(button.classList.contains('btn-primary')).toBe(true);
    });

    it('should apply variant class correctly', () => {
        fixture.componentRef.setInput('variant', 'secondary');
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button');
        expect(button.classList.contains('btn-secondary')).toBe(true);
    });

    it('should emit click event when clicked', () => {
        const clickSpy = vi.fn();
        component.btnClick.subscribe(clickSpy);
        const button = fixture.nativeElement.querySelector('button');
        button.click();
        expect(clickSpy).toHaveBeenCalled();
    });

    it('should be disabled when disabled input is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button');
        expect(button.disabled).toBe(true);
    });
});
