import "dotenv/config"
import axios from 'axios';

class EmailService {
  private static readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private static readonly SEND_URL = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';

  private cachedAccessToken: string | null = null;
  private tokenExpiry: number = 0; // Timestamp in milliseconds

  /**
   * Generates or reuses a cached Google OAuth2 access token
   */
  private async getAccessToken(): Promise<string> {
    // Reuse cached token until shortly before it expires (60s buffer)
    if (this.cachedAccessToken && Date.now() < this.tokenExpiry - 60_000) {
      return this.cachedAccessToken;
    }

    const clientId = process.env.GMAIL_CLIENT_ID;
    const clientSecret = process.env.GMAIL_CLIENT_SECRET;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Gmail OAuth2 environment variables (GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN)');
    }

    try {
      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      params.append('refresh_token', refreshToken);
      params.append('grant_type', 'refresh_token');

      const response = await axios.post(EmailService.TOKEN_URL, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10_000,
      });

      const data = response.data;
      if (!data.access_token) {
        throw new Error('No access token returned by Google');
      }

      this.cachedAccessToken = data.access_token;
      const expiresIn = data.expires_in || 3600; // default 1 hour
      this.tokenExpiry = Date.now() + expiresIn * 1000;

      return this.cachedAccessToken!;
    } catch (error: any) {
      const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`Google token error: ${errorMsg}`);
    }
  }

  /**
   * Constructs RFC 5322 compliant raw MIME message
   */
  private buildMime(to: string, subject: string, html: string): string {
    const senderEmail = process.env.GMAIL_SENDER;
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;

    return [
      `From: Task Management App <${senderEmail}>`,
      `To: ${to}`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      html,
    ].join('\r\n');
  }

  /**
   * Sends an email verification or notification code
   */
  public async sendVerification(toEmail: string, token: string): Promise<void> {
    if (!toEmail || toEmail.includes('\r') || toEmail.includes('\n')) {
      throw new Error('Invalid recipient email');
    }

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Task Management App Verification</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
          <h1 style="color: #4F46E5; letter-spacing: 4px; margin: 0; font-size: 32px;">${token}</h1>
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
      </div>
    `;

    const mime = this.buildMime(toEmail, 'Email Verification Code', html);
    
    // Node's base64url encoding automatically handles URL-safe characters and strips padding (=)
    const raw = Buffer.from(mime, 'utf-8').toString('base64url');
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.post(
        EmailService.SEND_URL,
        { raw },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 15_000,
        }
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to send email: Status ${response.status}`);
      }
    } catch (error: any) {
      const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
      throw new Error(`Gmail API Error: ${errorMsg}`);
    }
  }
}

export const emailService = new EmailService();