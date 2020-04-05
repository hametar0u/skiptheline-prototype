from builtins import Exception, str

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def email(to, subject, html):
    message = Mail(
        from_email='admin@skiptheline.digital',
        to_emails=to,
        subject=subject,
        html_content=html)
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return response
    except Exception as e:
        print(str(e))

if __name__ == '__main__':
    email('kevinlu1248@gmail.com',
          'Sending with Twilio SendGrid is Fun',
          '<strong>and easy to do anywhere, even with Python</strong>')