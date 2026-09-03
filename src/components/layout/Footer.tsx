import Link from 'next/link';
import { siteConfig } from '@/config/site';

function LinkedinIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.37-2.14 2.94v5.67H9.34V9h3.42v1.48h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.36zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>;
}

function WhatsappIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.57.94.95-3.48-.22-.36a9.38 9.38 0 0 1-1.44-5.04C2.63 6.99 6.9 2.72 12.05 2.72c2.5 0 4.84.97 6.6 2.74a9.3 9.3 0 0 1 2.73 6.6c0 5.15-4.27 9.42-9.34 9.42zM20.52 3.49A11.78 11.78 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.16 1.6 5.97L0 24l6.3-1.65a11.9 11.9 0 0 0 5.74 1.46h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.47-8.38z" /></svg>;
}

export function Footer() {
  return (
    <footer className="nf-footer">
      <div className="nf-footer-inner">
        {/* ── Single-row footer: 7 columns ── */}
        <div className="nf-footer-grid">
          {/* Column 1: Brand */}
          <div className="nf-footer-brand">
            <img src="/assets/logos/NF_Logo_Black_BG.png" alt="NexFrontier" className="nf-footer-logo" />
            <p className="nf-footer-tagline">
              Intelligence for<br />AI-mediated markets.
            </p>
            <div className="nf-footer-mdec">
              <img src="/assets/images/MD_MDEC.png" alt="Malaysia Digital status awarded by MDEC" />
            </div>
          </div>

          {/* Column 2: Explore */}
          <FooterColumn title="Explore" links={[
            { label: 'The Shift', path: '/the-shift' },
            { label: 'Intelligence', path: '/intelligence' },
            { label: 'Enterprise Value', path: '/enterprise-value' },
            { label: 'Reading The Shift', path: '/reading-the-shift' },
            { label: 'Foundation Customers', path: '/foundation-customers' },
            { label: 'Leadership Pulse', path: '/leadership-pulse?source=footer' },
          ]} />

          {/* Column 3: Value */}
          <FooterColumn title="Value" links={[
            { label: 'Quiet Loss™', path: '/enterprise-value/quiet-loss' },
            { label: 'Adaptive Value™', path: '/enterprise-value/adaptive-value' },
            { label: 'Value Translation Framework™', path: '/enterprise-value/value-translation-framework' },
            { label: 'Enterprise Value Calculator', path: '/enterprise-value/calculator' },
            { label: 'ORBIT™', path: '/intelligence/orbit' },
          ]} />

          {/* Column 4: Company */}
          <FooterColumn title="Company" links={[
            { label: 'About', path: '/about' },
            { label: 'Investor', path: '/investor-proof' },
            { label: 'Market Enquiry', path: '/market-enquiry' },
          ]} />

          {/* Column 5: Legal */}
          <FooterColumn title="Legal" links={[
            { label: 'Privacy', path: '/privacy' },
            { label: 'Terms', path: '/terms' },
          ]} />

          {/* Column 6: Malaysia */}
          <div className="nf-footer-col nf-footer-market">
            <span className="nf-eyebrow">Malaysia</span>
            <div className="nf-footer-market-body">
              <span className="nf-footer-company-name">NexFrontier Group Sdn. Bhd.</span>
              <span className="nf-footer-reg">SSM 1673537X-D</span>
              <FooterLink href={`mailto:${siteConfig.contact.malaysia.email}`}>{siteConfig.contact.malaysia.email}</FooterLink>
              <span className="nf-footer-address">
                {siteConfig.contact.malaysia.address.join(', ')}
              </span>
              <FooterLink href={siteConfig.contact.malaysia.whatsapp} external><WhatsappIcon size={14} /> {siteConfig.contact.malaysia.whatsappDisplay}</FooterLink>
              <FooterLink href={siteConfig.contact.malaysia.linkedin} external><LinkedinIcon size={14} /> LinkedIn</FooterLink>
            </div>
          </div>

          {/* Column 7: New Zealand */}
          <div className="nf-footer-col nf-footer-market">
            <span className="nf-eyebrow">New Zealand</span>
            <div className="nf-footer-market-body">
              <span className="nf-footer-company-name">NexFrontier Logic Ltd</span>
              <span className="nf-footer-reg">NZBN 9429053565891</span>
              <FooterLink href={`mailto:${siteConfig.contact.newZealand.email}`}>{siteConfig.contact.newZealand.email}</FooterLink>
              <FooterLink href={siteConfig.contact.newZealand.whatsapp} external><WhatsappIcon size={14} /> {siteConfig.contact.newZealand.whatsappDisplay}</FooterLink>
              <FooterLink href={siteConfig.contact.newZealand.linkedin} external><LinkedinIcon size={14} /> LinkedIn</FooterLink>
            </div>
          </div>
        </div>

        {/* ── Bottom legal strip ── */}
        <div className="nf-footer-legal">
          <span>© 2026 NexFrontier. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; path: string }[] }) {
  return (
    <div className="nf-footer-col">
      <span className="nf-eyebrow">{title}</span>
      {links.map((link) => (
        <Link key={link.path} href={link.path} className="nf-footer-link">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function FooterLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      className="nf-footer-contact-link">
      {children}
    </a>
  );
}
