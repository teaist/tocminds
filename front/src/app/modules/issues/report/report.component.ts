import { Component, OnInit } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Router } from '@angular/router';
import { FormToastService } from '../../../common/services/form-toast.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  submiting = false;
  error = '';

  fields: any = {
    title: {
      label: 'Title',
      type: 'text',
      validation: {
        required: true,
      },
    },
    env: {
      label: 'Browser and OS',
      type: 'text',
      validation: {
        required: true,
      },
    },
    description: {
      label: 'Description',
      value: '',
      type: 'textarea',
      validation: {
        required: true,
      },
    },
    steps: {
      label: 'Steps to reproduce',
      value: '',
      type: 'textarea',
      validation: {
        required: true,
      },
    },
  };

  constructor(
    private client: Client,
    private router: Router,
    protected toasterService: FormToastService
  ) {}

  ngOnInit() {}

  async submit(dform: any) {
    this.error = '';

    // mark as touched to show validation
    if (dform.form.controls) {
      for (let i in dform.form.controls) {
        if (dform.form.controls.hasOwnProperty(i)) {
          dform.form.controls[i].markAsTouched();
        }
      }
    }
    if (!dform.form.valid) {
      return;
    }

    this.submiting = true;

    const formValues = dform.getValues();
    const description = `### Summary:\n\n${formValues.description}\n\n### Steps to reproduce:\n\n${formValues.steps}\n\n### Browser and OS\n\n${formValues.env}`;
    const body = { title: formValues.title, description, labels: 'by user' };

    try {
      const result: any = await this.client.post('api/v2/issues/front', body);
      this.toasterService.error(`Issue #${result.iid} submitted successfully.`);
      this.router.navigate(['/help']);
    } catch (err) {
      console.log(err);
      this.toasterService.error('Oops! Something went wrong. Please try again');
    } finally {
      this.submiting = false;
    }
  }
}
