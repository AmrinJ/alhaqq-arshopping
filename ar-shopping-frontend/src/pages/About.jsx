import { ShieldCheck, Cpu, Globe } from 'lucide-react';

const About = () => {
  return (
    <div style={{ padding: '4rem 5%', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>About ALHAQQ</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Pioneering the intersection of premium physical apparel and next-generation Augmented Reality.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
        <div className="animate-fade-in-up delay-100">
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.2 }}>Our Mission</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            We started ALHAQQ garments with a simple premise: online shopping for clothing is fundamentally broken. You guess your size, wait days for delivery, and more often than not, have to deal with the friction of returns.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
            By integrating hyper-realistic WebAR directly into your buying journey, we allow you to try on our high-quality fabrics digitally in your own space. See the fit, assess the style, and purchase with absolute confidence.
          </p>
        </div>
        <div className="animate-fade-in-up delay-200" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
           <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=80" alt="ALHAQQ Premium Boutique" style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1)', transition: 'transform 0.5s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>
      </div>

      {/* Production Process Section */}
      <div style={{ marginBottom: '6rem' }}>
        <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
           <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>How We Make Your T-Shirt</h2>
           <p style={{ color: 'var(--text-muted)' }}>A transparent look directly into our manufacturing pipeline in Tiruppur, India.</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          
          {/* Step 1 */}
          <div className="animate-fade-in-up" style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/production/step_4.png" alt="Precision Cutting" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>1. Precision Cutting</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Premium fabric rolls are carefully laid out and masterfully cut into optimal pattern pieces ensuring a perfect fit and minimal structural waste.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="animate-fade-in-up delay-100" style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/production/step_3.png" alt="Expert Stitching" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>2. Expert Stitching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Our skilled artisans seamlessly interlock the cut panels using industrial-grade machines, generating durable seams designed for daily wear.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="animate-fade-in-up delay-200" style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/production/step_2.png" alt="Graphic Detailing" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>3. Detail Printing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Using dynamic, high-pressure heat pressing and advanced print technologies to embed vibrant, non-fading graphics directly into the cloth.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="animate-fade-in-up delay-300" style={{ backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <img src="/images/production/step_1.png" alt="Ironing & QA" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>4. Pressing & QA</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>Every completed T-shirt undergoes a rigorous ironing block and strict manual quality check to guarantee flawless, wrinkle-free merchandise.</p>
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="animate-fade-in-up delay-300" style={{ padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <ShieldCheck size={48} color="var(--primary-color)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h3 style={{ marginBottom: '1rem' }}>Premium Craftsmanship</h3>
          <p style={{ color: 'var(--text-muted)' }}>We source only the finest, breathable cottons to ensure our garments feel exactly as premium as they look on-screen.</p>
        </div>
        <div className="animate-fade-in-up delay-400" style={{ padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <Cpu size={48} color="var(--accent-color)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h3 style={{ marginBottom: '1rem' }}>Proprietary AR Tech</h3>
          <p style={{ color: 'var(--text-muted)' }}>Our digital twins are mapped with exhaustive 3D precision, guaranteeing lighting and shadow accuracy on any device.</p>
        </div>
        <div className="animate-fade-in-up delay-500" style={{ padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <Globe size={48} color="var(--success-color)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h3 style={{ marginBottom: '1rem' }}>Sustainable Future</h3>
          <p style={{ color: 'var(--text-muted)' }}>By eliminating sizing guesswork, we drastically reduce carbon emissions caused by reverse logistics and continuous returns.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
