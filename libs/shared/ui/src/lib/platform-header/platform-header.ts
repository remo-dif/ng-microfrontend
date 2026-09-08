import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'lib-platform-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './platform-header.html',
  styleUrl: './platform-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformHeader {
  readonly authenticated = input(false);
  readonly admin = input(false);
  readonly signOut = output<void>();
}
