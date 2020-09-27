import { Component, OnInit } from '@angular/core';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faInstagram,
  faTelegram,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  faEnvelope = faEnvelope;
  faPhone = faPhone;
  faFacebook = faFacebook;
  faInstagram = faInstagram;
  faTelegram = faTelegram;
  faTwitter = faTwitter;
}
