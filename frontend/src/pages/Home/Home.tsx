// pages/Home/Home.tsx
import React, { CSSProperties } from 'react';
import { 
  Code, 
  Database, 
  Mail, 
  Phone, 
  Sun, 
  Moon, 
  Languages,
  ExternalLink,
  CheckCircle,
  Star,
  Users,
  Zap,
  Shield,
  BarChart3,
  TreePine,
  Link2 as LinkIcon,
  Activity,
  GitBranch
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// Theme Colors Type
interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
}

// Custom hook for language
// const useLanguage = () => {
//   const [language, setLanguage] = useState<'en' | 'th'>('en');

//   const toggleLanguage = () => {
//     setLanguage(prev => prev === 'en' ? 'th' : 'en');
//   };

//   const t = (key: string): string => {
//     return translations[language][key as keyof typeof translations['en']] || key;
//   };

//   return { language, toggleLanguage, t };
// };

// Theme colors utility
const getThemeColors = (themeMode: 'light' | 'dark'): ThemeColors => {
  if (themeMode === 'light') {
    return {
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      primary: '#6366f1'
    };
  }
  return {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#818cf8'
  };
};

// Styles
const styles = {
  container: (maxWidth: string): CSSProperties => ({
    maxWidth,
    margin: '0 auto',
    padding: '0 24px'
  }),
  
  flexCenter: (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  
  flexBetween: (): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }),
  
  grid: (cols: number, gap: number = 24): CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: `${gap}px`,
    width: '100%'
  }),
  
  card: (colors: ThemeColors): CSSProperties => ({
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '12px',
    padding: '24px',
    transition: 'all 0.3s ease'
  }),
  
  button: (bgColor: string): CSSProperties => ({
    backgroundColor: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'opacity 0.3s ease',
    fontSize: '14px',
    fontWeight: '500'
  }),
  
  iconContainer: (bgColor: string, size: number = 48): CSSProperties => ({
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: bgColor,
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  }),
  
  gradientText: (): CSSProperties => ({
    background: 'linear-gradient(to right, #6366f1, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  })
};

// Header Component
const Header: React.FC = () => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);
  const headerStyle: CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: `${colors.background}cc`,
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${colors.border}`,
    transition: 'all 0.3s ease'
  };
  const logoStyle: CSSProperties = {
    ...styles.flexCenter(),
    gap: '12px'
  };
  return (
    <header style={headerStyle}>
      <div style={{...styles.container('1280px'), ...styles.flexBetween(), padding: '16px 24px'}}>
        <div style={logoStyle}>
          <div style={styles.iconContainer(colors.primary, 40)}>
            <Code size={24} color="white" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: colors.text,
              margin: 0 
            }}>
              Algorithm Test
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: colors.textSecondary,
              margin: 0 
            }}>
              Programming
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Component
const Hero: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);

  const heroStyle: CSSProperties = {
    padding: '80px 24px',
    textAlign: 'center'
  };

  const titleStyle: CSSProperties = {
    ...styles.gradientText(),
    fontSize: 'clamp(3rem, 8vw, 6rem)',
    fontWeight: 'bold',
    marginBottom: '24px',
    lineHeight: 1.1
  };

  const subtitleStyle: CSSProperties = {
    fontSize: 'clamp(1.25rem, 4vw, 2rem)',
    color: colors.textSecondary,
    maxWidth: '768px',
    margin: '0 auto 48px auto'
  };

  const badgesStyle: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '48px'
  };

  const badgeStyle: CSSProperties = {
    ...styles.flexCenter(),
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: '9999px'
  };

  return (
    <section style={heroStyle}>
      <div style={styles.container('1280px')}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={titleStyle}>
            {t('home.title')}
          </h1>
          <p style={subtitleStyle}>
            {t('home.subtitle')}
          </p>
        </div>
        
        <div style={badgesStyle}>
          <div style={badgeStyle}>
            <CheckCircle size={20} color="#10b981" />
            <span style={{ color: colors.text }}>
              5 {t('home.completedProblems')}
            </span>
          </div>
          <div style={badgeStyle}>
            <Star size={20} color="#f59e0b" />
            <span style={{ color: colors.text }}>
              100% {t('home.testCases')}
            </span>
          </div>
          <div style={badgeStyle}>
            <BarChart3 size={20} color="#3b82f6" />
            <span style={{ color: colors.text }}>
              AAA+ {t('home.codeQuality')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

// TechStack Component
const TechStack: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);

  const technologies = [
    { name: 'FastAPI', img: '/home/fastapi.png', color: '#009688' },
    { name: 'MinIO', img: '/home/minio.png', color: '#C72E49' },
    { name: 'React', img: '/home/react.png', color: '#61DAFB' },
    { name: 'PostgreSQL', img: '/home/postgressql.png', color: '#336791' }
  ];

  const sectionStyle: CSSProperties = {
    padding: '64px 24px'
  };

  const titleStyle: CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '48px',
    color: colors.text
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px'
  };

  const techCardStyle: CSSProperties = {
    ...styles.card(colors),
    textAlign: 'center',
    cursor: 'pointer'
  };

  return (
    <section style={sectionStyle}>
      <div style={styles.container('1280px')}>
        <h2 style={titleStyle}>
          {t('home.techStack')}
        </h2>
        
        <div style={gridStyle}>
          {technologies.map((tech, index) => (
            <div
              key={index}
              style={techCardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                ...styles.iconContainer(`${tech.color}20`, 64),
                margin: '0 auto 16px auto',
                background: 'none',
                boxShadow: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0
              }}>
                <img src={tech.img} alt={tech.name} style={{ width: 72, height: 72, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: colors.text,
                margin: 0
              }}>
                {tech.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ProjectCard Component
const ProjectCard: React.FC<{
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  color: string;
  t: (key: string) => string;
  demoUrl: string;
}> = ({ title, description, icon: Icon, features, color, t, demoUrl }) => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);

  const cardStyle: CSSProperties = {
    ...styles.card(colors),
    cursor: 'pointer'
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '16px'
  };

  const titleTextStyle: CSSProperties = {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: colors.text
  };

  const descStyle: CSSProperties = {
    fontSize: '14px',
    lineHeight: 1.6,
    color: colors.textSecondary
  };

  const featuresStyle: CSSProperties = {
    marginBottom: '16px'
  };

  const featureItemStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={headerStyle}>
        <div style={styles.iconContainer(`${color}20`, 48)}>
          <Icon size={24} color={color} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={titleTextStyle}>
            {title}
          </h3>
          <p style={descStyle}>
            {description}
          </p>
        </div>
      </div>
      
      <div style={featuresStyle}>
        <h4 style={{
          fontSize: '14px',
          fontWeight: '600',
          color: colors.text,
          marginBottom: '8px'
        }}>
          {t('home.keyFeatures')}:
        </h4>
        {features.map((feature, index) => (
          <div key={index} style={featureItemStyle}>
            <CheckCircle size={16} color="#10b981" />
            <span style={{
              fontSize: '14px',
              color: colors.textSecondary
            }}>
              {feature}
            </span>
          </div>
        ))}
      </div>
      
      <a
        href={demoUrl}
        style={{
          ...styles.button(color),
          width: '100%',
          padding: '12px 16px',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = '0.9';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.opacity = '1';
        }}
      >
        <ExternalLink size={16} />
        <span>{t('home.viewDemo')}</span>
      </a>
    </div>
  );
};

// Projects Component
const Projects: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);

  const projects = [
    {
      title: t('home.turtleProblem'),
      description: t('home.turtleDesc'),
      icon: Activity,
      color: '#10b981',
      features: [
        'Zig-zag matrix traversal',
        'Spiral clockwise navigation', 
        'Shortest/longest pathfinding',
        'Object-oriented design'
      ],
      demoUrl: '/solution-1'
    },
    {
      title: t('home.squirrelProblem'),
      description: t('home.squirrelDesc'),
      icon: TreePine,
      color: '#f59e0b',
      features: [
        'Tree data structure parsing',
        'Energy-efficient algorithms',
        'Breadth-first traversal',
        'Capacity optimization'
      ],
      demoUrl: '/solution-2'
    },
    {
      title: t('home.urlShortener'),
      description: t('home.urlDesc'),
      icon: LinkIcon,
      color: '#3b82f6',
      features: [
        'URL shortening service',
        'Click analytics',
        'Security measures',
        'Scalable architecture'
      ],
      demoUrl: '/solution-3'
    },
    {
      title: t('home.rateLimit'),
      description: t('home.rateLimitDesc'),
      icon: Shield,
      color: '#8b5cf6',
      features: [
        'Microservices architecture',
        'Rate limiting algorithms',
        'Real-time monitoring',
        'Throttling mechanisms'
      ],
      demoUrl: '/solution-4'
    },
    {
      title: t('home.fullStack'),
      description: t('home.fullStackDesc'),
      icon: Users,
      color: '#ef4444',
      features: [
        'REST API development',
        'Database integration',
        'React frontend',
        'CRUD operations'
      ],
      demoUrl: '/solution-5'
    }
  ];

  const sectionStyle: CSSProperties = {
    padding: '64px 24px'
  };

  const titleStyle: CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '48px',
    color: colors.text
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px'
  };

  return (
    <section style={sectionStyle}>
      <div style={styles.container('1280px')}>
        <h2 style={titleStyle}>
          {t('home.projects')}
        </h2>
        
        <div style={gridStyle}>
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} t={t} demoUrl={project.demoUrl} />
          ))}
        </div>
      </div>
    </section>
  );
};

// PersonalInfo Component
const PersonalInfo: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);

  const sectionStyle: CSSProperties = {
    padding: '64px 24px'
  };

  const titleStyle: CSSProperties = {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '48px',
    color: colors.text
  };

  const cardStyle: CSSProperties = {
    ...styles.card(colors),
    padding: '32px'
  };

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px'
  };

  const infoItemStyle: CSSProperties = {
    ...styles.flexCenter(),
    gap: '12px',
    alignItems: 'flex-start'
  };

  return (
    <section style={sectionStyle}>
      <div style={styles.container('1024px')}>
        <h2 style={titleStyle}>
          {t('home.personalInfo')}
        </h2>
        
        <div style={cardStyle}>
          <div style={gridStyle}>
            <div style={infoItemStyle}>
              <Mail size={24} color={colors.primary} />
              <div>
                <p style={{
                  fontWeight: '600',
                  color: colors.text,
                  margin: '0 0 4px 0'
                }}>
                  {t('home.email')}
                </p>
                <p style={{
                  color: colors.textSecondary,
                  margin: 0
                }}>
                  delpattaradanai@gmail.com
                </p>
              </div>
            </div>
            
            <div style={infoItemStyle}>
              <Phone size={24} color={colors.primary} />
              <div>
                <p style={{
                  fontWeight: '600',
                  color: colors.text,
                  margin: '0 0 4px 0'
                }}>
                  {t('home.phone')}
                </p>
                <p style={{
                  color: colors.textSecondary,
                  margin: 0
                }}>
                  +66 86-347-1335
                </p>
              </div>
            </div>
            
            <div style={infoItemStyle}>
              <GitBranch size={24} color={colors.primary} />
              <div>
                <p style={{
                  fontWeight: '600',
                  color: colors.text,
                  margin: '0 0 4px 0'
                }}>
                  {t('home.github')}
                </p>
                <a
                  href="https://github.com/Delta525312/interview"
                  style={{
                    color: '#3b82f6',
                    margin: 0,
                    textDecoration: 'underline',
                    wordBreak: 'break-all',
                    fontWeight: 500
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/Delta525312/interview
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const { themeMode } = useTheme();
  const colors = getThemeColors(themeMode);

  const footerStyle: CSSProperties = {
    padding: '32px 24px',
    backgroundColor: colors.surface,
    borderTop: `1px solid ${colors.border}`,
    textAlign: 'center'
  };

  return (
    <footer style={footerStyle}>
      <div style={styles.container('1280px')}>
        <p style={{ 
          color: colors.textSecondary,
          margin: 0 
        }}>
          © 2025 Algorithm Test Portfolio. Built with React & TypeScript.
        </p>
      </div>
    </footer>
  );
};

// Main Home Component
export const AlgorithmTestHome: React.FC = () => {
  const { themeMode } = useTheme();
  const { t } = useTranslation();
  const colors = getThemeColors(themeMode);

  const appStyle: CSSProperties = {
    minHeight: '100vh',
    backgroundColor: colors.background,
    transition: 'all 0.3s ease'
  };

  return (
    <div style={appStyle}>
      <Header />
      <Hero t={t} />
      <TechStack t={t} />
      <Projects t={t} />
      <PersonalInfo t={t} />
      <Footer />
    </div>
  );
};

export default AlgorithmTestHome;