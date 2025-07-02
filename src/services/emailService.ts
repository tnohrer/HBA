import { Booking, Hotel, RoomType } from '../types';
import { formatPrice, formatDate, calculateNights } from '../utils';

export interface BookingEmailData {
  booking: Booking;
  hotel: Hotel;
  room: RoomType;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}

// Mock email service - in production this would integrate with SendGrid, AWS SES, etc.
export const EmailService = {
  sendBookingConfirmation: async (emailData: BookingEmailData): Promise<boolean> => {
    console.log('📧 Sending booking confirmation email...');
    
    const {
      booking,
      hotel,
      room,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests
    } = emailData;

    const nights = calculateNights(booking.checkIn, booking.checkOut);
    const totalPrice = formatPrice(booking.totalPrice);
    const checkInFormatted = formatDate(booking.checkIn);
    const checkOutFormatted = formatDate(booking.checkOut);
    
    // Safe booking ID handling
    const bookingId = booking.id ? booking.id.toUpperCase() : `BOOKING-${Date.now()}`;

    // Generate email content
    const emailContent = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏨 BOOKING CONFIRMATION - ${bookingId}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear ${guestName},

Thank you for your booking! Your reservation has been confirmed.

🎉 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Hotel: ${hotel.name}
📍 Location: ${hotel.location}
⭐ Rating: ${hotel.rating}/5 stars

🏠 ROOM DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛏️  Room Type: ${room.name}
👥 Capacity: ${room.capacity} guests
🏷️  Room Rate: ${formatPrice(room.price)} per night

📅 STAY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📆 Check-in: ${checkInFormatted}
📆 Check-out: ${checkOutFormatted}
🌙 Nights: ${nights}
👥 Guests: ${booking.guests}

💰 PRICING BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 Room Rate: ${formatPrice(room.price)} × ${nights} nights
💳 Total Amount: ${totalPrice}
✅ Status: ${booking.status ? booking.status.toUpperCase() : 'CONFIRMED'}

👤 GUEST INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: ${guestEmail}
📱 Phone: ${guestPhone}
${specialRequests ? `📝 Special Requests: ${specialRequests}` : ''}

🏨 HOTEL AMENITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${hotel.amenities.map(amenity => `✅ ${amenity}`).join('\n')}

📞 NEED HELP?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you have any questions or need to modify your reservation, 
please contact us or the hotel directly.

Thank you for choosing ${hotel.name}!
We look forward to welcoming you.

Best regards,
The Hotel Booking Team
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    // 🚨 MOCK IMPLEMENTATION - DOES NOT SEND REAL EMAILS
    // In production, this would make an actual API call to email service
    console.log('\n' + emailContent + '\n');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      console.log('✅ Booking confirmation email sent successfully to:', guestEmail);
      return true;
    } else {
      console.error('❌ Failed to send booking confirmation email');
      return false;
    }

    /* 
    🔧 TO SEND REAL EMAILS, REPLACE ABOVE WITH ONE OF THESE:

    // Option 1: SendGrid
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: guestEmail,
      from: 'noreply@yourhotel.com',
      subject: `Booking Confirmation - ${bookingId}`,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>')
    };
    try {
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }

    // Option 2: AWS SES
    const AWS = require('aws-sdk');
    const ses = new AWS.SES({ region: 'us-east-1' });
    const params = {
      Destination: { ToAddresses: [guestEmail] },
      Message: {
        Body: { Text: { Data: emailContent } },
        Subject: { Data: `Booking Confirmation - ${bookingId}` }
      },
      Source: 'noreply@yourhotel.com'
    };
    try {
      await ses.sendEmail(params).promise();
      return true;
    } catch (error) {
      console.error('AWS SES error:', error);
      return false;
    }

    // Option 3: Nodemailer (SMTP)
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    try {
      await transporter.sendMail({
        from: 'noreply@yourhotel.com',
        to: guestEmail,
        subject: `Booking Confirmation - ${bookingId}`,
        text: emailContent
      });
      return true;
    } catch (error) {
      console.error('Nodemailer error:', error);
      return false;
    }
    */
  },

  // Additional email methods for future use
  sendBookingModification: async (emailData: BookingEmailData): Promise<boolean> => {
    console.log('📧 Sending booking modification email...');
    // Implementation would be similar to confirmation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.05;
  },

  sendBookingCancellation: async (bookingId: string, guestEmail: string): Promise<boolean> => {
    console.log('📧 Sending booking cancellation email to:', guestEmail);
    // Implementation would send cancellation confirmation
    await new Promise(resolve => setTimeout(resolve, 800));
    return Math.random() > 0.05;
  },

  sendBookingReminder: async (emailData: BookingEmailData): Promise<boolean> => {
    console.log('📧 Sending booking reminder email...');
    // Implementation would send check-in reminder
    await new Promise(resolve => setTimeout(resolve, 600));
    return Math.random() > 0.05;
  }
}; 