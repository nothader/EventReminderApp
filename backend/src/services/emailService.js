const nodemailer = require('nodemailer');

// Configure email transport
let transporter;

// Initialize transporter
const initializeTransporter = () => {
  // For production, use actual SMTP credentials
  if (process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // For development, log to console
    transporter = nodemailer.createTransport({
      jsonTransport: true
    });
  }
};

// Send email
exports.sendEmail = async (to, subject, content) => {
  try {
    // Initialize transporter if not already done
    if (!transporter) {
      initializeTransporter();
    }
    
    // Mail options
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@eventreminder.com',
      to,
      subject,
      text: content,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">${subject}</h2>
        <p>${content}</p>
        <hr style="border: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 12px;">
          This is an automated reminder from the Event Reminder App.
        </p>
      </div>`
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    // Log in development
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email sent (development):', info);
    }
    
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// For testing purposes
exports.initializeForTest = (mockTransporter) => {
  transporter = mockTransporter;
}; 