import React from 'react';
import { Link } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div style={{
      maxWidth: '460px',
      margin: '60px auto 80px',
      padding: '0 16px',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '2.5px solid #111111',
        borderRadius: '16px',
        padding: '40px 28px',
        boxShadow: '8px 8px 0px #111111'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#E4FF5B',
          border: '2px solid #111111',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '3px 3px 0px #111111'
        }}>
          <MailCheck size={32} color="#111111" />
        </div>

        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: '32px',
          color: '#111111',
          margin: '0 0 12px 0',
          letterSpacing: '0.02em'
        }}>
          VERIFY YOUR EMAIL
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: '#555555',
          lineHeight: '1.5',
          marginBottom: '24px'
        }}>
          We sent a verification link to your registered email address. Click the link in your email to activate your account and access ConArk intelligence workspaces.
        </p>

        <div style={{
          backgroundColor: '#F9F8F5',
          border: '1.5px solid #EEEEEE',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          color: '#666666'
        }}>
          Didn't receive an email? Check your spam folder or sign in to resend.
        </div>

        <Link
          to="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            backgroundColor: '#FF2AA1',
            color: '#FFFFFF',
            border: '2px solid #111111',
            borderRadius: '8px',
            padding: '12px',
            fontFamily: 'Anton, sans-serif',
            fontSize: '16px',
            textDecoration: 'none',
            boxShadow: '4px 4px 0px #111111'
          }}
        >
          RETURN TO LOGIN <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};
