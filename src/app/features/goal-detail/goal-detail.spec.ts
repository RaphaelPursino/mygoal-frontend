import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalDetail } from './goal-detail';

describe('GoalDetail', () => {
  let component: GoalDetail;
  let fixture: ComponentFixture<GoalDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(GoalDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
