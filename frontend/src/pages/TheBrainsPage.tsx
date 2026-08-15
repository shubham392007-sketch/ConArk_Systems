import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, ArrowRight, Cpu, Database, Microscope } from 'lucide-react';

interface TeamMember {
  id: string;
  index: string;
  name: string;
  role: string;
  shortIntro: string;
  specialization: string;
  email: string;
  color: string; // white, blue, chartreuse, mint
  cardBg: string;
  cardTextColor: string;
  rotationClass: string;
  linkedin: string;
  github: string;
  instagram: string;
  contribution: string;
  motif: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: 'siddhesh',
    index: '01',
    name: 'SIDDHESH BIREWAR',
    role: 'RESEARCH ENGINEER & TECHNICAL SUPPORT SPECIALIST',
    shortIntro: 'Siddhesh contributes to ConArk through research engineering and technical support, helping bridge technical investigation with practical system implementation.',
    specialization: 'RESEARCH / ENGINEERING / TECHNICAL SUPPORT',
    email: 'siddhesh.birewar25@pccoepune.org',
    color: 'white',
    cardBg: '#FFFFFF',
    cardTextColor: '#111111',
    rotationClass: 'card-rotate-neg1',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    instagram: 'https://instagram.com',
    contribution: 'Research and engineering contribution to bridging technical investigation with practical system implementation.',
    motif: ['RESEARCH', 'ANALYZE', 'BUILD', 'SUPPORT']
  },
  {
    id: 'vernit',
    index: '02',
    name: 'VERNIT GARG',
    role: 'RESEARCH SPECIALIST & MACHINE LEARNING ENGINEER',
    shortIntro: "Vernit focuses on research and machine learning, contributing to the predictive intelligence that powers ConArk's construction analytics.",
    specialization: 'RESEARCH / MACHINE LEARNING / PREDICTIVE SYSTEMS',
    email: 'vernit.gerg25@pccoepune.org',
    color: 'blue',
    cardBg: '#4FC3F7',
    cardTextColor: '#111111',
    rotationClass: 'card-rotate-pos1',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    instagram: 'https://instagram.com',
    contribution: "Research and machine learning contribution to ConArk's predictive intelligence layer.",
    motif: ['DATA', 'FEATURES', 'MODEL', 'PREDICTION']
  },
  {
    id: 'shubham',
    index: '03',
    name: 'SHUBHAM POKALE',
    role: 'ARTIFICIAL INTELLIGENCE ENGINEER & TECHNICAL SUPPORT SPECIALIST',
    shortIntro: "Shubham works across artificial intelligence and technical systems, contributing to the engineering layer that connects ConArk's intelligence models with the wider product.",
    specialization: 'ARTIFICIAL INTELLIGENCE / SYSTEMS / TECHNICAL SUPPORT',
    email: 'shubham.pokale25@pccopepune.org',
    color: 'chartreuse',
    cardBg: '#E4FF5B',
    cardTextColor: '#111111',
    rotationClass: 'card-rotate-neg07',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    instagram: 'https://instagram.com',
    contribution: 'Artificial intelligence engineering contribution connecting intelligence models with system execution and technical support.',
    motif: ['AI', 'MODELS', 'SYSTEM', 'DECISION']
  },
  {
    id: 'ram',
    index: '04',
    name: 'RAM KHABALE',
    role: 'DATA ANALYST & DATA ARCHITECT',
    shortIntro: 'Ram contributes to ConArk through data analysis and data architecture, helping organize the information layer required for meaningful construction intelligence.',
    specialization: 'DATA ANALYSIS / DATA ARCHITECTURE / INFORMATION SYSTEMS',
    email: 'ram.khabale25@pccoepune.org',
    color: 'mint',
    cardBg: '#7CFFA6',
    cardTextColor: '#111111',
    rotationClass: 'card-rotate-pos08',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    instagram: 'https://instagram.com',
    contribution: "Data analysis and architecture contribution to ConArk's information and intelligence pipeline.",
    motif: ['DATA', 'STRUCTURE', 'INSIGHT', 'DECISION']
  }
];

const LinkedinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const TheBrainsPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', padding: '24px 24px 64px 24px', boxSizing: 'border-box' }}>
      
      {/* 1. PAGE HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          textAlign: 'center',
          padding: '36px 20px 48px 20px',
          marginBottom: '40px',
          borderBottom: '2.5px dashed #111111'
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#111111',
          color: '#FFFFFF',
          padding: '5px 14px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: '800',
          letterSpacing: '0.08em',
          marginBottom: '20px'
        }}>
          FOUNDING TEAM / 04
        </div>

        <h1 style={{
          fontFamily: 'Anton, sans-serif',
          fontSize: 'clamp(56px, 12vw, 170px)',
          lineHeight: '0.85',
          color: '#111111',
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          margin: '0 auto'
        }}>
          THE BRAINS BEHIND CONARK
        </h1>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '22px',
          fontWeight: '700',
          color: '#111111',
          marginTop: '20px',
          letterSpacing: '0.02em',
          maxWidth: '900px',
          margin: '20px auto 0 auto'
        }}>
          "Four minds. Different disciplines. One construction intelligence system."
        </p>

        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: '#555555',
          lineHeight: '1.6',
          maxWidth: '820px',
          margin: '14px auto 0 auto'
        }}>
          ConArk Systems is built by a multidisciplinary team working across artificial intelligence, machine learning, research, data architecture, and technical systems.
        </p>
      </motion.div>

      {/* 2. TEAM INTRODUCTION STATEMENT */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 48px auto',
        padding: '32px 36px',
        backgroundColor: '#FFFFFF',
        border: '2.5px dashed #111111',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#FF2AA1', marginBottom: '8px' }}>
          EDITORIAL STATEMENT
        </div>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(28px, 4vw, 44px)', color: '#111111', textTransform: 'uppercase', lineHeight: '1.05', margin: 0 }}>
          CONSTRUCTION IS COMPLEX.
        </h2>
        <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(22px, 3vw, 36px)', color: '#555555', textTransform: 'uppercase', lineHeight: '1.1', marginTop: '4px', marginBottom: '16px' }}>
          SO IS BUILDING THE INTELLIGENCE THAT UNDERSTANDS IT.
        </h3>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#333333', lineHeight: '1.6', margin: 0, maxWidth: '980px' }}>
          ConArk Systems brings together distinct technical disciplines—from predictive machine learning and artificial intelligence engineering to data architecture and research support. Rather than presenting a single individual as the entire system, ConArk represents a unified engineering framework engineered collaboratively.
        </p>
      </div>

      {/* 3. TEAM CARD SYSTEM (4 STACKED / ROTATED EDITORIAL CARDS) */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 64px auto', display: 'flex', flexDirection: 'column', gap: '0px' }}>
        {teamMembers.map((member, idx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -8, rotate: 0, transition: { duration: 0.2 } }}
            onClick={() => setSelectedMember(member)}
            className={`${member.rotationClass} card-hover-lift`}
            style={{
              backgroundColor: member.cardBg,
              border: '2.5px dashed #111111',
              borderRadius: '20px',
              padding: '44px 56px',
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.09)',
              position: 'relative',
              marginTop: idx === 0 ? '0px' : '-20px',
              zIndex: 4 - idx,
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
              
              {/* Left Details */}
              <div style={{ flex: '1 1 550px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', fontFamily: 'JetBrains Mono, monospace', color: '#111111', fontWeight: '800' }}>
                    {member.index}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 'bold', backgroundColor: '#111111', color: '#FFFFFF', padding: '3px 10px', borderRadius: '4px' }}>
                    {member.specialization.split(' / ')[0]}
                  </span>
                  <span style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: '#555555' }}>
                    [CLICK TO INSPECT PROFILE →]
                  </span>
                </div>

                <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '52px', color: '#111111', textTransform: 'uppercase', lineHeight: '0.95', margin: '4px 0 8px 0' }}>
                  {member.name}
                </h3>

                <div style={{ fontSize: '15px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', textTransform: 'uppercase', marginBottom: '14px' }}>
                  {member.role}
                </div>

                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: '#222222', lineHeight: '1.55', maxWidth: '750px', margin: '0 0 20px 0', fontWeight: '500' }}>
                  "{member.shortIntro}"
                </p>

                {/* Monospace Specialization Badge */}
                <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', backgroundColor: 'rgba(255,255,255,0.6)', border: '1.5px solid #111111', padding: '6px 14px', borderRadius: '6px', display: 'inline-block' }}>
                  SPECIALIZATION: {member.specialization}
                </div>
              </div>

              {/* Right Technical Motif Diagram */}
              <div style={{ textAlign: 'right', minWidth: '220px' }}>
                <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', marginBottom: '8px' }}>
                  DOMAIN PIPELINE MOTIF
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  {member.motif.map((step, i) => (
                    <React.Fragment key={step}>
                      <span style={{
                        fontSize: '12px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: '800',
                        backgroundColor: '#111111',
                        color: member.id === 'shubham' && step === 'AI' ? '#E4FF5B' : '#FFFFFF',
                        padding: '4px 12px',
                        borderRadius: '4px'
                      }}>
                        {step}
                      </span>
                      {i < member.motif.length - 1 && (
                        <span style={{ fontSize: '12px', color: '#111111', fontWeight: '800', margin: '0 16px' }}>↓</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Social Links Row */}
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700' }}>
                  <a href={member.linkedin} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#111111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <LinkedinIcon /> LINKEDIN →
                  </a>
                  <a href={member.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: '#111111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <GithubIcon /> GITHUB →
                  </a>
                </div>
              </div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* 4. MODAL / PROFILE DETAIL PANEL */}
      <AnimatePresence>
        {selectedMember && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(17, 17, 17, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                maxWidth: '900px',
                backgroundColor: selectedMember.cardBg,
                border: '3px solid #111111',
                borderRadius: '24px',
                padding: '48px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  backgroundColor: '#111111',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                aria-label="Close Profile Panel"
              >
                <X size={20} />
              </button>

              <div style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', marginBottom: '8px' }}>
                FOUNDING PROFILE / {selectedMember.index}
              </div>

              <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '56px', color: '#111111', textTransform: 'uppercase', lineHeight: '0.95', margin: '0 0 10px 0' }}>
                {selectedMember.name}
              </h2>

              <div style={{ fontSize: '18px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', marginBottom: '24px' }}>
                {selectedMember.role}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', textTransform: 'uppercase', marginBottom: '8px' }}>
                    ABOUT
                  </h4>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#222222', lineHeight: '1.6', margin: 0 }}>
                    {selectedMember.shortIntro}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', textTransform: 'uppercase', marginBottom: '8px' }}>
                    SPECIALIZATION
                  </h4>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '700', color: '#111111', margin: 0 }}>
                    {selectedMember.specialization}
                  </p>
                </div>
              </div>

              {/* CONARK CONTRIBUTION SECTION */}
              <div style={{ backgroundColor: 'rgba(255,255,255,0.75)', border: '1.5px solid #111111', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
                <h4 style={{ fontFamily: 'Anton, sans-serif', fontSize: '20px', color: '#111111', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  CONARK SYSTEM CONTRIBUTION
                </h4>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: '#111111', lineHeight: '1.55', margin: 0, fontWeight: '500' }}>
                  "{selectedMember.contribution}"
                </p>
              </div>

              {/* CONTACT & SOCIAL LINKS */}
              <div style={{ borderTop: '2px dashed #111111', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#555555' }}>DIRECT CONTACT</div>
                  <a href={`mailto:${selectedMember.email}`} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '800', color: '#111111', textDecoration: 'underline' }}>
                    {selectedMember.email}
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800' }}>
                  <a href={selectedMember.linkedin} target="_blank" rel="noreferrer" style={{ color: '#111111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>
                    <LinkedinIcon /> LINKEDIN →
                  </a>
                  <a href={selectedMember.github} target="_blank" rel="noreferrer" style={{ color: '#111111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>
                    <GithubIcon /> GITHUB →
                  </a>
                  <a href={selectedMember.instagram} target="_blank" rel="noreferrer" style={{ color: '#111111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>
                    <InstagramIcon /> INSTAGRAM →
                  </a>
                  <a href={`mailto:${selectedMember.email}`} style={{ color: '#111111', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>
                    <Mail size={14} /> MAIL →
                  </a>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. TEAM ARCHITECTURE SECTION */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 64px auto',
        padding: '48px 40px',
        backgroundColor: '#FFFFFF',
        border: '2.5px dashed #111111',
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#FF2AA1', marginBottom: '6px' }}>
            SYSTEM INTEGRATION
          </div>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase', margin: 0 }}>
            FOUR DISCIPLINES. ONE SYSTEM.
          </h2>
        </div>

        {/* Visual Architecture Tree Diagram */}
        <div style={{
          backgroundColor: '#EDECE7',
          border: '2.5px solid #111111',
          borderRadius: '16px',
          padding: '36px',
          fontFamily: 'JetBrains Mono, monospace',
          textAlign: 'center',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'inline-block', backgroundColor: '#111111', color: '#FFFFFF', padding: '10px 24px', borderRadius: '8px', fontSize: '18px', fontWeight: '800' }}>
            CONARK SYSTEMS
          </div>
          
          <div style={{ fontSize: '20px', color: '#111111', fontWeight: '800', margin: '12px 0' }}>│</div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', padding: '12px', borderRadius: '8px', fontWeight: '800' }}>
              <Microscope size={18} style={{ marginBottom: '4px' }} />
              <div>RESEARCH</div>
            </div>
            <div style={{ backgroundColor: '#E4FF5B', border: '1.5px solid #111111', padding: '12px', borderRadius: '8px', fontWeight: '800' }}>
              <Cpu size={18} style={{ marginBottom: '4px' }} />
              <div>AI / ML</div>
            </div>
            <div style={{ backgroundColor: '#7CFFA6', border: '1.5px solid #111111', padding: '12px', borderRadius: '8px', fontWeight: '800' }}>
              <Database size={18} style={{ marginBottom: '4px' }} />
              <div>DATA</div>
            </div>
          </div>

          <div style={{ fontSize: '20px', color: '#111111', fontWeight: '800', margin: '12px 0' }}>↓</div>

          <div style={{ display: 'inline-block', backgroundColor: '#4FC3F7', color: '#111111', border: '1.5px solid #111111', padding: '10px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '800' }}>
            TECHNICAL SYSTEMS LAYER
          </div>

          <div style={{ fontSize: '20px', color: '#111111', fontWeight: '800', margin: '12px 0' }}>↓</div>

          <div style={{ display: 'inline-block', backgroundColor: '#111111', color: '#E4FF5B', padding: '10px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: '800' }}>
            CONARK INTELLIGENCE
          </div>
        </div>

        {/* Member Discipline Mapping */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#666' }}>01</div>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111' }}>SIDDHESH</div>
            <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#555', marginTop: '4px' }}>
              Research + Technical Support
            </div>
          </div>

          <div style={{ backgroundColor: '#4FC3F7', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111' }}>02</div>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111' }}>VERNIT</div>
            <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#111', marginTop: '4px' }}>
              Research + Machine Learning
            </div>
          </div>

          <div style={{ backgroundColor: '#E4FF5B', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111' }}>03</div>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111' }}>SHUBHAM</div>
            <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#111', marginTop: '4px' }}>
              Artificial Intelligence + Technical Support
            </div>
          </div>

          <div style={{ backgroundColor: '#7CFFA6', border: '1.5px solid #111111', borderRadius: '12px', padding: '20px' }}>
            <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111' }}>04</div>
            <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '22px', color: '#111111' }}>RAM</div>
            <div style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '700', color: '#111', marginTop: '4px' }}>
              Data Analysis + Data Architecture
            </div>
          </div>
        </div>
      </div>

      {/* 6. WHAT THEY BUILD TOGETHER (FROM DATA TO DECISION PIPELINE) */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 64px auto',
        padding: '48px 40px',
        backgroundColor: '#FFFFFF',
        border: '2.5px dashed #111111',
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#FF2AA1', marginBottom: '6px' }}>
            END-TO-END PIPELINE
          </div>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: '48px', color: '#111111', textTransform: 'uppercase', margin: 0 }}>
            FROM DATA TO DECISION.
          </h2>
        </div>

        {/* Pipeline Steps Flow */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '36px'
        }}>
          <span style={{ backgroundColor: '#EDECE7', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>SITE DATA</span>
          <span>→</span>
          <span style={{ backgroundColor: '#7CFFA6', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>DATA ARCHITECTURE</span>
          <span>→</span>
          <span style={{ backgroundColor: '#4FC3F7', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>MACHINE LEARNING</span>
          <span>→</span>
          <span style={{ backgroundColor: '#E4FF5B', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>PREDICTIONS</span>
          <span>→</span>
          <span style={{ backgroundColor: '#F5F3E3', border: '1.5px solid #111111', padding: '8px 14px', borderRadius: '6px' }}>OPTIMIZATION</span>
          <span>→</span>
          <span style={{ backgroundColor: '#FF2AA1', color: '#FFFFFF', padding: '8px 14px', borderRadius: '6px' }}>ALERTS</span>
          <span>→</span>
          <span style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '8px 14px', borderRadius: '6px' }}>GEMINI EXPLANATION</span>
          <span>→</span>
          <span style={{ backgroundColor: '#111111', color: '#E4FF5B', padding: '8px 14px', borderRadius: '6px' }}>HUMAN DECISION</span>
        </div>

        {/* Philosophy Principle */}
        <div style={{
          backgroundColor: '#EDECE7',
          border: '2px solid #111111',
          borderRadius: '12px',
          padding: '28px 36px',
          textAlign: 'center'
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: '700', color: '#111111', lineHeight: '1.6', margin: 0 }}>
            "ConArk is designed around a simple principle: ML predicts. Optimization decides. Gemini explains. Humans remain responsible for the final decision."
          </p>
        </div>
      </div>

      {/* 7. TEAM VALUES (4 OVERSIZED EDITORIAL BLOCKS) */}
      <div style={{ maxWidth: '1400px', margin: '0 auto 64px auto' }}>
        <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', fontWeight: '800', color: '#111111', marginBottom: '16px', textAlign: 'center' }}>
          ENGINEERING PHILOSOPHY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '2.5px dashed #111111', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', margin: 0 }}>
              RESEARCH
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Rigorous technical investigation grounding every predictive model.
            </p>
          </div>

          <div style={{ backgroundColor: '#4FC3F7', border: '2.5px dashed #111111', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', margin: 0 }}>
              PRECISION
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#111', marginTop: '8px' }}>
              Exact mathematical SLSQP space solver & ML confidence metrics.
            </p>
          </div>

          <div style={{ backgroundColor: '#E4FF5B', border: '2.5px dashed #111111', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', margin: 0 }}>
              COLLABORATION
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#111', marginTop: '8px' }}>
              Multidisciplinary alignment bridging AI, data, research, and support.
            </p>
          </div>

          <div style={{ backgroundColor: '#7CFFA6', border: '2.5px dashed #111111', borderRadius: '16px', padding: '36px', textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: '44px', color: '#111111', textTransform: 'uppercase', margin: 0 }}>
              BUILD
            </h3>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#111', marginTop: '8px' }}>
              Continuous shipping of functional construction intelligence software.
            </p>
          </div>
        </div>
      </div>

      {/* 8. CONTACT THE TEAM CTA */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 64px auto',
        backgroundColor: '#111111',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '56px 48px',
        textAlign: 'center',
        boxShadow: '0 12px 30px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(36px, 6vw, 64px)', color: '#FFFFFF', textTransform: 'uppercase', margin: 0 }}>
          WANT TO BUILD WITH CONARK?
        </h2>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', color: '#CCCCCC', marginTop: '12px', marginBottom: '32px' }}>
          "Research, engineering, data, and AI come together here."
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <Link to="/" style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '20px',
            backgroundColor: '#E4FF5B',
            color: '#111111',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            EXPLORE CONARK <ArrowRight size={20} />
          </Link>

          <Link to="/predictions" style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '20px',
            backgroundColor: '#4FC3F7',
            color: '#111111',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            VIEW THE SYSTEM <ArrowRight size={20} />
          </Link>

          <a href="mailto:siddhesh.birewar25@pccoepune.org" style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: '20px',
            backgroundColor: '#FFFFFF',
            color: '#111111',
            padding: '14px 28px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            CONTACT THE TEAM <Mail size={20} />
          </a>
        </div>
      </div>

      {/* 9. FINAL BRAND STATEMENT */}
      <div style={{
        textAlign: 'center',
        padding: '32px 20px',
        borderTop: '2.5px dashed #111111',
        marginBottom: '20px'
      }}>
        <div style={{ fontFamily: 'Anton, sans-serif', fontSize: '32px', color: '#111111', letterSpacing: '0.05em', marginBottom: '8px' }}>
          CONARK SYSTEMS
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '800', color: '#555555', letterSpacing: '0.08em', marginBottom: '8px' }}>
          FOUR MINDS. ONE SYSTEM.
        </div>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: '800', color: '#111111', letterSpacing: '0.12em' }}>
          PREDICT. DECIDE. EXPLAIN. ACT.
        </div>
      </div>

    </div>
  );
};
