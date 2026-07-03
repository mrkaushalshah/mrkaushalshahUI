import { Component } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: false
})
export class FooterComponent {

    constructor(
        private analytics: AnalyticsService
    ) { }

    trackClick(name: string) {
        this.analytics.sendEvent('button_click', {
            button_name: name,
            location: 'Footer Section',
        });
    }
    openEmail(): void {
        this.trackClick('Email Link');
        window.location.href = 'mailto:kaushal@mrkaushalshah.com';
    }

    openLinkedIn(): void {
        this.trackClick('LinkedIn Link');
        window.open('https://linkedin.com/in/mrkaushalshah', '_blank');
    }

    downloadResume(): void {
        this.trackClick('Download Resume Button');
        window.open('https://drive.google.com/file/d/14tGGhlNSUE9oNGNwUumY2STr0jn3r3Qn/view', '_blank');
    }

}
