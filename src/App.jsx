import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import './App.css'
import { websiteHubApi } from './services/apiClient.js'

function App() {
  const [daysLeft, setDaysLeft] = useState(0)
  const [employeesPreview, setEmployeesPreview] = useState(null)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [employeesError, setEmployeesError] = useState('')
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  const handlePayment = async () => {
    setPaymentLoading(true)
    setPaymentError('')
    try {
      const order = await websiteHubApi.post('/create-razorpay-order', {
        amount: 399,
        currency: 'INR',
      })

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'WebsiteHub',
        description: 'Hosting Plan',
        order_id: order.id,
        handler: function (response) {
          alert('Payment successful!');
          console.log(response);
          // Here you would typically verify the payment signature on your backend
        },
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999',
        },
        notes: {
          address: 'Razorpay Corporate Office',
        },
        theme: {
          color: '#3399cc',
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        setPaymentError(response.error.description);
      });
      rzp1.open();
    } catch (e) {
      setPaymentError(`${e?.message || 'Request failed'}${e?.status ? ` (HTTP ${e.status})` : ''}`)
    } finally {
      setPaymentLoading(false)
    }
  }

  useEffect(() => {
    const KEY = 'offerDeadline'
    let deadlineMs = parseInt(localStorage.getItem(KEY) || '', 10)
    const now = Date.now()
    const DURATION = 14 * 24 * 60 * 60 * 1000 // 14 days
    if (!deadlineMs || isNaN(deadlineMs) || deadlineMs < now) {
      deadlineMs = now + DURATION
      localStorage.setItem(KEY, String(deadlineMs))
    }
    const update = () => {
      const diff = deadlineMs - Date.now()
      const days = Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)))
      setDaysLeft(days)
    }
    update()
    const id = setInterval(update, 60 * 60 * 1000) // update hourly
    return () => clearInterval(id)
  }, [])

  return (
    <>
      <Header />
      <Hero />
      <main>
        <section id="offer" className="section services">
          <div className="container">
            <header className="section-head">
              <h2>🔥 What You Get</h2>
              <p>👉 You focus on your business. We handle your website — <strong>no hidden charges</strong>.</p>
              <div className="badge offer-timer">Limited‑time offer — {daysLeft} day{daysLeft === 1 ? '' : 's'} left</div>
            </header>
            <div className="grid">
              <article className="card service"><h3>✅ Website Development – 100% FREE</h3><p>Professional design and build for your business.</p></article>
              <article className="card service"><h3>✅ Customization & Maintenance – FREE</h3><p>We handle updates, fixes, and brand tweaks at no extra cost.</p></article>
              <article className="card service"><h3>✅ 30 Days FREE Hosting</h3><p>Launch and test your site without paying a rupee.</p></article>
              <article className="card service"><h3>✅ Pay Only for Hosting</h3><p>Plans starting <strong>below ₹399/month</strong>.</p>
              <button className="btn btn-primary" onClick={handlePayment} disabled={paymentLoading}>
                  {paymentLoading ? 'Processing…' : 'Pay Now'}
                </button>
                {paymentError && <p style={{ color: 'crimson', marginTop: '0.5rem' }}>{paymentError}</p>}
              </article>
              <article className="card service"><h3>✅ Responsive & Mobile-friendly</h3><p>Looks great on phones, tablets, and desktops.</p></article>
              <article className="card service"><h3>✅ For Shops, Startups, SMBs</h3><p>Perfect for local businesses and growing brands.</p></article>
              <article className="card service">
                <h3>🔌 Backend Integration Demo</h3>
                <p>Click to fetch employees from the WebsiteHub backend (GET /Employee).</p>
                <button className="btn btn-primary" onClick={async () => {
                  setEmployeesError('')
                  setEmployeesPreview(null)
                  setLoadingEmployees(true)
                  try {
                    const data = await websiteHubApi.get('/Employee')
                    const arr = Array.isArray(data) ? data : (data?.data ?? data ?? [])
                    const preview = Array.isArray(arr) ? arr.slice(0, 3) : arr
                    setEmployeesPreview({ count: Array.isArray(arr) ? arr.length : (arr ? 1 : 0), preview })
                  } catch (e) {
                    setEmployeesError(`${e?.message || 'Request failed'}${e?.status ? ` (HTTP ${e.status})` : ''}`)
                  } finally {
                    setLoadingEmployees(false)
                  }
                }} disabled={loadingEmployees}>
                  {loadingEmployees ? 'Loading…' : 'Fetch Employees'}
                </button>
                {employeesError && <p style={{ color: 'crimson', marginTop: '0.5rem' }}>{employeesError}</p>}
                {employeesPreview && (
                  <pre style={{ marginTop: '0.5rem', maxHeight: 200, overflow: 'auto' }}>
{JSON.stringify(employeesPreview, null, 2)}
                  </pre>
                )}
              </article>
            </div>
          </div>
        </section>

        <section id="portfolio" className="section portfolio">
          <div className="container">
            <header className="section-head">
              <h2>🌐 Demo Websites</h2>
              <p>Explore live demos tailored for different businesses.</p>
            </header>
            <div className="grid gallery">
              {[
                {title: 'Home bakers', img: '/cakes.png', url: 'https://thankful-pond-07e957610.2.azurestaticapps.net'},
                {title: 'Earings and Bangles Collection', img: '/jewels.png', url: 'https://polite-wave-02da7fa10.4.azurestaticapps.net'},
                {title: 'Cloth Shop', img: '/clothes.png', url: 'https://agreeable-coast-0f0315210.1.azurestaticapps.net'},
                {title: 'Restaturant', img: '/food.png', url: 'https://gentle-pond-0f4714310.1.azurestaticapps.net'}
              ].map((item, i) => (
                <a key={i} className="card shot" href={item.url} target="_blank" rel="noopener noreferrer">
                  <img src={item.img} alt={item.title} />
                  <figcaption>
                    <h4>{item.title}</h4>
                    <span>Open demo</span>
                  </figcaption>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section process" id="process">
          <div className="container">
            <header className="section-head">
              <h2>Simple, transparent process</h2>
              <p>From discovery to launch, you’ll know exactly what’s happening.</p>
            </header>
            <ol className="steps">
              <li className="card"><h3>1. Discover</h3><p>We clarify goals, audience, and success metrics.</p></li>
              <li className="card"><h3>2. Design</h3><p>Wireframes and visuals focused on conversions and UX.</p></li>
              <li className="card"><h3>3. Build</h3><p>Performance-first development with modern tooling.</p></li>
              <li className="card"><h3>4. Launch</h3><p>Deploy, monitor, and iterate with data.</p></li>
            </ol>
          </div>
        </section>

        {/* <section className="section testimonials" id="testimonials">
          <div className="container">
            <header className="section-head">
              <h2>What clients say</h2>
              <p>Swap these with real testimonials when available.</p>
            </header>
            <div className="grid">
              {[1,2,3].map((i) => (
                <blockquote key={i} className="card quote">
                  <p>“Outstanding work. The new website boosted our leads within weeks.”</p>
                  <footer>— Client {i}, Founder</footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section> */}  

        <section id="about" className="section about">
          <div className="container">
            <div className="about-grid">
              <div>
                <h2>💡 Why Choose Us?</h2>
                <ul className="ticks">
                  <li>No upfront development cost</li>
                  <li>Affordable hosting</li>
                  <li>Quick delivery</li>
                  <li>Reliable support</li>
                </ul>
              </div>
              <img className="about-img" src="https://picsum.photos/seed/team/720/540" alt="Team working" />
            </div>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container">
            <div className="contact-card card">
              <div className="cta-copy">
                <h2>📞 Contact Now</h2>
                <ul className="ticks">
                  <li><strong>Mobile:</strong> <a href="tel:9087123723">9087123723</a></li>
                  <li><strong>Email:</strong> <a href="mailto:sathishsundharajan0609@gmail.com">sathishsundharajan0609@gmail.com</a></li>
                  <li><strong>WhatsApp:</strong> <a href="https://wa.me/9087123723" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>
                  <li><strong>Instagram:</strong> <a href="https://instagram.com/yourbrand" target="_blank" rel="noopener noreferrer">@yourbrand</a></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} WebDev Pro — High-quality websites for growing businesses.</p>
        </div>
      </footer>
    </>
  )
}

export default App
