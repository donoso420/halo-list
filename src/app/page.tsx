export default function Home() {
  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">XR</span>
          <span>Xtreme Credit Repair</span>
        </div>
        <nav className="nav-actions">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#kids">Kids</a>
          <a href="#pricing">Pricing</a>
          <a href="/dashboard">Dashboard</a>
          <button className="btn btn-secondary">Log in</button>
          <button className="btn btn-primary">Start free</button>
        </nav>
      </header>

      <section className="hero">
        <div>
          <div className="tag-row">
            <span className="tag">FCRA compliant</span>
            <span className="tag">FDCPA safe</span>
            <span className="tag">GLBA ready</span>
          </div>
          <h1>
            A friendly, guided path to stronger credit 
            without the confusion.
          </h1>
          <p>
            Xtreme Credit Repair turns your credit report into a prioritized
            action plan, tracks every dispute letter, and keeps you on schedule
            with clear deadlines and reminders.
          </p>
          <div className="nav-actions">
            <button className="btn btn-primary">Start free</button>
            <button className="btn btn-secondary">View plans</button>
          </div>
        </div>
        <div className="hero-card">
          <div>
            <div className="metric-row">
              <span>Plan progress</span>
              <strong>68%</strong>
            </div>
            <div className="progress">
              <span />
            </div>
          </div>
          <div className="metric-row">
            <span>Letters sent this month</span>
            <strong>3</strong>
          </div>
          <div className="metric-row">
            <span>Next deadline</span>
            <strong>Feb 18</strong>
          </div>
          <div>
            <div className="metric-row">
              <span>Focus this week</span>
              <strong>Utilization</strong>
            </div>
            <div className="tag-row">
              <span className="tag">Disputes</span>
              <span className="tag">Reminders</span>
              <span className="tag">AI coach</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <h2>Everything you need to move up, clearly organized.</h2>
        <p>
          We combine report insights, letter tracking, and gentle coaching into
          one calm workspace.
        </p>
        <div className="grid">
          <div className="card">
            <h3>Action plan</h3>
            <p>
              Personalized steps ranked by impact, time, and effort — no
              guesswork.
            </p>
          </div>
          <div className="card">
            <h3>Dispute tracking</h3>
            <p>
              Create letters, log sent dates, and see response deadlines at a
              glance.
            </p>
          </div>
          <div className="card">
            <h3>AI guidance</h3>
            <p>
              Friendly explanations with guardrails. Educational, never
              promising outcomes.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Letters & deadlines, tracked automatically.</h2>
        <p>
          Every letter has a sent date, a response window, and a reminder
          schedule. No more guessing.
        </p>
        <div className="demo">
          <div className="card">
            <h3>Letter timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <span className="pill">Sent · Certified Mail</span>
                <strong>Experian dispute letter</strong>
                <span>Sent Feb 3 · Response due Mar 4</span>
              </div>
              <div className="timeline-item">
                <span className="pill">Reminder</span>
                <strong>Follow up in 7 days</strong>
                <span>We’ll notify you on Feb 25</span>
              </div>
              <div className="timeline-item">
                <span className="pill">Response</span>
                <strong>Awaiting documentation</strong>
                <span>Upload proof as soon as it arrives</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h3>What gets tracked</h3>
            <div className="list">
              <span>Recipient + delivery method</span>
              <span>Sent date + proof of mailing</span>
              <span>Response due date</span>
              <span>Overdue follow‑up prompts</span>
              <span>Response attachments</span>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <h2>How it works</h2>
        <div className="feature-strip">
          <div className="strip">
            <strong>1. Upload</strong>
            <p>Upload your report and we parse it securely.</p>
          </div>
          <div className="strip">
            <strong>2. Plan</strong>
            <p>Get a ranked plan with clear next steps.</p>
          </div>
          <div className="strip">
            <strong>3. Track</strong>
            <p>Send letters and track every deadline.</p>
          </div>
        </div>
      </section>

      <section id="kids" className="section kids-section">
        <div className="kids-header">
          <div>
            <div className="tag-row">
              <span className="tag tag-kids">Family friendly</span>
              <span className="tag tag-kids">Faith based</span>
              <span className="tag tag-kids">Printable</span>
            </div>
            <h2>Kids Bible Corner</h2>
            <p>
              A bright, welcoming space for kids to learn Bible stories with
              simple lessons, fun activities, and gentle reminders to be kind
              and brave.
            </p>
          </div>
          <div className="kids-hero-card">
            <img
              src="/kids-rainbow.svg"
              alt="Rainbow and stars illustration"
              className="kids-hero-image"
            />
            <div>
              <strong>Story of the Week</strong>
              <p>David &amp; Goliath: Courage with God on your side.</p>
              <button className="btn btn-primary">Open Kids Bible</button>
            </div>
          </div>
        </div>
        <div className="kids-grid">
          <div className="kids-card">
            <img src="/kids-ark.svg" alt="Boat on waves illustration" />
            <h3>Noah’s Ark</h3>
            <p>God keeps His promises. Learn about trust and obedience.</p>
          </div>
          <div className="kids-card">
            <img src="/kids-shepherd.svg" alt="Shepherd staff illustration" />
            <h3>The Good Shepherd</h3>
            <p>Jesus cares for every one of us, like a loving shepherd.</p>
          </div>
          <div className="kids-card">
            <img src="/kids-book.svg" alt="Open book illustration" />
            <h3>Memory Verse</h3>
            <p>“Be kind and compassionate.” Ephesians 4:32</p>
          </div>
          <div className="kids-card">
            <img src="/kids-sun.svg" alt="Smiling sun illustration" />
            <h3>Activity Time</h3>
            <p>Coloring pages, puzzles, and prayer prompts for families.</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section">
        <h2>Simple, tiered pricing</h2>
        <div className="tiers">
          <div className="tier">
            <h3>Free</h3>
            <div className="price">$0</div>
            <div className="list">
              <span>Report upload</span>
              <span>Basic action plan</span>
            </div>
            <button className="btn btn-secondary">Start free</button>
          </div>
          <div className="tier highlight">
            <h3>Pro</h3>
            <div className="price">$29</div>
            <div className="list">
              <span>AI guidance</span>
              <span>Dispute letters + tracking</span>
              <span>Reminders</span>
            </div>
            <button className="btn btn-primary">Go Pro</button>
          </div>
          <div className="tier">
            <h3>Premium</h3>
            <div className="price">$59</div>
            <div className="list">
              <span>Monitoring (when available)</span>
              <span>Partner services</span>
              <span>Priority support</span>
            </div>
            <button className="btn btn-secondary">Go Premium</button>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <h2>Start with clarity, stay on track.</h2>
        <p>
          Educational guidance only. We never guarantee a specific credit score.
        </p>
        <button className="btn btn-primary">Create your plan</button>
      </section>

      <footer className="footer">
        <span>Xtreme Credit Repair</span>
        <span>
          Educational guidance only. No credit score guarantees. Consent required
          for report access.
        </span>
      </footer>
    </main>
  );
}
