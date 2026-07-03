import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, ViewChildren, QueryList,
  HostListener, NgZone
} from '@angular/core';
import { SeoService } from 'src/app/services/seo.service';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Particle struct ───
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  baseX: number; baseY: number;
  color: string;
  alpha: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  // ─── Canvas refs ───
  @ViewChild('particleCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animFrameId = 0;

  // ─── Element refs ───
  @ViewChild('statusBadge') statusBadge!: ElementRef;
  @ViewChild('headlineWrapper') headlineWrapper!: ElementRef;
  @ViewChild('headlineLine1') headlineLine1!: ElementRef;
  @ViewChild('headlineLine2') headlineLine2!: ElementRef;
  @ViewChild('tagline') tagline!: ElementRef;
  @ViewChild('ctaCluster') ctaCluster!: ElementRef;
  @ViewChild('scrollBeacon') scrollBeacon!: ElementRef;
  @ViewChild('dynamicText') dynamicText!: ElementRef;

  @ViewChild('statOrb1') statOrb1!: ElementRef;
  @ViewChild('statOrb2') statOrb2!: ElementRef;
  @ViewChild('statOrb3') statOrb3!: ElementRef;
  @ViewChild('orbNum1') orbNum1!: ElementRef;
  @ViewChild('orbNum2') orbNum2!: ElementRef;
  @ViewChild('orbNum3') orbNum3!: ElementRef;

  @ViewChild('techDnaSection') techDnaSection!: ElementRef;
  @ViewChild('techHeader') techHeader!: ElementRef;
  @ViewChild('techTrack') techTrack!: ElementRef;
  @ViewChild('dnaCard1') dnaCard1!: ElementRef;
  @ViewChild('dnaCard2') dnaCard2!: ElementRef;
  @ViewChild('dnaCard3') dnaCard3!: ElementRef;
  @ViewChild('dnaCard4') dnaCard4!: ElementRef;

  @ViewChild('experienceSection') experienceSection!: ElementRef;
  @ViewChild('expHeader') expHeader!: ElementRef;
  @ViewChild('timelineLine') timelineLine!: ElementRef;

  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('projHeader') projHeader!: ElementRef;

  @ViewChildren('expCard') expCards!: QueryList<ElementRef>;
  @ViewChildren('projectCard') projectCards!: QueryList<ElementRef>;

  // ─── Mouse tracking ───
  mouseX = 0;
  mouseY = 0;
  private targetMouseX = 0;
  private targetMouseY = 0;

  // ─── Interactive Bento & Card States ───
  activeAgentIndex = 0;
  private agentInterval: any;

  // Sparqal Orbit Simulation
  orbitLogs: string[] = [
    'SYSTEM READY // Waiting for user command...'
  ];
  isSimulatingOrbit = false;
  private simulationTimeout: any;

  // V&S Apparel Geo Routing Simulation
  activeGeoNode = 0;
  private geoInterval: any;

  // Payment approval step
  activeApprovalStep = 2; // VP review is active
  private approvalInterval: any;

  // ─── Data ───
  headlineChars1: string[] = [];
  headlineChars2: string[] = [];

  currentRole = '';
  private roles = [
    'scalable systems & full-stack applications',
    'autonomous agentic AI workflows',
    'high-throughput backend APIs',
    'cloud-native serverless pipelines',
    'secure enterprise architectures'
  ];
  private roleIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private typeTimeout: any;

  frontendTechs = ['Angular 19', 'React', 'Vue.js', 'TypeScript', 'TailwindCSS', 'RxJS'];
  backendTechs = ['.NET 9', 'Node.js', 'REST APIs', 'Entity Framework', 'SQL Server', 'MongoDB'];
  cloudTechs = ['Azure DevOps', 'GitHub Actions', 'AWS', 'Docker', 'CI/CD', 'DigitalOcean'];
  aiTechs = ['Agentic AI', 'Multi-Agent Systems', 'LLM Orchestration', 'RAG Pipelines', 'Automation'];

  experiences = [
    {
      company: 'Sparqal Systems',
      role: 'Senior Software Engineer · Agentic AI & SaaS',
      date: 'Dec 2025 — Present',
      type: 'Senior',
      description: 'Lead the end-to-end engineering of full-stack applications and enterprise-grade AI automation systems, accelerating delivery velocity by 25% through optimized dev workflows. Architected Sparqal Orbit, a multi-tenant platform for Instagram automation and AI content scheduling.',
      highlights: [
        'VPC-isolated multi-tenant architectures (AWS/DigitalOcean)',
        'Multi-agent LLM workflows reducing content generation time by 60%',
        'V&S Apparel (geo-routed e-commerce) & GreenStream Accounts portal',
        'Maintained 99.9% uptime SLA across global client production deployments'
      ]
    },
    {
      company: 'Utterwise Technologies',
      role: 'Senior Software Engineer · FinTech Infrastructure',
      date: 'Aug 2025 — Dec 2025',
      type: 'Senior',
      description: 'Led the large-scale restructuring of a legacy banking platform for JJIT Fintech. Redesigned core modules for improved horizontal scalability and strict financial compliance.',
      highlights: [
        'Technical lead for restructuring legacy banking platform for JJIT Fintech',
        'Redesigned 12 core modules to ensure high-throughput transaction processing',
        'Optimized complex database queries & indexing to reduce API latency',
        'Collaborated with compliance officers to align systems with banking regulations'
      ]
    },
    {
      company: 'Xperate Systems',
      role: 'Senior Software Developer · LegalTech & Enterprise',
      date: 'Dec 2022 — May 2025',
      type: 'Senior',
      description: 'Delivered 8+ production-ready solutions for global law firms. Facilitated the transition from VB.NET to .NET 9 for high-scale customer portals.',
      highlights: [
        'Delivered 8+ enterprise LegalTech applications serving national law networks',
        'Migrated legacy VB.NET Customer Portal to .NET 9/C# (20+ REST APIs)',
        'Architected 5-stage Payment Approval system featuring Windows Auth',
        'Built speech-processing middleware integrating Philips SpeechLive with Actionstep'
      ]
    },
    {
      company: 'Siddhatech Software Services',
      role: 'Software Developer · Angular & Vue.js Ecosystem',
      date: 'Oct 2021 — Dec 2022',
      type: 'Developer',
      description: 'Engineered frontend architectures for HRMS, Finance, and Logistics sectors. Modernized legacy AngularJS platforms to Vue.js for top-tier financial clients. Implemented Cypress E2E suites for mission-critical stability.',
      highlights: [
        'Developed responsive user interfaces in Angular and Vue.js for 5 production systems',
        'Migrated AngularJS to Vue.js for Pagatodo (FinTech), boosting page speeds by 45%',
        'Introduced Cypress E2E pipelines, achieving 85% coverage and reducing bugs by 60%',
        'Designed Figma wireframes and built 15+ core views for ART HRMS'
      ]
    }
  ];

  // Magnetic button refs
  private magneticBtns: ElementRef[] = [];

  // Project inner refs stored after view init
  private projectInners: HTMLElement[] = [];

  constructor(
    private seo: SeoService,
    private analytics: AnalyticsService,
    private zone: NgZone,
    private el: ElementRef
  ) {
    this.headlineChars1 = 'KAUSHAL'.split('');
    this.headlineChars2 = 'SHAH.'.split('');
  }

  ngOnInit(): void {
    this.seo.updateSeoData({
      title: 'Senior Software Developer | Kaushal Shah | Pune, India',
      description: 'Senior Software Developer in Pune with 4.5+ years of experience in FinTech, SaaS, and AI. Specialist in .NET 9, Angular 19, and scalable system architectures.',
      keywords: 'Senior Software Developer Pune, Senior Software Engineer Pune, Full Stack Developer Pune, Angular Expert Pune, .NET 9 Developer, Agentic AI Engineer, Kaushal Shah Portfolio, Software Architect Pune, Pune Tech Lead',
      url: 'https://mrkaushalshah.com',
      image: 'https://mrkaushalshah.com/assets/dp.png'
    });
  }

  ngAfterViewInit(): void {
    // Collect project inner elements
    this.projectInners = Array.from(
      this.el.nativeElement.querySelectorAll('.project-card-inner')
    );

    this.initCanvas();
    this.startParticleLoop();
    this.setupHeroAnimations();
    this.setupScrollAnimations();
    this.startBentoSimulations();

    // Start typing effect after tick to avoid NG0100 error
    setTimeout(() => this.startTypingEffect(), 0);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    clearTimeout(this.typeTimeout);
    clearTimeout(this.simulationTimeout);
    clearInterval(this.agentInterval);
    clearInterval(this.geoInterval);
    clearInterval(this.approvalInterval);
    ScrollTrigger.getAll().forEach(t => t.kill());
  }

  // ═══════════════════════════════════════════════════════════════
  // PARTICLE SYSTEM
  // ═══════════════════════════════════════════════════════════════
  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    this.ctx = canvas.getContext('2d')!;

    const isMobile = window.innerWidth <= 768;
    const maxParticles = isMobile ? 50 : 150;
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), maxParticles);
    this.particles = [];

    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      this.particles.push({
        x, y,
        baseX: x, baseY: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.7 ? '#10b981' : '#ffffff',
        alpha: Math.random() * 0.4 + 0.1
      });
    }
  }

  private startParticleLoop(): void {
    this.zone.runOutsideAngular(() => {
      const loop = () => {
        this.drawParticles();
        this.animFrameId = requestAnimationFrame(loop);
      };
      loop();
    });
  }

  private drawParticles(): void {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lerp mouse for smooth glow follow
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.08;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.08;

    for (const p of this.particles) {
      // Mouse repulsion
      const dx = p.x - this.targetMouseX;
      const dy = p.y - this.targetMouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist;
        p.x += dx * force * 0.03;
        p.y += dy * force * 0.03;
      }

      // Spring back to base
      p.x += (p.baseX - p.x) * 0.01;
      p.y += (p.baseY - p.y) * 0.01;

      // Drift
      p.x += p.vx;
      p.y += p.vy;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    }

    // Draw connections
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  @HostListener('window:resize')
  onResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.parentElement!.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }

  // ═══════════════════════════════════════════════════════════════
  // MOUSE INTERACTION
  // ═══════════════════════════════════════════════════════════════
  onMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.targetMouseX = event.clientX - rect.left;
    this.targetMouseY = event.clientY - rect.top;
  }

  onMouseLeave(): void {
    this.targetMouseX = -1000;
    this.targetMouseY = -1000;
  }

  // Character hover
  onCharHover(event: Event): void {
    const el = event.target as HTMLElement;
    gsap.to(el, {
      y: -10,
      scale: 1.15,
      color: '#10b981',
      duration: 0.3,
      ease: 'back.out(3)'
    });
  }

  onCharLeave(event: Event): void {
    const el = event.target as HTMLElement;
    gsap.to(el, {
      y: 0,
      scale: 1,
      color: '',
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // MAGNETIC BUTTONS
  // ═══════════════════════════════════════════════════════════════
  onMagneticMove(event: MouseEvent, index: number): void {
    const btn = event.currentTarget as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  onMagneticLeave(index: number): void {
    const btns = this.el.nativeElement.querySelectorAll('.cta-magnetic');
    if (btns[index]) {
      gsap.to(btns[index], {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ORB INTERACTIONS
  // ═══════════════════════════════════════════════════════════════
  onOrbHover(event: Event, index: number): void {
    const el = (event.target as HTMLElement).closest('.stat-orb') as HTMLElement;
    gsap.to(el, { scale: 1.15, duration: 0.4, ease: 'back.out(2)' });
  }

  onOrbLeave(index: number): void {
    const orbs = this.el.nativeElement.querySelectorAll('.stat-orb');
    gsap.to(orbs[index], { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  }

  // ═══════════════════════════════════════════════════════════════
  // EXP CARD INTERACTIONS
  // ═══════════════════════════════════════════════════════════════
  onExpCardHover(event: Event, index: number): void { /* handled by CSS */ }
  onExpCardLeave(index: number): void { /* handled by CSS */ }

  // ═══════════════════════════════════════════════════════════════
  // 3D TILT FOR PROJECT CARDS
  // ═══════════════════════════════════════════════════════════════
  onProjectTilt(event: MouseEvent, index: number): void {
    const inner = this.projectInners[index];
    if (!inner) return;

    const rect = inner.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -6;
    const rotateY = (x - centerX) / centerX * 6;

    gsap.to(inner, {
      rotateX,
      rotateY,
      boxShadow: `${rotateY * 2}px ${-rotateX * 2}px 40px rgba(16, 185, 129, 0.1)`,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1200
    });
  }

  onProjectTiltReset(index: number): void {
    const inner = this.projectInners[index];
    if (!inner) return;

    gsap.to(inner, {
      rotateX: 0,
      rotateY: 0,
      boxShadow: 'none',
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)'
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // HERO ENTRANCE ANIMATIONS
  // ═══════════════════════════════════════════════════════════════
  private setupHeroAnimations(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Status badge
    tl.to(this.statusBadge.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: 0.3
    });

    // Headline chars stagger — use set+to for reliability with Angular ngFor
    const chars1 = this.headlineLine1.nativeElement.querySelectorAll('.headline-word');
    const chars2 = this.headlineLine2.nativeElement.querySelectorAll('.headline-word');

    gsap.set(chars1, { y: 80, opacity: 0 });
    gsap.set(chars2, { y: 80, opacity: 0 });

    tl.to(chars1, {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    tl.to(chars2, {
      y: 0,
      opacity: 1,
      stagger: 0.06,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.5');

    // Tagline
    tl.to(this.tagline.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, '-=0.3');

    // CTA cluster
    tl.to(this.ctaCluster.nativeElement, {
      opacity: 1,
      y: 0,
      duration: 0.6
    }, '-=0.2');

    // Stat orbs
    const orbs = [this.statOrb1, this.statOrb2, this.statOrb3];
    orbs.forEach((orb, i) => {
      tl.to(orb.nativeElement, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(2)',
        delay: i * 0.15
      }, '-=0.4');
    });

    // Animated counter for orb numbers
    this.animateCounter(this.orbNum1.nativeElement, 4.5, 1.5, '+');
    this.animateCounter(this.orbNum2.nativeElement, 20, 2, '+');
    this.animateCounter(this.orbNum3.nativeElement, 15, 2, '+');

    // Scroll beacon
    tl.to(this.scrollBeacon.nativeElement, {
      opacity: 1,
      duration: 0.8
    }, '-=0.2');
  }

  private animateCounter(el: HTMLElement, target: number, duration: number, suffix: string): void {
    const isDecimal = target % 1 !== 0;
    gsap.to({ val: 0 }, {
      val: target,
      duration,
      delay: 1,
      ease: 'power2.out',
      onUpdate: function () {
        const v = (this as any).targets()[0].val;
        el.textContent = (isDecimal ? v.toFixed(1) : Math.floor(v)) + suffix;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // SCROLL-TRIGGERED ANIMATIONS
  // ═══════════════════════════════════════════════════════════════
  private setupScrollAnimations(): void {
    // Tech DNA section
    gsap.to(this.techHeader.nativeElement, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: this.techDnaSection.nativeElement,
        start: 'top 80%'
      }
    });

    const dnaCards = [this.dnaCard1, this.dnaCard2, this.dnaCard3, this.dnaCard4];
    dnaCards.forEach((card, i) => {
      gsap.to(card.nativeElement, {
        opacity: 1, y: 0, duration: 0.7,
        delay: i * 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: this.techDnaSection.nativeElement,
          start: 'top 70%'
        }
      });
    });

    // Experience section
    gsap.to(this.expHeader.nativeElement, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: this.experienceSection.nativeElement,
        start: 'top 80%'
      }
    });

    // Timeline line grow
    gsap.to(this.timelineLine.nativeElement, {
      height: '100%',
      duration: 2,
      ease: 'none',
      scrollTrigger: {
        trigger: this.experienceSection.nativeElement,
        start: 'top 60%',
        end: 'bottom 40%',
        scrub: 1
      }
    });

    // Exp cards stagger
    setTimeout(() => {
      this.expCards.forEach((card, i) => {
        gsap.to(card.nativeElement, {
          opacity: 1,
          x: 0,
          duration: 0.7,
          delay: i * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card.nativeElement,
            start: 'top 85%'
          }
        });
      });
    });

    // Projects section
    gsap.to(this.projHeader.nativeElement, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: {
        trigger: this.projectsSection.nativeElement,
        start: 'top 80%'
      }
    });

    setTimeout(() => {
      this.projectCards.forEach((card, i) => {
        gsap.to(card.nativeElement, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card.nativeElement,
            start: 'top 85%'
          }
        });
      });
    });

    // Set initial states for scroll elements
    gsap.set(this.techHeader.nativeElement, { y: 40 });
    gsap.set(dnaCards.map(c => c.nativeElement), { y: 60 });
    gsap.set(this.expHeader.nativeElement, { y: 40 });
    gsap.set(this.projHeader.nativeElement, { y: 40 });

    setTimeout(() => {
      this.expCards.forEach(card => {
        gsap.set(card.nativeElement, { x: -40 });
      });
      this.projectCards.forEach(card => {
        gsap.set(card.nativeElement, { y: 60 });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // TYPING EFFECT
  // ═══════════════════════════════════════════════════════════════
  private startTypingEffect(): void {
    const currentWord = this.roles[this.roleIndex];
    const speed = this.isDeleting ? 40 : 80;

    if (!this.isDeleting) {
      this.currentRole = currentWord.substring(0, this.charIndex + 1);
      this.charIndex++;

      if (this.charIndex === currentWord.length) {
        this.isDeleting = true;
        this.typeTimeout = setTimeout(() => this.startTypingEffect(), 2000);
        return;
      }
    } else {
      this.currentRole = currentWord.substring(0, this.charIndex - 1);
      this.charIndex--;

      if (this.charIndex === 0) {
        this.isDeleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      }
    }

    this.typeTimeout = setTimeout(() => this.startTypingEffect(), speed);
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  downloadResume(): void {
    this.analytics.sendEvent('button_click', {
      button_name: 'Download Resume',
      location: 'Hero Section'
    });
    window.open('https://drive.google.com/file/d/14tGGhlNSUE9oNGNwUumY2STr0jn3r3Qn/view', '_blank');
  }

  openLinkedIn(): void {
    this.analytics.sendEvent('button_click', {
      button_name: 'LinkedIn Profile',
      location: 'Hero Section'
    });
    window.open('https://www.linkedin.com/in/mrkaushalshah/', '_blank');
  }

  // ─── BENTO & PROJECT CARD SIMULATIONS ───
  startBentoSimulations(): void {
    // 1. Agent cycle in Bento Grid
    this.agentInterval = setInterval(() => {
      this.activeAgentIndex = (this.activeAgentIndex + 1) % 4;
    }, 3000);

    // 2. E-commerce geo-node toggle
    this.geoInterval = setInterval(() => {
      this.activeGeoNode = (this.activeGeoNode + 1) % 2;
    }, 2500);

    // 3. Payment Approval workflow cycle
    this.approvalInterval = setInterval(() => {
      this.activeApprovalStep = (this.activeApprovalStep + 1);
      if (this.activeApprovalStep > 4) {
        this.activeApprovalStep = 0;
      }
    }, 4000);
  }

  // Orbit AI Agent Log simulation
  runOrbitSimulation(): void {
    if (this.isSimulatingOrbit) return;
    this.isSimulatingOrbit = true;
    this.orbitLogs = ['SYSTEM // Starting multi-agent campaign simulation...'];

    const simulationSteps = [
      { text: 'AGENT_ORBIT // Fetching brand assets & target audience context...', delay: 1000 },
      { text: 'LLM_GEN // Content outline draft created: "Next-Gen AI Systems"', delay: 2000 },
      { text: 'IMAGE_AGENT // Running text-to-image prompt: "glowing server matrix"', delay: 3500 },
      { text: 'SCHEDULER // Uploading content nodes to Instagram graph API queue...', delay: 5000 },
      { text: 'VPC_SUCCESS // Content scheduled successfully for 18:00 UTC.', delay: 6500 },
      { text: 'SYSTEM READY // Simulation finished. Loop idle.', delay: 8000 }
    ];

    simulationSteps.forEach(step => {
      this.simulationTimeout = setTimeout(() => {
        this.orbitLogs.push(step.text);
        if (this.orbitLogs.length > 5) {
          this.orbitLogs.shift();
        }
        if (step.text.includes('SYSTEM READY')) {
          this.isSimulatingOrbit = false;
        }
      }, step.delay);
    });
  }

  openLiveSite(): void {
    window.open('https://voting.mrkaushalshah.com', '_blank');
  }
}
