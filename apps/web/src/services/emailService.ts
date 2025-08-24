import { apiClient } from './apiClient';

export interface EmailCapture {
  email: string;
  source?: string;
  campaign?: string;
  referrer?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: Date;
  sentAt?: Date;
  recipients: number;
  opens: number;
  clicks: number;
}

export interface ReferralProgram {
  referrerId: string;
  referredEmail: string;
  status: 'pending' | 'completed' | 'expired';
  reward: string;
  createdAt: Date;
  completedAt?: Date;
}

class EmailService {
  private baseUrl = '/api/email';

  // Capture email for lead generation
  async captureEmail(data: EmailCapture): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/capture`, {
        ...data,
        timestamp: data.timestamp.toISOString()
      });
    } catch (error) {
      console.error('Failed to capture email:', error);
      // Fallback: store in localStorage for retry
      this.storeEmailForRetry(data);
    }
  }

  // Store email locally if API fails
  private storeEmailForRetry(data: EmailCapture): void {
    const pendingEmails = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
    pendingEmails.push(data);
    localStorage.setItem('pendingEmails', JSON.stringify(pendingEmails));
  }

  // Retry failed email captures
  async retryFailedCaptures(): Promise<void> {
    const pendingEmails = JSON.parse(localStorage.getItem('pendingEmails') || '[]');
    if (pendingEmails.length === 0) return;

    const successfulEmails: EmailCapture[] = [];
    
    for (const emailData of pendingEmails) {
      try {
        await this.captureEmail(emailData);
        successfulEmails.push(emailData);
      } catch (error) {
        console.error('Retry failed for email:', emailData.email);
      }
    }

    // Remove successful emails from pending list
    const remainingEmails = pendingEmails.filter(
      (email: EmailCapture) => !successfulEmails.includes(email)
    );
    localStorage.setItem('pendingEmails', JSON.stringify(remainingEmails));
  }

  // Subscribe to newsletter
  async subscribeToNewsletter(email: string, preferences?: string[]): Promise<void> {
    await apiClient.post(`${this.baseUrl}/newsletter/subscribe`, {
      email,
      preferences
    });
  }

  // Unsubscribe from newsletter
  async unsubscribeFromNewsletter(email: string, token: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/newsletter/unsubscribe`, {
      email,
      token
    });
  }

  // Get email campaigns (admin only)
  async getEmailCampaigns(): Promise<EmailCampaign[]> {
    const response = await apiClient.get(`${this.baseUrl}/campaigns`);
    return response.data;
  }

  // Create email campaign (admin only)
  async createEmailCampaign(campaign: Omit<EmailCampaign, 'id' | 'opens' | 'clicks'>): Promise<EmailCampaign> {
    const response = await apiClient.post(`${this.baseUrl}/campaigns`, campaign);
    return response.data;
  }

  // Send email campaign (admin only)
  async sendEmailCampaign(campaignId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/campaigns/${campaignId}/send`);
  }

  // Referral program methods
  async createReferral(referrerId: string, referredEmail: string): Promise<ReferralProgram> {
    const response = await apiClient.post(`${this.baseUrl}/referrals`, {
      referrerId,
      referredEmail
    });
    return response.data;
  }

  async getReferrals(userId: string): Promise<ReferralProgram[]> {
    const response = await apiClient.get(`${this.baseUrl}/referrals/${userId}`);
    return response.data;
  }

  async getReferralStats(userId: string): Promise<{
    totalReferrals: number;
    completedReferrals: number;
    pendingReferrals: number;
    totalRewards: string;
  }> {
    const response = await apiClient.get(`${this.baseUrl}/referrals/${userId}/stats`);
    return response.data;
  }

  // Email templates for different campaigns
  getWelcomeEmailTemplate(userName: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to Claro, ${userName}! 🎉</h1>
        <p>You've just joined thousands of professionals who've simplified their project management.</p>
        <h2>Getting Started</h2>
        <ol>
          <li>Create your first project</li>
          <li>Add some tasks</li>
          <li>Invite your team members</li>
          <li>Start tracking progress</li>
        </ol>
        <p>Need help? Check out our <a href="#">quick start guide</a> or reach out to our support team.</p>
        <p>Happy project managing!</p>
        <p>- The Claro Team</p>
      </div>
    `;
  }

  getOnboardingEmailTemplate(userName: string, step: number): string {
    const steps = [
      {
        title: "Create Your First Project",
        content: "Start by creating a project to organize your work. Give it a clear name and description.",
        action: "Create Project"
      },
      {
        title: "Add Your First Task",
        content: "Break down your project into manageable tasks. Set due dates and priorities.",
        action: "Add Task"
      },
      {
        title: "Invite Your Team",
        content: "Collaborate with your team by inviting them to your project.",
        action: "Invite Team"
      },
      {
        title: "Track Progress",
        content: "Monitor your project progress and celebrate milestones.",
        action: "View Dashboard"
      }
    ];

    const currentStep = steps[step - 1];
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Step ${step}: ${currentStep.title}</h1>
        <p>Hi ${userName},</p>
        <p>${currentStep.content}</p>
        <a href="#" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          ${currentStep.action}
        </a>
        <p>Need help? Reply to this email and we'll guide you through it.</p>
        <p>- The Claro Team</p>
      </div>
    `;
  }

  getReferralEmailTemplate(referrerName: string, referralCode: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>You've Been Invited to Try Claro! 🚀</h1>
        <p>Hi there,</p>
        <p>${referrerName} thinks you'd love Claro - the simple project management tool that actually makes you more productive.</p>
        <h2>What's Claro?</h2>
        <ul>
          <li>Simple, intuitive project management</li>
          <li>Real-time team collaboration</li>
          <li>Mobile and web access</li>
          <li>Free forever plan</li>
        </ul>
        <a href="?ref=${referralCode}" style="background-color: #4A90E2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Start Your Free Trial
        </a>
        <p>When you sign up, you'll both get 1 month of Pro features free!</p>
        <p>- The Claro Team</p>
      </div>
    `;
  }
}

export const emailService = new EmailService(); 