import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

/* ─── DATA ─────────────────────────────────── */
const ANIMALS = [
  {
    id: 1, emoji: "🐄", name: "Desi Gaye", type: "Cow", filter: "hissa",
    weight: "320 kg", city: "Karachi", price: "Rs 18,000", priceLabel: "per hissa (1/7)",
    badge: "hissa", badgeText: "Hissa Available", btnText: "Book Hissa",
  },
  {
    id: 2, emoji: "🐂", name: "Sahiwal Wanda", type: "Cow", filter: "hissa",
    weight: "410 kg", city: "Lahore", price: "Rs 24,000", priceLabel: "per hissa (1/7)",
    badge: "hissa", badgeText: "4 Hissas Left", btnText: "Book Hissa",
  },
  {
    id: 3, emoji: "🐐", name: "Beetal Bakra", type: "Goat", filter: "full",
    weight: "35 kg", city: "Islamabad", price: "Rs 45,000", priceLabel: "full animal",
    badge: "full", badgeText: "Full Only", btnText: "Book Now",
  },
  {
    id: 4, emoji: "🐑", name: "Rakhshani Dumba", type: "Sheep", filter: "full",
    weight: "45 kg", city: "Karachi", price: "Rs 65,000", priceLabel: "full animal",
    badge: "full", badgeText: "Full Only", btnText: "Book Now",
  },
  {
    id: 5, emoji: "🐪", name: "Sindhi Oont", type: "Camel", filter: "hissa",
    weight: "520 kg", city: "Karachi", price: "Rs 55,000", priceLabel: "per hissa (1/7)",
    badge: "hissa", badgeText: "Premium", btnText: "Book Hissa",
  },
  {
    id: 6, emoji: "🐏", name: "Kajli Bakra", type: "Goat", filter: "full",
    weight: "28 kg", city: "Lahore", price: "Rs 32,000", priceLabel: "full animal",
    badge: "full", badgeText: "Full Only", btnText: "Book Now",
  },
];

const STEPS = [
  { num: 1, icon: "📋", title: "Register & Browse", desc: "Create your account in under a minute and browse our verified inventory of healthy animals — each with weight, price, and health certificate." },
  { num: 2, icon: "🎯", title: "Choose & Book",    desc: "Book a full animal or select one of 7 hissas in a shared cow or camel. Your hissa is instantly locked — no double booking, ever." },
  { num: 3, icon: "💳", title: "Pay Securely",     desc: "Pay via Easypaisa, JazzCash, bank transfer, or cash. Receive an instant digital receipt with your booking confirmation number." },
  { num: 4, icon: "🏠", title: "Receive at Home",  desc: "Your Qurbani is performed on Eid day by licensed butchers. Packaged meat is delivered fresh to your doorstep." },
];

const FEATURES = [
  { icon: "🔒", title: "Hissa Anti-Overbooking Lock",  desc: "Each of the 7 hissa slots is locked the moment it's booked. No overselling, no disputes — mathematically impossible to book 8 shares of one animal." },
  { icon: "🩺", title: "Vet-Certified Animals",         desc: "Every animal comes with a health inspection record from a certified veterinarian — ensuring your Qurbani meets full Shariah compliance requirements." },
  { icon: "📦", title: "Doorstep Meat Delivery",        desc: "Your packaged meat is delivered fresh on Eid day. Track your delivery in real time from the slaughterhouse to your front door." },
  { icon: "🧾", title: "Instant Digital Receipt",       desc: "Every payment generates a digital receipt with a unique booking ID. Your records are always accessible from your personal dashboard." },
];

const TESTIMONIALS = [
  { stars: 5, text: "Finally a proper system for Qurbani. I booked my hissa in under 2 minutes, paid via Easypaisa, and received my meat on Eid afternoon. No stress at all. JazakAllah Khair EzQurbani!", name: "Tariq Ahmed",        city: "Karachi, DHA Phase 6", avatar: "👨" },
  { stars: 5, text: "Maine pehli dafa online Qurbani book ki thi. Vet certificate dekh ke dil ko sukoon mila. Animal healthy tha, slaughter on time hua, aur delivery bhi aa gayi. Bohot acha system hai.", name: "Sana Riaz",          city: "Lahore, Gulberg",     avatar: "👩" },
  { stars: 5, text: "The hissa booking system is genius. We are a family of 4 brothers — we each took one hissa of the same cow. The booking was instant and we all got our own receipts. Highly recommended.", name: "Dr. Kashif Mahmood", city: "Islamabad, F-7",      avatar: "👨" },
];

const FAQS = [
  { q: "What is a Hissa and how does it work?",    a: "A Hissa is one of the 7 equal shares of a large animal (cow or camel). According to Islamic law, one large animal can fulfill the Qurbani obligation for up to 7 people. You pay for 1/7th of the animal's price and receive 1/7th of the meat after slaughter." },
  { q: "Are the animals Shariah-compliant?",        a: "Yes. All animals on EzQurbani meet the Shariah requirements for Qurbani — they are above the minimum age, healthy, free from major defects, and pass a vet inspection. Each animal has a health certificate you can view before booking." },
  { q: "When will my meat be delivered?",           a: "Slaughter is performed on the morning of Eid ul-Adha (10th Dhul Hijjah). Meat is packaged and delivered to your registered address on the same day. You will receive real-time delivery tracking notifications." },
  { q: "Can I cancel my booking?",                  a: "Cancellations are accepted up to 7 days before Eid. After that, bookings are final as animal preparation has already begun. Contact our support team for cancellation requests within the eligible window." },
  { q: "Which payment methods are accepted?",       a: "We accept Easypaisa, JazzCash, bank transfer (all major Pakistani banks), and cash payment at the time of delivery confirmation. All transactions generate a digital receipt immediately." },
  { q: "Which cities do you serve?",                a: "We currently serve Karachi, Lahore, and Islamabad. We are expanding to Hyderabad, Faisalabad, and Peshawar for Eid 2027. Enter your city during registration to see available animals near you." },
];

/* ─── HOOKS ─────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: "--", hours: "--", mins: "--" });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, mins: 0 }); return; }
      setTimeLeft({
        days:  Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins:  Math.floor((diff % 3600000) / 60000),
      });
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

/* ─── SUB-COMPONENTS ─────────────────────────── */

function Navbar({ onNav }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav className={`lnav${scrolled ? " scrolled" : ""}`}>
        <span className="lnav__logo" onClick={() => scrollTo("hero")}>
          <span className="lnav__logo-crescent">☽</span> EzQurbani
        </span>
        <ul className="lnav__links">
          <li><a onClick={() => scrollTo("how")}>How It Works</a></li>
          <li><a onClick={() => scrollTo("animals")}>Animals</a></li>
          <li><a onClick={() => scrollTo("features")}>Features</a></li>
          <li><a onClick={() => scrollTo("faq")}>FAQ</a></li>
          <li><a className="lnav__cta" style={{ background: "transparent", color: "var(--gold)", border: "1px solid var(--gold)" }} onClick={() => onNav("/login")}>Login</a></li>
          <li><a className="lnav__cta" onClick={() => onNav("/register")}>Book Now</a></li>
        </ul>
        <button
          className={`lnav__hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen((p) => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      <div className={`lnav__mobile${menuOpen ? " open" : ""}`}>
        <a onClick={() => scrollTo("how")}>How It Works</a>
        <a onClick={() => scrollTo("animals")}>Animals</a>
        <a onClick={() => scrollTo("features")}>Features</a>
        <a onClick={() => scrollTo("faq")}>FAQ</a>
        <a onClick={() => onNav("/login")} style={{color: "var(--gold-lt)"}}>Login</a>
        <a onClick={() => onNav("/register")}>Book Now →</a>
      </div>
    </>
  );
}

function HeroVisual({ countdown }) {
  return (
    <div className="hero__visual">
      <div className="hero__animal-grid">
        {[
          { emoji: "🐄", name: "Cow / Gaye",   sub: "7 hissas available", tag: "Popular" },
          { emoji: "🐪", name: "Camel / Oont",  sub: "7 hissas available", tag: "Premium" },
          { emoji: "🐑", name: "Dumba / Sheep", sub: "Full animal only",   tag: null },
          { emoji: "🐐", name: "Bakra / Goat",  sub: "Full animal only",   tag: null },
        ].map((a) => (
          <div key={a.name} className="hero__animal-card">
            {a.tag && <span className="hero__animal-tag">{a.tag}</span>}
            <span className="hero__animal-emoji">{a.emoji}</span>
            <div className="hero__animal-info">
              <div className="hero__animal-name">{a.name}</div>
              <div className="hero__animal-sub">{a.sub}</div>
            </div>
          </div>
        ))}
        <div className="hero__animal-card hero__animal-card--wide">
          <span className="hero__animal-emoji">☽</span>
          <div className="hero__animal-info">
            <div className="hero__animal-name">Eid ul-Adha 2026</div>
            <div className="hero__animal-sub">Serving Karachi · Lahore · Islamabad · Book before slots run out</div>
          </div>
        </div>
      </div>

      <div className="hero__countdown">
        <span>⏳ Eid Countdown:</span>
        <div className="hero__cd-inner">
          {[["days", "Days"], ["hours", "Hrs"], ["mins", "Min"]].map(([k, label]) => (
            <div key={k} className="hero__cd-block">
              <span className="hero__cd-num">{countdown[k]}</span>
              <span className="hero__cd-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimalCard({ animal, onBook }) {
  return (
    <div className="animal-card">
      <div className="animal-card__img">
        <span className="animal-card__badge-type">{animal.type}</span>
        <span className={animal.badge === "hissa" ? "animal-card__badge-hissa" : "animal-card__badge-full"}>
          {animal.badgeText}
        </span>
        <span className="animal-card__emoji">{animal.emoji}</span>
      </div>
      <div className="animal-card__body">
        <h3 className="animal-card__name">{animal.name}</h3>
        <div className="animal-card__meta">
          <span className="meta-chip">⚖️ {animal.weight}</span>
          <span className="meta-chip">📍 {animal.city}</span>
          <span className="meta-chip">✅ Vet Checked</span>
        </div>
        <div className="animal-card__price-row">
          <div>
            <div className="animal-card__price">{animal.price}</div>
            <div className="animal-card__price-label">{animal.priceLabel}</div>
          </div>
          <button className="book-btn" onClick={() => onBook()}>
            {animal.btnText}
          </button>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " open" : ""}`}>
      <button className="faq-item__q" onClick={() => setOpen((p) => !p)}>
        <span className="faq-item__q-text">{faq.q}</span>
        <span className="faq-item__icon">+</span>
      </button>
      <div className="faq-item__a">
        <p>{faq.a}</p>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────── */
export default function Landing() {
  const navigate   = useNavigate();
  const [filter, setFilter] = useState("all");
  const countdown  = useCountdown("2026-06-27T06:00:00");
  useScrollReveal();

  const filtered = filter === "all" ? ANIMALS : ANIMALS.filter((a) => a.filter === filter);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="landing-root">
      <Navbar onNav={navigate} />

      {/* ── HERO ── */}
      <section id="hero" className="hero">
        <div className="geo-bg" />
        <div className="hero__glow" />
        <div className="hero__glow-2" />
        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__badge">
              <span className="hero__badge-dot" />
              Eid ul-Adha 2026 · Bookings Open
            </div>
            <h1 className="hero__title">
              Book Your<br />
              <span className="hero__title-accent">Qurbani Online</span>
              with Ease
            </h1>
            <p className="hero__arabic">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
            <p className="hero__desc">
              EzQurbani makes fulfilling your sacred Sunnah effortless. Choose your animal,
              book a full Qurbani or a single hissa, pay online, and we handle the rest —
              from verified farms to doorstep delivery.
            </p>
            <div className="hero__btns">
              <button className="btn-primary" onClick={() => navigate("/register")}>
                🐄 Book Now
              </button>
              <button className="btn-outline" onClick={() => navigate("/login")}>
                Login
              </button>
            </div>
            <div className="hero__stats">
              {[["2,400+","Satisfied Families"],["500+","Verified Animals"],["3","Cities Served"]].map(([n,l]) => (
                <div key={l}>
                  <div className="hero__stat-num">{n}</div>
                  <div className="hero__stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <HeroVisual countdown={countdown} />
        </div>
      </section>

      {/* ── EID BANNER ── */}
      <div className="eid-banner">
        <div className="eid-banner__inner">
          <span className="eid-banner__ornament">☽</span>
          <p className="eid-banner__text">
            🌙 Eid ul-Adha 2026 is approaching —&nbsp;
            <strong>Secure your Qurbani today before animals are fully booked</strong>
          </p>
          <p className="eid-banner__arabic">عيد مبارك</p>
          <span className="eid-banner__ornament">☽</span>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="how">
        <div className="geo-bg" />
        <div className="how__header section-inner">
          <div className="section-label section-label--light section-label--center reveal">The Process</div>
          <h2 className="section-title section-title--white section-title--center reveal">
            Simple as <span className="italic--gold" style={{fontStyle:"italic", color:"var(--gold-lt)"}}>Four Steps</span>
          </h2>
          <p className="section-desc section-desc--light section-desc--center reveal" style={{margin:"14px auto 0"}}>
            From selection to delivery — your entire Qurbani managed digitally, with full transparency at every step.
          </p>
        </div>
        <div className="how__grid section-inner">
          {STEPS.map((s, i) => (
            <div key={s.num} className={`how__card reveal reveal-d${i}`}>
              <div className="how__step-num">{s.num}</div>
              <div className="how__icon">{s.icon}</div>
              <h3 className="how__card-title">{s.title}</h3>
              <p className="how__card-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ANIMALS ── */}
      <section id="animals" className="animals">
        <div className="section-inner">
          <div className="animals__header">
            <div>
              <div className="section-label reveal">Our Livestock</div>
              <h2 className="section-title reveal">
                Available <span className="italic">Animals</span>
              </h2>
              <p className="section-desc reveal">
                All animals are vet-checked, Shariah-compliant, and sourced from trusted farms.
              </p>
            </div>
            <div className="filter-tabs reveal">
              {[["all","All Animals"],["hissa","Hissa Available"],["full","Full Animal"]].map(([v,l]) => (
                <button
                  key={v}
                  className={`filter-tab${filter === v ? " active" : ""}`}
                  onClick={() => setFilter(v)}
                >{l}</button>
              ))}
            </div>
          </div>
          <div className="animals__grid">
            {filtered.map((a) => (
              <AnimalCard key={a.id} animal={a} onBook={() => navigate("/register")} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HADITH ── */}
      <div className="hadith">
        <div className="geo-bg" />
        <div className="hadith__ornament">❋</div>
        <p className="hadith__arabic">
          مَا عَمِلَ ابْنُ آدَمَ يَوْمَ النَّحْرِ عَمَلاً أَحَبَّ إِلَى اللهِ مِنْ إِهْرَاقَةِ الدَّمِ
        </p>
        <p className="hadith__translation">
          "There is no deed that a person can do on the day of Nahr (Eid al-Adha) that is more beloved
          to Allah than the shedding of blood (of a sacrificial animal)."
        </p>
        <p className="hadith__source">— Sunan Ibn Majah 3126 · Authenticated by Al-Albani</p>
        <div className="hadith__ornament" style={{marginTop:"20px"}}>❋</div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="features">
        <div className="features__grid">
          <div>
            <div className="section-label reveal">Why EzQurbani</div>
            <h2 className="section-title reveal">
              Everything You Need,<br />
              <span className="italic">Nothing You Don't</span>
            </h2>
            <p className="section-desc reveal">
              We built EzQurbani to solve every pain point of traditional Qurbani booking —
              from finding a trustworthy animal to getting your meat on time.
            </p>
            <div className="features__list">
              {FEATURES.map((f, i) => (
                <div key={f.title} className={`feature-item reveal reveal-d${i}`}>
                  <div className="feature-item__icon">{f.icon}</div>
                  <div>
                    <h4 className="feature-item__title">{f.title}</h4>
                    <p className="feature-item__desc">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal">
            <div className="showcase">
              <div className="geo-bg" />
              <span className="showcase__emoji">🐄</span>
              <div className="showcase__title">Premium Desi Cow</div>
              <div className="showcase__sub">Sourced from trusted farms · Vet certified · Shariah compliant</div>
              <div className="showcase__stats">
                {[["7","Total Hissas"],["3","Remaining"],["320kg","Weight"]].map(([n,l]) => (
                  <div key={l} style={{textAlign:"center"}}>
                    <div className="showcase__stat-num">{n}</div>
                    <div className="showcase__stat-label">{l}</div>
                  </div>
                ))}
              </div>
              <div className="hissa-slots">
                <div className="hissa-slots__circles">
                  {[1,2,3,4,5,6,7].map((n) => (
                    <div key={n} className={`hissa-slot${n <= 4 ? " hissa-slot--booked" : " hissa-slot--free"}`}>{n}</div>
                  ))}
                </div>
                <span className="hissa-slots__label">4/7 Booked</span>
              </div>
              <button className="btn-primary btn-primary--full" onClick={() => navigate("/register")}>
                Book a Hissa Now →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="testimonials">
        <div className="testimonials__header">
          <div className="section-label section-label--center reveal">Trusted By Families</div>
          <h2 className="section-title section-title--center reveal">
            What Our <span className="italic">Customers Say</span>
          </h2>
        </div>
        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className={`testimonial-card reveal reveal-d${i}`}>
              <div className="testimonial-card__stars">{"★".repeat(t.stars)}</div>
              <p className="testimonial-card__text">{t.text}</p>
              <div className="reviewer">
                <div className="reviewer__avatar">{t.avatar}</div>
                <div>
                  <div className="reviewer__name">{t.name}</div>
                  <div className="reviewer__city">{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="faq">
        <div className="faq__header">
          <div className="section-label section-label--center reveal">Got Questions</div>
          <h2 className="section-title section-title--center reveal">
            Frequently <span className="italic">Asked</span>
          </h2>
        </div>
        <div className="faq__grid">
          {FAQS.map((f) => <FaqItem key={f.q} faq={f} />)}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="cta" className="cta-section">
        <div className="geo-bg" />
        <div className="cta-section__inner">
          <div className="section-label section-label--light section-label--center reveal">Limited Slots Available</div>
          <h2 className="section-title section-title--white section-title--center reveal">
            Fulfill Your Sunnah<br />
            <span style={{fontStyle:"italic", color:"var(--gold-lt)"}}>This Eid ul-Adha</span>
          </h2>
          <p className="section-desc section-desc--light section-desc--center reveal">
            Animals are filling up fast. Register now, secure your booking, and leave the rest to us.
            Your Qurbani, handled with care.
          </p>
          <div className="cta-section__btns reveal">
            <button className="btn-primary btn-primary--lg" onClick={() => navigate("/register")}>
              🐄 Book Your Qurbani Now
            </button>
            <button className="btn-outline btn-outline--lg" onClick={() => navigate("/login")}>
              Sign In to Dashboard
            </button>
          </div>
          <p className="cta-section__note">
            🔒 Secure payments · 📋 Instant receipts · 🚚 Same-day delivery
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer__inner">
          <div>
            <div className="footer__logo">
              <span>☽</span> EzQurbani
            </div>
            <p className="footer__brand-desc">
              Pakistan's most trusted online Qurbani booking platform. Serving thousands of families
              across Karachi, Lahore, and Islamabad every Eid ul-Adha.
            </p>
            <div className="footer__socials">
              {["f","in","tw","yt"].map((s) => (
                <a key={s} href="#" className="footer__social">{s}</a>
              ))}
            </div>
          </div>

          {[
            { title: "Platform", links: [["Create Account","/register"],["Sign In","/login"],["Browse Animals","#animals"],["How It Works","#how"]] },
            { title: "Animals",  links: [["Cows & Wanda","#"],["Goats & Bakra","#"],["Sheep & Dumba","#"],["Camels","#"]] },
            { title: "Support",  links: [["FAQ","#faq"],["Contact Us","#"],["Privacy Policy","#"],["Terms of Service","#"]] },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="footer__col-title">{col.title}</h5>
              <ul className="footer__col-links">
                {col.links.map(([label, href]) => (
                  <li key={label}><a href={href}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">© 2026 EzQurbani. All rights reserved. · Karachi · Lahore · Islamabad</p>
          <p className="footer__made-with">
            Made with <span className="footer__heart">♥️</span> by Muhammad Umar
          </p>
        </div>
      </footer>
    </div>
  );
}