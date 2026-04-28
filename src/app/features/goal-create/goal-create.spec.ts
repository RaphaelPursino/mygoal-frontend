import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalCreate } from './goal-create';

describe('GoalCreate', () => {
  let component: GoalCreate;
  let fixture: ComponentFixture<GoalCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
