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
  styles: [
    `
      .header {
        align-items: center;
        background: #111827;
        color: #fff;
        display: flex;
        gap: 2rem;
        padding: 1rem 2rem;
      }
      .brand {
        color: #67e8f9;
        font-size: 1.25rem;
        font-weight: 800;
        text-decoration: none;
      }
      nav {
        display: flex;
        flex: 1;
        gap: 1.25rem;
      }
      a {
        color: #d1d5db;
        text-decoration: none;
      }
      a.active {
        color: #fff;
      }
      button,
      .button {
        background: #06b6d4;
        border: 0;
        border-radius: 0.4rem;
        color: #082f49;
        cursor: pointer;
        font-weight: 700;
        padding: 0.55rem 0.85rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformHeader {
  readonly authenticated = input(false);
  readonly admin = input(false);
  readonly signOut = output<void>();
}
