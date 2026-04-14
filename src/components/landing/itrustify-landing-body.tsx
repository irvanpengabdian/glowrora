"use client";

/* eslint-disable react/no-unescaped-entities -- testimonial copy uses straight quotes like the source HTML */
/* eslint-disable @next/next/no-html-link-for-pages -- <a> keeps landing CSS selectors and matches the static mock */

type BodyProps = {
  toggleFaq: (el: HTMLElement) => void;
};

export function ItrustifyLandingBody({ toggleFaq }: BodyProps) {
  return (
    <>
<section className="hero">
  <div className="hero-bg-circle hero-bg-circle-1"></div>
  <div className="hero-bg-circle hero-bg-circle-2"></div>
  <div className="hero-badge">
    <span className="hero-badge-dot"></span>
    <span data-lang="id">Cara termudah membangun kepercayaan secara digital</span>
    <span data-lang="en">The easiest way to build trust digitally</span>
  </div>
  <h1 data-lang="id">Kepercayaan Publik<br />Dimulai dari Testimoni Autentik</h1>
  <h1 data-lang="en">Public Trust Starts with<br />Authentic Testimonials</h1>
  <p className="hero-sub" data-lang="id">Glowrora membantu kamu mengumpulkan teks &amp; video testimonial dari klien dalam hitungan menit — lalu tampilkan sebagai social proof elegan di website manapun.</p>
  <p className="hero-sub" data-lang="en">Glowrora helps you collect text &amp; video testimonials from clients in minutes — then display them as elegant social proof on any website.</p>
  <div className="hero-cta-row">
    <a href="/sign-up" className="btn-primary" data-lang="id"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Coba Gratis 14 Hari</a>
    <a href="/sign-up" className="btn-primary" data-lang="en"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Try Free for 14 Days</a>
    <a href="#how" className="btn-secondary" data-lang="id"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 5.5L9.5 7L5.5 8.5" fill="currentColor"/></svg>Lihat Demo</a>
    <a href="#how" className="btn-secondary" data-lang="en"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 5.5L9.5 7L5.5 8.5" fill="currentColor"/></svg>Watch Demo</a>
  </div>
  <p className="hero-trust-note">
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.2L11 4.7L8.5 7.1L9.1 10.5L6 8.9L2.9 10.5L3.5 7.1L1 4.7L4.5 4.2L6 1Z" stroke="#C4BFB3" strokeWidth="1" fill="none"/></svg>
    <span data-lang="id">Tidak perlu kartu kredit · Setup 5 menit · Batalkan kapan saja</span>
    <span data-lang="en">No credit card required · 5-minute setup · Cancel anytime</span>
  </p>
  <div className="hero-visual">
    <div className="floating-badge floating-badge-1">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 4" stroke="#4DE0B0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span data-lang="id" style={{"fontSize":"12px"}}>Testimonial diterima ✦ 2 detik lalu</span>
      <span data-lang="en" style={{"fontSize":"12px"}}>Testimonial received ✦ 2 seconds ago</span>
    </div>
    <div className="hero-mockup-wrapper">
      <div className="mockup-header">
        <div className="mockup-dot" style={{"background":"#FF5F57"}}></div>
        <div className="mockup-dot" style={{"background":"#FEBC2E"}}></div>
        <div className="mockup-dot" style={{"background":"#28C840"}}></div>
        <div style={{"marginLeft":"12px","fontSize":"11px","color":"rgba(110,154,176,.6)"}}>Glowrora dashboard · Wall of Love</div>
      </div>
      <div className="mockup-grid">
        <div className="m-card">
          <div className="m-card-stars">★★★★★</div>
          <p className="m-card-text" data-lang="id">"Conversion rate naik 34% setelah pasang widget Glowrora. Klien langsung percaya tanpa banyak penjelasan."</p>
          <p className="m-card-text" data-lang="en">"Conversion rate jumped 34% after adding Glowrora. Clients trust us instantly, no lengthy explanations needed."</p>
          <div className="m-card-user">
            <div className="m-avatar" style={{"background":"rgba(77,224,176,.2)","color":"#4DE0B0"}}>RA</div>
            <div><div className="m-avatar-name">Raka Aditya</div><div className="m-avatar-role">Founder, Launchly</div></div>
            <span className="m-verified">✓ Verified</span>
          </div>
        </div>
        <div className="m-card">
          <div className="m-card-stars">★★★★★</div>
          <p className="m-card-text" data-lang="id">"Akhirnya ada platform yang nggak paksa klien daftar dulu. Response rate kita 3x lebih tinggi."</p>
          <p className="m-card-text" data-lang="en">"Finally a platform that doesn't force clients to register. Our response rate is 3x higher now."</p>
          <div className="m-card-user">
            <div className="m-avatar" style={{"background":"rgba(245,158,11,.2)","color":"#F59E0B"}}>SD</div>
            <div><div className="m-avatar-name">Sari Dewi</div><div className="m-avatar-role">CEO, Kreativa Agency</div></div>
            <span className="m-verified">✓ Verified</span>
          </div>
        </div>
        <div className="m-video-card">
          <div className="m-video-thumb"><div className="m-play"><div className="m-play-triangle"></div></div></div>
          <div className="m-video-info">
            <div style={{"fontSize":"10px","color":"rgba(110,154,176,.8)","marginBottom":"4px"}}>Video · 0:47</div>
            <div style={{"fontSize":"11px","fontWeight":"600","color":"#E8F0F5"}}>Bimo Prakoso</div>
            <div style={{"fontSize":"10px","color":"rgba(110,154,176,.7)"}}>SaaS Founder</div>
            <span style={{"display":"inline-block","marginTop":"6px","background":"rgba(77,224,176,.15)","color":"#4DE0B0","fontSize":"9px","fontWeight":"600","padding":"2px 8px","borderRadius":"20px"}}>Video</span>
          </div>
        </div>
      </div>
    </div>
    <div className="floating-badge floating-badge-2">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#4DE0B0" strokeWidth="1"/><path d="M4 6L5.5 7.5L8.5 4.5" stroke="#4DE0B0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      <span data-lang="id" style={{"fontSize":"11px"}}>1 baris embed code. Selesai.</span>
      <span data-lang="en" style={{"fontSize":"11px"}}>1 line of embed code. Done.</span>
    </div>
  </div>
</section>


<div className="logo-strip">
  <p className="logo-strip-label" data-lang="id">Dipercaya oleh solopreneur, agensi, dan SaaS founder</p>
  <p className="logo-strip-label" data-lang="en">Trusted by solopreneurs, agencies, and SaaS founders</p>
  <div className="logo-strip-row">
    <span className="logo-item">Storekita</span><span className="logo-item">Kreativa</span><span className="logo-item">NovaSaaS</span>
    <span className="logo-item">Launchly</span><span className="logo-item">Digimatch</span><span className="logo-item">PixelMorph</span>
  </div>
</div>


<section className="problem" id="problem">
  <div className="container">
    <div className="reveal">
      <div className="section-eyebrow"><span className="section-eyebrow-line"></span><span data-lang="id">Masalah nyata</span><span data-lang="en">The real problem</span></div>
      <h2 className="section-title" data-lang="id">Kamu tahu klienmu puas.<br />Tapi buktinya <em>di mana?</em></h2>
      <h2 className="section-title" data-lang="en">You know your clients are happy.<br />But where's the <em>proof?</em></h2>
    </div>
    <div className="problem-grid">
      <div className="problem-pains">
        <div className="pain-item reveal">
          <div className="pain-icon">😓</div>
          <div>
            <div className="pain-title" data-lang="id">Klien malas registrasi</div>
            <div className="pain-title" data-lang="en">Clients hate signing up</div>
            <div className="pain-desc" data-lang="id">Platform lain memaksa klien buat akun dulu. Hasilnya? Mayoritas menyerah sebelum selesai.</div>
            <div className="pain-desc" data-lang="en">Other platforms force account creation before a review. The result? Most give up before finishing.</div>
          </div>
        </div>
        <div className="pain-item reveal reveal-delay-1">
          <div className="pain-icon">📁</div>
          <div>
            <div className="pain-title" data-lang="id">Tersimpan di chat, bukan website</div>
            <div className="pain-title" data-lang="en">Buried in chats, not on your site</div>
            <div className="pain-desc" data-lang="id">Testimonial tersebar di WhatsApp, email, DM Instagram. Calon klien baru tidak melihatnya.</div>
            <div className="pain-desc" data-lang="en">Testimonials are scattered across WhatsApp, email, and DMs. New prospects never see them.</div>
          </div>
        </div>
        <div className="pain-item reveal reveal-delay-2">
          <div className="pain-icon">🛠️</div>
          <div>
            <div className="pain-title" data-lang="id">Widget testimonial terlalu rumit</div>
            <div className="pain-title" data-lang="en">Testimonial widgets are too complex</div>
            <div className="pain-desc" data-lang="id">Butuh developer, CSS custom, berhari-hari. Kamu harusnya fokus menjual, bukan debugging.</div>
            <div className="pain-desc" data-lang="en">You need a developer, custom CSS, and days of work. You should be closing deals, not debugging.</div>
          </div>
        </div>
      </div>
      <div className="problem-quote reveal reveal-delay-1">
        <p className="problem-quote-text" data-lang="id">"Saya punya puluhan pelanggan yang puas. Tapi setiap kali minta testimonial, ujungnya cuma janji. Platform lain terlalu ribet buat mereka."</p>
        <p className="problem-quote-text" data-lang="en">"I had dozens of happy customers. But every time I asked for a testimonial, it ended with empty promises. Other platforms were just too complicated for them."</p>
        <div className="problem-quote-author">
          <div className="pq-avatar">BW</div>
          <div>
            <div className="pq-name">Bayu Wibisono</div>
            <div className="pq-role" data-lang="id">Founder SaaS, pengguna Glowrora</div>
            <div className="pq-role" data-lang="en">SaaS Founder, Glowrora user</div>
          </div>
        </div>
        <div style={{"marginTop":"28px","paddingTop":"24px","borderTop":".5px solid rgba(255,255,255,.08)"}}>
          <div style={{"fontSize":"11px","color":"rgba(110,154,176,.7)","marginBottom":"12px","letterSpacing":".06em","textTransform":"uppercase","fontWeight":"500"}} data-lang="id">Hasilnya setelah pakai Glowrora</div>
          <div style={{"fontSize":"11px","color":"rgba(110,154,176,.7)","marginBottom":"12px","letterSpacing":".06em","textTransform":"uppercase","fontWeight":"500"}} data-lang="en">Results after using Glowrora</div>
          <div style={{"display":"flex","gap":"24px"}}>
            <div><div style={{"fontSize":"28px","fontWeight":"600","color":"#4DE0B0","letterSpacing":"-.04em"}}>3×</div><div style={{"fontSize":"11px","color":"rgba(110,154,176,.8)"}}>Response rate</div></div>
            <div><div style={{"fontSize":"28px","fontWeight":"600","color":"#4DE0B0","letterSpacing":"-.04em"}}>5 min</div><div style={{"fontSize":"11px","color":"rgba(110,154,176,.8)"}} data-lang="id">Setup pertama</div><div style={{"fontSize":"11px","color":"rgba(110,154,176,.8)"}} data-lang="en">First setup</div></div>
            <div><div style={{"fontSize":"28px","fontWeight":"600","color":"#4DE0B0","letterSpacing":"-.04em"}}>+28%</div><div style={{"fontSize":"11px","color":"rgba(110,154,176,.8)"}} data-lang="id">Konversi landing page</div><div style={{"fontSize":"11px","color":"rgba(110,154,176,.8)"}} data-lang="en">Landing page conversion</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section className="how" id="how">
  <div className="container">
    <div className="reveal" style={{"textAlign":"center"}}>
      <div className="section-eyebrow" style={{"justifyContent":"center"}}><span className="section-eyebrow-line"></span><span data-lang="id">Cara kerja</span><span data-lang="en">How it works</span><span className="section-eyebrow-line"></span></div>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="id">Tiga langkah.<br /><em>Selesai sebelum kopi dingin.</em></h2>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="en">Three steps.<br /><em>Done before your coffee cools.</em></h2>
      <p className="section-desc" style={{"margin":"0 auto","textAlign":"center"}} data-lang="id">Tidak ada hambatan. Bagikan link, terima testimoni, pasang di website.</p>
      <p className="section-desc" style={{"margin":"0 auto","textAlign":"center"}} data-lang="en">No barriers. Share a link, collect testimonials, embed on your site.</p>
    </div>
    <div className="how-steps">
      <div className="how-step reveal">
        <div className="step-number">1</div>
        <div className="step-title" data-lang="id">Buat &amp; bagikan link</div>
        <div className="step-title" data-lang="en">Create &amp; share your link</div>
        <p className="step-desc" data-lang="id">Generate link unik untuk bisnismu dalam 30 detik. Kirim ke klien via WhatsApp, email, atau QR code — mereka tidak perlu daftar apapun.</p>
        <p className="step-desc" data-lang="en">Generate a unique link in 30 seconds. Send it via WhatsApp, email, or QR code — no sign-up required for your clients.</p>
        <span className="step-tag" data-lang="id">30 detik setup</span><span className="step-tag" data-lang="en">30-second setup</span>
      </div>
      <div className="how-step reveal reveal-delay-1">
        <div className="step-number">2</div>
        <div className="step-title" data-lang="id">Klien kirim testimoni</div>
        <div className="step-title" data-lang="en">Clients submit their review</div>
        <p className="step-desc" data-lang="id">Klien tinggal buka link, ketik atau rekam video langsung dari browser. Tidak ada app download, tidak ada password.</p>
        <p className="step-desc" data-lang="en">Clients open the link, type or record a video directly in browser. No app download, no password, no friction.</p>
        <span className="step-tag">Zero friction</span>
      </div>
      <div className="how-step reveal reveal-delay-2">
        <div className="step-number">3</div>
        <div className="step-title" data-lang="id">Tampilkan di website</div>
        <div className="step-title" data-lang="en">Display on your website</div>
        <p className="step-desc" data-lang="id">Pilih template widget elegan, copy satu baris embed code, paste ke website manapun. Tampil real-time.</p>
        <p className="step-desc" data-lang="en">Pick an elegant widget template, copy one embed line, paste it anywhere. Testimonials appear in real-time.</p>
        <span className="step-tag" data-lang="id">1 baris kode</span><span className="step-tag" data-lang="en">1 line of code</span>
      </div>
    </div>
  </div>
</section>


<section className="features" id="features">
  <div className="container">
    <div className="reveal">
      <div className="section-eyebrow"><span className="section-eyebrow-line"></span><span data-lang="id">Fitur unggulan</span><span data-lang="en">Key features</span></div>
      <h2 className="section-title" data-lang="id">Semua yang kamu butuhkan.<br /><em>Tidak lebih, tidak kurang.</em></h2>
      <h2 className="section-title" data-lang="en">Everything you need.<br /><em>Nothing you don't.</em></h2>
      <p className="section-desc" data-lang="id">Dibangun untuk solopreneur, SaaS founder, dan agensi yang menghargai waktu.</p>
      <p className="section-desc" data-lang="en">Built for solopreneurs, SaaS founders, and agencies who value their time.</p>
    </div>
    <div className="features-grid">
      <div className="feature-card reveal">
        <div className="feature-icon feature-icon-navy"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L12.2 7.3L18 8L13.5 12.1L14.9 18L10 15.1L5.1 18L6.5 12.1L2 8L7.8 7.3L10 2Z" stroke="#4DE0B0" strokeWidth="1.5" strokeLinejoin="round"/></svg></div>
        <div className="feature-title" data-lang="id">Tanpa Registrasi Klien</div>
        <div className="feature-title" data-lang="en">Zero Client Registration</div>
        <p className="feature-desc" data-lang="id">Klienmu tidak perlu buat akun atau download app. Cukup buka link, isi testimoni, selesai. Response rate melonjak drastis.</p>
        <p className="feature-desc" data-lang="en">Your clients need no account or app download. Just open the link, submit the review, done. Response rate skyrockets.</p>
        <span className="feature-tag feature-tag-mint" data-lang="id">Keunggulan utama</span><span className="feature-tag feature-tag-mint" data-lang="en">Core advantage</span>
      </div>
      <div className="feature-card featured reveal reveal-delay-1">
        <div className="feature-icon feature-icon-mint"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#4DE0B0" strokeWidth="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5" stroke="#4DE0B0" strokeWidth="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5" stroke="#4DE0B0" strokeWidth="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5" stroke="#4DE0B0" strokeWidth="1.5"/></svg></div>
        <div className="feature-title" data-lang="id">Video &amp; Teks Testimoni</div>
        <div className="feature-title" data-lang="en">Video &amp; Text Testimonials</div>
        <p className="feature-desc" data-lang="id">Rekam video langsung dari browser atau ketik testimoni teks. Dua format, satu platform. Video 4× lebih meyakinkan dari teks biasa.</p>
        <p className="feature-desc" data-lang="en">Record video in-browser or type a text review. Two formats, one platform. Video testimonials are 4× more convincing than plain text.</p>
        <span className="feature-tag feature-tag-navy">Video + Text</span>
      </div>
      <div className="feature-card reveal reveal-delay-1">
        <div className="feature-icon feature-icon-cream"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M10 4V16" stroke="#1A3A4F" strokeWidth="1.8" strokeLinecap="round"/><rect x="2" y="2" width="16" height="16" rx="3" stroke="#1A3A4F" strokeWidth="1.2"/></svg></div>
        <div className="feature-title" data-lang="id">Widget Embed Instan</div>
        <div className="feature-title" data-lang="en">Instant Embed Widget</div>
        <p className="feature-desc" data-lang="id">Copy satu baris kode, paste ke Webflow, WordPress, Framer, atau HTML. Tampil real-time, responsive, dan ringan.</p>
        <p className="feature-desc" data-lang="en">Copy one line of code, paste into Webflow, WordPress, Framer, or plain HTML. Real-time, responsive, and lightweight.</p>
        <span className="feature-tag feature-tag-mint">Works everywhere</span>
      </div>
      <div className="feature-card reveal reveal-delay-2">
        <div className="feature-icon feature-icon-cream"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10L8.5 12.5L14 7" stroke="#1A3A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 2C5.6 2 2 5.6 2 10C2 14.4 5.6 18 10 18C14.4 18 18 14.4 18 10" stroke="#1A3A4F" strokeWidth="1.2" strokeLinecap="round"/></svg></div>
        <div className="feature-title" data-lang="id">Moderasi &amp; Kurasi</div>
        <div className="feature-title" data-lang="en">Moderation &amp; Curation</div>
        <p className="feature-desc" data-lang="id">Setujui, tolak, atau sembunyikan testimoni sebelum tampil di website. Kendali penuh di tanganmu.</p>
        <p className="feature-desc" data-lang="en">Approve, reject, or hide testimonials before they go live. Full control is always in your hands.</p>
        <span className="feature-tag feature-tag-mint">Full control</span>
      </div>
      <div className="feature-card reveal">
        <div className="feature-icon feature-icon-cream"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h9M3 14h6" stroke="#1A3A4F" strokeWidth="1.5" strokeLinecap="round"/></svg></div>
        <div className="feature-title">Wall of Love</div>
        <p className="feature-desc" data-lang="id">Halaman khusus berisi semua testimoni terbaikmu. Bagikan ke calon klien sebagai social proof instan — tanpa website sekalipun.</p>
        <p className="feature-desc" data-lang="en">A dedicated page showcasing all your best testimonials. Share it with prospects as instant social proof — even without a website.</p>
        <span className="feature-tag feature-tag-mint" data-lang="id">Siap pakai</span><span className="feature-tag feature-tag-mint" data-lang="en">Ready to share</span>
      </div>
      <div className="feature-card reveal reveal-delay-1">
        <div className="feature-icon feature-icon-cream"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3V10L14 13" stroke="#1A3A4F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="10" r="8" stroke="#1A3A4F" strokeWidth="1.2"/></svg></div>
        <div className="feature-title" data-lang="id">Notifikasi Real-time</div>
        <div className="feature-title" data-lang="en">Real-time Notifications</div>
        <p className="feature-desc" data-lang="id">Notifikasi langsung ke email setiap ada testimoni masuk. Tidak perlu cek dashboard — kamu tahu saat klien memujimu.</p>
        <p className="feature-desc" data-lang="en">Instant email alerts whenever a new testimonial arrives. No need to check the dashboard — you'll know the moment a client praises you.</p>
        <span className="feature-tag feature-tag-mint">Instant alerts</span>
      </div>
    </div>
  </div>
</section>


<section className="testimonials">
  <div className="container">
    <div className="reveal" style={{"textAlign":"center"}}>
      <div className="section-eyebrow" style={{"justifyContent":"center"}}><span className="section-eyebrow-line"></span><span data-lang="id">Kata mereka</span><span data-lang="en">What they say</span><span className="section-eyebrow-line"></span></div>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="id">Ribuan bisnis sudah<br /><em>membuktikannya.</em></h2>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="en">Thousands of businesses<br /><em>have proven it.</em></h2>
    </div>
  </div>
  <div style={{"overflow":"hidden","marginTop":"48px"}}>
    <div className="testimonial-track">
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Dalam seminggu pertama, saya sudah punya 12 testimoni video. Sebelumnya dalam setahun cuma dapat 3 teks."</p><p className="t-quote" data-lang="en">"In the first week I already had 12 video testimonials. Before, in a whole year I only got 3 text ones."</p><div className="t-user"><div className="t-avatar" style={{"background":"#E8FFF6","color":"#0F6E56"}}>DH</div><div><div className="t-name">Dian Hartono</div><div className="t-role">Freelance Designer</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Setup 5 menit, langsung jalan. Widget-nya elegan banget, klien saya sampai nanya pakai tools apa."</p><p className="t-quote" data-lang="en">"5-minute setup, instantly live. The widget looks so polished, clients ask me what tool I'm using."</p><div className="t-user"><div className="t-avatar" style={{"background":"#E8F0F5","color":"#1A3A4F"}}>NW</div><div><div className="t-name">Nadia Wulandari</div><div className="t-role">SaaS Founder</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Konversi landing page kami naik 31% setelah pasang Glowrora. Angka nyata, bukan estimasi."</p><p className="t-quote" data-lang="en">"Our landing page conversion went up 31% after adding Glowrora. Real numbers, not estimates."</p><div className="t-user"><div className="t-avatar" style={{"background":"#FEF3C7","color":"#92400E"}}>RK</div><div><div className="t-name">Rizky Kusuma</div><div className="t-role">Growth Marketer</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Klien saya yang gaptek pun bisa kasih video testimoni. No account, no hassle. Game changer."</p><p className="t-quote" data-lang="en">"Even my most tech-averse clients can submit video testimonials. No account, no hassle. Total game changer."</p><div className="t-user"><div className="t-avatar" style={{"background":"#FBEAF0","color":"#993556"}}>AM</div><div><div className="t-name">Anisa Maharani</div><div className="t-role">Agency Owner</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Kami pakai untuk 3 klien agensi sekaligus. Masing-masing punya Wall of Love sendiri. Semua senang."</p><p className="t-quote" data-lang="en">"We use it for 3 agency clients at once. Each has their own Wall of Love. Everyone's thrilled."</p><div className="t-user"><div className="t-avatar" style={{"background":"#E8FFF6","color":"#0F6E56"}}>FP</div><div><div className="t-name">Fajar Priambodo</div><div className="t-role">Digital Agency, Surabaya</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Harga terjangkau untuk value yang luar biasa. ROI-nya terasa dari bulan pertama."</p><p className="t-quote" data-lang="en">"Affordable pricing for incredible value. The ROI was obvious from the very first month."</p><div className="t-user"><div className="t-avatar" style={{"background":"#E8F0F5","color":"#1A3A4F"}}>TL</div><div><div className="t-name">Teguh Laksono</div><div className="t-role">Solopreneur, Jakarta</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Support responsif dan produknya terus improve. Senang bisa ikut tumbuh bareng Glowrora."</p><p className="t-quote" data-lang="en">"Responsive support and the product keeps improving. Love growing alongside Glowrora."</p><div className="t-user"><div className="t-avatar" style={{"background":"#FEF3C7","color":"#92400E"}}>PY</div><div><div className="t-name">Putri Yolanda</div><div className="t-role">Content Creator</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Saya rekomendasikan ke semua anggota komunitas saya. Semua yang coba langsung jadi pelanggan setia."</p><p className="t-quote" data-lang="en">"I recommended it to my entire community. Everyone who tried it became a loyal subscriber."</p><div className="t-user"><div className="t-avatar" style={{"background":"#FBEAF0","color":"#993556"}}>MS</div><div><div className="t-name">Muhammad Syarif</div><div className="t-role">Komunitas SaaS ID</div></div><span className="t-verified">✓ Verified</span></div></div>
      
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Dalam seminggu pertama, saya sudah punya 12 testimoni video. Sebelumnya dalam setahun cuma dapat 3 teks."</p><p className="t-quote" data-lang="en">"In the first week I already had 12 video testimonials. Before, in a whole year I only got 3 text ones."</p><div className="t-user"><div className="t-avatar" style={{"background":"#E8FFF6","color":"#0F6E56"}}>DH</div><div><div className="t-name">Dian Hartono</div><div className="t-role">Freelance Designer</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Setup 5 menit, langsung jalan. Widget-nya elegan banget, klien saya sampai nanya pakai tools apa."</p><p className="t-quote" data-lang="en">"5-minute setup, instantly live. The widget looks so polished, clients ask me what tool I'm using."</p><div className="t-user"><div className="t-avatar" style={{"background":"#E8F0F5","color":"#1A3A4F"}}>NW</div><div><div className="t-name">Nadia Wulandari</div><div className="t-role">SaaS Founder</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Konversi landing page kami naik 31% setelah pasang Glowrora. Angka nyata, bukan estimasi."</p><p className="t-quote" data-lang="en">"Our landing page conversion went up 31% after adding Glowrora. Real numbers, not estimates."</p><div className="t-user"><div className="t-avatar" style={{"background":"#FEF3C7","color":"#92400E"}}>RK</div><div><div className="t-name">Rizky Kusuma</div><div className="t-role">Growth Marketer</div></div><span className="t-verified">✓ Verified</span></div></div>
      <div className="t-card"><div className="t-stars">★★★★★</div><p className="t-quote" data-lang="id">"Klien saya yang gaptek pun bisa kasih video testimoni. No account, no hassle. Game changer."</p><p className="t-quote" data-lang="en">"Even my most tech-averse clients can submit video testimonials. No account, no hassle. Total game changer."</p><div className="t-user"><div className="t-avatar" style={{"background":"#FBEAF0","color":"#993556"}}>AM</div><div><div className="t-name">Anisa Maharani</div><div className="t-role">Agency Owner</div></div><span className="t-verified">✓ Verified</span></div></div>
    </div>
  </div>
</section>


<section className="metrics">
  <div className="container">
    <h2 className="metrics-title reveal" data-lang="id">Angka yang <em style={{"fontFamily":"var(--font-lora),ui-serif,Georgia,serif","fontStyle":"italic","color":"#4DE0B0"}}>bicara sendiri.</em></h2>
    <h2 className="metrics-title reveal" data-lang="en">Numbers that <em style={{"fontFamily":"var(--font-lora),ui-serif,Georgia,serif","fontStyle":"italic","color":"#4DE0B0"}}>speak for themselves.</em></h2>
    <p className="metrics-desc reveal" data-lang="id">Data dari pengguna aktif Glowrora dalam 6 bulan terakhir.</p>
    <p className="metrics-desc reveal" data-lang="en">Data from active Glowrora users over the last 6 months.</p>
    <div className="metrics-grid reveal">
      <div className="metric-item"><div className="metric-number">2.4K+</div><div className="metric-label" data-lang="id">Bisnis aktif<br />menggunakan Glowrora</div><div className="metric-label" data-lang="en">Active businesses<br />using Glowrora</div></div>
      <div className="metric-item"><div className="metric-number">38K+</div><div className="metric-label" data-lang="id">Testimoni berhasil<br />dikumpulkan</div><div className="metric-label" data-lang="en">Testimonials successfully<br />collected</div></div>
      <div className="metric-item"><div className="metric-number">3.2×</div><div className="metric-label" data-lang="id">Rata-rata peningkatan<br />response rate</div><div className="metric-label" data-lang="en">Average increase in<br />response rate</div></div>
      <div className="metric-item"><div className="metric-number">5 min</div><div className="metric-label" data-lang="id">Waktu setup<br />rata-rata pengguna baru</div><div className="metric-label" data-lang="en">Average setup time<br />for new users</div></div>
    </div>
  </div>
</section>


<section className="pricing" id="pricing">
  <div className="container">
    <div className="reveal" style={{"textAlign":"center"}}>
      <div className="section-eyebrow" style={{"justifyContent":"center"}}><span className="section-eyebrow-line"></span><span data-lang="id">Harga</span><span data-lang="en">Pricing</span><span className="section-eyebrow-line"></span></div>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="id">Investasi kecil.<br /><em>Kepercayaan tanpa batas.</em></h2>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="en">Small investment.<br /><em>Unlimited trust.</em></h2>
      <p className="section-desc" style={{"margin":"0 auto","textAlign":"center"}} data-lang="id">Mulai gratis, upgrade saat bisnis tumbuh. Tidak ada biaya tersembunyi.</p>
      <p className="section-desc" style={{"margin":"0 auto","textAlign":"center"}} data-lang="en">Start free, upgrade as you grow. No hidden fees, ever.</p>
    </div>
    <div className="pricing-grid">
      <div className="pricing-card reveal">
        <div className="plan-name">Starter</div>
        <div className="plan-price" data-lang="id">Gratis <span>selamanya</span></div>
        <div className="plan-price" data-lang="en">Free <span>forever</span></div>
        <p className="plan-desc" data-lang="id">Untuk kamu yang baru mulai. Cukup untuk merasakan efek nyata social proof.</p>
        <p className="plan-desc" data-lang="en">For those just starting out. Enough to feel the real impact of social proof.</p>
        <ul className="plan-features">
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Hingga 10 testimoni aktif</span><span data-lang="en">Up to 10 active testimonials</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Testimoni teks saja</span><span data-lang="en">Text testimonials only</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span>1 Wall of Love page</li>
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Widget embed basic</span><span data-lang="en">Basic embed widget</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span>Glowrora branding</li>
        </ul>
        <a href="/sign-up" className="btn-plan btn-plan-ghost" data-lang="id">Mulai Gratis</a>
        <a href="/sign-up" className="btn-plan btn-plan-ghost" data-lang="en">Get Started Free</a>
      </div>
      <div className="pricing-card popular reveal reveal-delay-1">
        <div className="popular-badge" data-lang="id">Paling Populer</div>
        <div className="popular-badge" data-lang="en">Most Popular</div>
        <div className="plan-name">Pro</div>
        <div className="plan-price">Rp99k <span data-lang="id">/ bulan</span><span data-lang="en">/ month</span></div>
        <p className="plan-desc" data-lang="id">Untuk solopreneur dan SaaS founder serius yang ingin hasil maksimal dari social proof.</p>
        <p className="plan-desc" data-lang="en">For serious solopreneurs and SaaS founders who want maximum results from social proof.</p>
        <ul className="plan-features">
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Testimoni tidak terbatas</span><span data-lang="en">Unlimited testimonials</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Video + teks testimoni</span><span data-lang="en">Video + text testimonials</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span>3 Wall of Love pages</li>
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Widget tanpa branding Glowrora</span><span data-lang="en">Widget without Glowrora branding</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span>Custom domain</li>
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Notifikasi email real-time</span><span data-lang="en">Real-time email notifications</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span>Analytics &amp; insights</li>
        </ul>
        <a href="/sign-up" className="btn-plan btn-plan-primary" data-lang="id">Mulai 14 Hari Gratis →</a>
        <a href="/sign-up" className="btn-plan btn-plan-primary" data-lang="en">Start 14-Day Free Trial →</a>
      </div>
      <div className="pricing-card reveal reveal-delay-2">
        <div className="plan-name" data-lang="id">Agensi</div>
        <div className="plan-name" data-lang="en">Agency</div>
        <div className="plan-price">Rp299k <span data-lang="id">/ bulan</span><span data-lang="en">/ month</span></div>
        <p className="plan-desc" data-lang="id">Untuk agensi yang mengelola social proof untuk banyak klien sekaligus.</p>
        <p className="plan-desc" data-lang="en">For agencies managing social proof across multiple clients at once.</p>
        <ul className="plan-features">
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Semua fitur Pro</span><span data-lang="en">All Pro features</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span><span data-lang="id">Hingga 20 workspace klien</span><span data-lang="en">Up to 20 client workspaces</span></li>
          <li className="plan-feature"><span className="plan-check">✓</span>White-label widget</li>
          <li className="plan-feature"><span className="plan-check">✓</span>Team collaboration</li>
          <li className="plan-feature"><span className="plan-check">✓</span>Priority support</li>
          <li className="plan-feature"><span className="plan-check">✓</span>API access</li>
        </ul>
        <a href="#" className="btn-plan btn-plan-ghost" data-lang="id">Hubungi Sales</a>
        <a href="#" className="btn-plan btn-plan-ghost" data-lang="en">Contact Sales</a>
      </div>
    </div>
    <div style={{"textAlign":"center","marginTop":"32px"}} className="reveal">
      <p style={{"fontSize":"13px","color":"var(--muted)"}} data-lang="id">Semua paket termasuk SSL, hosting, dan update produk secara gratis. Batalkan kapan saja.</p>
      <p style={{"fontSize":"13px","color":"var(--muted)"}} data-lang="en">All plans include SSL, hosting, and product updates for free. Cancel anytime.</p>
    </div>
  </div>
</section>


<section className="faq" id="faq">
  <div className="container">
    <div className="reveal" style={{"textAlign":"center","marginBottom":"0"}}>
      <div className="section-eyebrow" style={{"justifyContent":"center"}}><span className="section-eyebrow-line"></span>FAQ<span className="section-eyebrow-line"></span></div>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="id">Pertanyaan yang sering<br /><em>kami dengar.</em></h2>
      <h2 className="section-title" style={{"textAlign":"center"}} data-lang="en">Questions we hear<br /><em>all the time.</em></h2>
    </div>
    <div className="faq-grid">
      <div className="faq-item reveal" onClick={(e) => toggleFaq(e.currentTarget)}>
        <div className="faq-question"><span data-lang="id">Apakah klien saya perlu membuat akun?</span><span data-lang="en">Do my clients need to create an account?</span><span className="faq-toggle">+</span></div>
        <div className="faq-answer" data-lang="id">Tidak sama sekali. Klien cukup buka link unik yang kamu bagikan, langsung bisa menulis atau merekam video. Zero registration, zero friction — inilah yang membuat response rate jauh lebih tinggi.</div>
        <div className="faq-answer" data-lang="en">Not at all. Clients simply open the unique link you share and can instantly write or record a video. Zero registration, zero friction — which is exactly why response rates are so much higher.</div>
      </div>
      <div className="faq-item reveal reveal-delay-1" onClick={(e) => toggleFaq(e.currentTarget)}>
        <div className="faq-question"><span data-lang="id">Platform apa saja yang didukung?</span><span data-lang="en">Which platforms are supported?</span><span className="faq-toggle">+</span></div>
        <div className="faq-answer" data-lang="id">Widget Glowrora bekerja di website manapun — Webflow, WordPress, Framer, Wix, Squarespace, Shopify, atau HTML murni. Cukup satu baris embed code, langsung jalan.</div>
        <div className="faq-answer" data-lang="en">The Glowrora widget works on any website — Webflow, WordPress, Framer, Wix, Squarespace, Shopify, or plain HTML. One line of embed code and you're live.</div>
      </div>
      <div className="faq-item reveal" onClick={(e) => toggleFaq(e.currentTarget)}>
        <div className="faq-question"><span data-lang="id">Apakah ada batasan ukuran video?</span><span data-lang="en">Are there video size or length limits?</span><span className="faq-toggle">+</span></div>
        <div className="faq-answer" data-lang="id">Video testimoni bisa direkam hingga 2 menit dengan resolusi hingga 1080p. Semua video di-compress otomatis tanpa mengurangi kualitas, tidak memperlambat loading website.</div>
        <div className="faq-answer" data-lang="en">Video testimonials can be recorded up to 2 minutes at up to 1080p. All videos are automatically compressed without sacrificing quality, so your site stays fast.</div>
      </div>
      <div className="faq-item reveal reveal-delay-1" onClick={(e) => toggleFaq(e.currentTarget)}>
        <div className="faq-question"><span data-lang="id">Bagaimana jika saya ingin membatalkan?</span><span data-lang="en">What if I want to cancel?</span><span className="faq-toggle">+</span></div>
        <div className="faq-answer" data-lang="id">Batalkan kapan saja tanpa pertanyaan, tanpa denda. Akun kamu tetap aktif hingga akhir periode yang sudah dibayar. Semua data bisa dieksport sebelum akun ditutup.</div>
        <div className="faq-answer" data-lang="en">Cancel anytime, no questions asked, no penalties. Your account stays active until the end of the paid period. All your data can be exported before closing.</div>
      </div>
      <div className="faq-item reveal" onClick={(e) => toggleFaq(e.currentTarget)}>
        <div className="faq-question"><span data-lang="id">Apakah bisa import testimoni lama?</span><span data-lang="en">Can I import existing testimonials?</span><span className="faq-toggle">+</span></div>
        <div className="faq-answer" data-lang="id">Ya! Kamu bisa import testimoni teks yang sudah ada. Fitur import dari Google Reviews, Trustpilot, dan Tokopedia sedang dalam pengembangan aktif.</div>
        <div className="faq-answer" data-lang="en">Yes! You can import existing text testimonials. Import from Google Reviews, Trustpilot, and Tokopedia is currently in active development.</div>
      </div>
      <div className="faq-item reveal reveal-delay-1" onClick={(e) => toggleFaq(e.currentTarget)}>
        <div className="faq-question"><span data-lang="id">Data testimoni klien saya aman?</span><span data-lang="en">Is my client data safe?</span><span className="faq-toggle">+</span></div>
        <div className="faq-answer" data-lang="id">Keamanan data adalah prioritas utama kami. Semua data dienkripsi dengan standar AES-256, server di Singapore, dan kami tidak pernah menjual data ke pihak ketiga manapun.</div>
        <div className="faq-answer" data-lang="en">Data security is our top priority. All data is encrypted to AES-256 standards, servers are in Singapore, and we never sell user data to any third party.</div>
      </div>
    </div>
  </div>
</section>


<section className="cta-final">
  <div className="container">
    <h2 className="reveal" data-lang="id">Mulai bangun kepercayaan<br />bisnis kamu <em>hari ini.</em></h2>
    <h2 className="reveal" data-lang="en">Start building trust<br />for your business <em>today.</em></h2>
    <p className="cta-final-sub reveal" data-lang="id">Setup dalam 5 menit. Testimoni pertama bisa masuk dalam hitungan jam. Tidak perlu kartu kredit untuk memulai.</p>
    <p className="cta-final-sub reveal" data-lang="en">Setup in 5 minutes. Your first testimonial can arrive within hours. No credit card needed to get started.</p>
    <div className="reveal" style={{"display":"flex","alignItems":"center","justifyContent":"center","gap":"14px","flexWrap":"wrap"}}>
      <a href="/sign-up" className="btn-primary" style={{"fontSize":"16px","padding":"16px 36px"}} data-lang="id"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Coba Gratis 14 Hari</a>
      <a href="/sign-up" className="btn-primary" style={{"fontSize":"16px","padding":"16px 36px"}} data-lang="en"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>Try Free for 14 Days</a>
      <a href="#how" className="btn-secondary" style={{"borderColor":"rgba(255,255,255,.2)","color":"#E8F0F5","fontSize":"16px","padding":"15px 28px"}} data-lang="id">Lihat Demo Langsung</a>
      <a href="#how" className="btn-secondary" style={{"borderColor":"rgba(255,255,255,.2)","color":"#E8F0F5","fontSize":"16px","padding":"15px 28px"}} data-lang="en">Watch Live Demo</a>
    </div>
    <p className="cta-final-note reveal" data-lang="id">Lebih dari 2.400 bisnis sudah membuktikannya. Kamu berikutnya?</p>
    <p className="cta-final-note reveal" data-lang="en">Over 2,400 businesses have already proven it. Are you next?</p>
  </div>
</section>


<footer>
  <div className="footer-inner">
    <div>
      <div className="footer-logo-text">
        <div style={{"width":"28px","height":"28px","background":"#1A3A4F","border":".5px solid rgba(77,224,176,.3)","borderRadius":"7px","display":"flex","alignItems":"center","justifyContent":"center"}}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 4" stroke="#4DE0B0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        Glowrora
      </div>
      <p className="footer-tagline" data-lang="id">Cara termudah bagi bisnis dan kreator untuk membangun kepercayaan melalui testimoni autentik.</p>
      <p className="footer-tagline" data-lang="en">The easiest way for businesses and creators to build trust through authentic testimonials.</p>
      <div style={{"marginTop":"20px","display":"flex","gap":"10px"}}>
        <div className="footer-badge"><svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#4DE0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>SSL Secured</div>
        <div className="footer-badge">🇮🇩 Made in Indonesia</div>
      </div>
    </div>
    <div>
      <div className="footer-col-title" data-lang="id">Produk</div><div className="footer-col-title" data-lang="en">Product</div>
      <ul className="footer-links">
        <li><a href="#features" data-lang="id">Fitur</a><a href="#features" data-lang="en">Features</a></li>
        <li><a href="#pricing" data-lang="id">Harga</a><a href="#pricing" data-lang="en">Pricing</a></li>
        <li><a href="#">Wall of Love</a></li>
        <li><a href="#">Widget Builder</a></li>
        <li><a href="#">API Docs</a></li>
      </ul>
    </div>
    <div>
      <div className="footer-col-title" data-lang="id">Perusahaan</div><div className="footer-col-title" data-lang="en">Company</div>
      <ul className="footer-links">
        <li><a href="#" data-lang="id">Tentang Kami</a><a href="#" data-lang="en">About Us</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#" data-lang="id">Afiliasi</a><a href="#" data-lang="en">Affiliate</a></li>
        <li><a href="#" data-lang="id">Karir</a><a href="#" data-lang="en">Careers</a></li>
        <li><a href="#">Status</a></li>
      </ul>
    </div>
    <div>
      <div className="footer-col-title" data-lang="id">Bantuan</div><div className="footer-col-title" data-lang="en">Support</div>
      <ul className="footer-links">
        <li><a href="#" data-lang="id">Dokumentasi</a><a href="#" data-lang="en">Documentation</a></li>
        <li><a href="#" data-lang="id">Hubungi Support</a><a href="#" data-lang="en">Contact Support</a></li>
        <li><a href="#" data-lang="id">Privasi &amp; Data</a><a href="#" data-lang="en">Privacy &amp; Data</a></li>
        <li><a href="#" data-lang="id">Syarat Layanan</a><a href="#" data-lang="en">Terms of Service</a></li>
      </ul>
    </div>
  </div>
  <div className="footer-bottom">
    <span className="footer-copy" data-lang="id">© 2025 Glowrora. Hak cipta dilindungi.</span>
    <span className="footer-copy" data-lang="en">© 2025 Glowrora. All rights reserved.</span>
    <span className="footer-copy" data-lang="id">Dibangun dengan ❤️ untuk bisnis Indonesia &amp; global.</span>
    <span className="footer-copy" data-lang="en">Built with ❤️ for Indonesian &amp; global businesses.</span>
  </div>
</footer>

    </>
  );
}
