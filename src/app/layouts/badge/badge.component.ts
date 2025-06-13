import { Component ,ChangeDetectionStrategy, Input} from '@angular/core';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  standalone:true,
  changeDetection: ChangeDetectionStrategy.Default
})
export class BadgeComponent {
@Input() color=''
}
