// client/src/pages/About.jsx
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Про <span style={styles.highlight}>PetMarket</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Ми об'єднуємо людей та тварин, створюючи щасливі родини з 2020 року
          </p>
        </div>
      </section>

      <section style={styles.storySection}>
        <div style={styles.storyGrid}>
          <div style={styles.storyImage}>
            <div style={styles.imageCircle}>
              <span style={styles.storyEmoji}>🐾</span>
            </div>
          </div>
          <div style={styles.storyText}>
            <h2 style={styles.storyTitle}>Наша історія</h2>
            <p style={styles.storyParagraph}>
              PetMarket народився з простої ідеї: кожна тварина заслуговує на люблячу родину, 
              а кожна родина — на можливість знайти ідеального чотирилапого друга.
            </p>
            <p style={styles.storyParagraph}>
              Засновники платформи самі пройшли складний шлях пошуку улюбленця через безліч 
              притулків та оголошень. Тоді й виникла ідея створити єдиний простір, де всиновлення 
              стане простим, безпечним та прозорим процесом.
            </p>
            <p style={styles.storyParagraph}>
              Сьогодні ми пишаємося тим, що допомогли знайти дім для понад 2,500 тварин 
              та об'єднали більше 150 притулків і ліцензованих розвідників по всій Україні.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.missionSection}>
        <div style={styles.missionGrid}>
          <div style={styles.missionCard}>
            <div style={styles.missionIcon}>🎯</div>
            <h3 style={styles.missionCardTitle}>Наша місія</h3>
            <p style={styles.missionCardText}>
              Створити безпечний та зручний простір для всиновлення тварин, де кожна 
              тварина може знайти турботливу родину, а кожна сім'я — вірного друга на все життя.
            </p>
          </div>
          
          <div style={styles.missionCard}>
            <div style={styles.missionIcon}>🌟</div>
            <h3 style={styles.missionCardTitle}>Наше бачення</h3>
            <p style={styles.missionCardText}>
              Світ, де кожна тварина має дім, де немає безпритульних улюбленців, 
              а відповідальне ставлення до тварин стає нормою для всього суспільства.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.valuesSection}>
        <h2 style={styles.sectionTitle}>Наші цінності</h2>
        <p style={styles.sectionSubtitle}>
          Принципи, якими ми керуємося у своїй роботі
        </p>
        
        <div style={styles.valuesGrid}>
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>💚</div>
            <h3 style={styles.valueTitle}>Турбота про тварин</h3>
            <p style={styles.valueText}>
              Добробут тварин — наш головний пріоритет. Ми ретельно перевіряємо 
              кожен притулок та розвідника, щоб гарантувати гідні умови утримання.
            </p>
          </div>
          
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🤝</div>
            <h3 style={styles.valueTitle}>Прозорість</h3>
            <p style={styles.valueText}>
              Чесність у всьому: від історії тварини до умов всиновлення. 
              Жодних прихованих платежів чи неочікуваних сюрпризів.
            </p>
          </div>
          
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🛡️</div>
            <h3 style={styles.valueTitle}>Безпека</h3>
            <p style={styles.valueText}>
              Захищені транзакції, перевірені партнери, юридично оформлені договори — 
              ваш спокій і безпека тварини для нас найважливіше.
            </p>
          </div>
          
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🎓</div>
            <h3 style={styles.valueTitle}>Освіта</h3>
            <p style={styles.valueText}>
              Ми навчаємо відповідальному ставленню до тварин, надаємо консультації 
              та підтримуємо власників на кожному етапі.
            </p>
          </div>
          
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>🌍</div>
            <h3 style={styles.valueTitle}>Соціальна відповідальність</h3>
            <p style={styles.valueText}>
              Частина нашого прибутку йде на підтримку притулків, 
              фінансування медичної допомоги та програм стерилізації.
            </p>
          </div>
          
          <div style={styles.valueCard}>
            <div style={styles.valueIcon}>👥</div>
            <h3 style={styles.valueTitle}>Спільнота</h3>
            <p style={styles.valueText}>
              Ми будуємо дружню спільноту власників, де можна ділитися досвідом, 
              порадами та радістю від спілкування з улюбленцями.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.impactSection}>
        <h2 style={styles.impactTitle}>Наш вплив</h2>
        <p style={styles.impactSubtitle}>
          Разом ми робимо світ кращим для тварин
        </p>
        
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>2,500+</div>
            <div style={styles.statLabel}>Щасливих всиновлень</div>
            <p style={styles.statDesc}>
              Тварин знайшли свій дім завдяки нашій платформі
            </p>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statNumber}>150+</div>
            <div style={styles.statLabel}>Партнерів</div>
            <p style={styles.statDesc}>
              Притулків та ліцензованих розвідників у нашій мережі
            </p>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statNumber}>5,000+</div>
            <div style={styles.statLabel}>Активних користувачів</div>
            <p style={styles.statDesc}>
              Людей довіряють нам у пошуку свого ідеального друга
            </p>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statNumber}>₴2M+</div>
            <div style={styles.statLabel}>Підтримка притулків</div>
            <p style={styles.statDesc}>
              Перераховано на допомогу безпритульним тваринам
            </p>
          </div>
        </div>
      </section>

      <section style={styles.teamSection}>
        <h2 style={styles.sectionTitle}>Наша команда</h2>
        <p style={styles.sectionSubtitle}>
          Люди, які роблять PetMarket можливим
        </p>
        
        <div style={styles.teamGrid}>
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👨‍💼</div>
            <h3 style={styles.teamName}>Олександр Петренко</h3>
            <p style={styles.teamRole}>Засновник і CEO</p>
            <p style={styles.teamBio}>
              Зоозахисник з 10-річним досвідом роботи у притулках. 
              Мрія — світ без безпритульних тварин.
            </p>
          </div>
          
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👩‍💼</div>
            <h3 style={styles.teamName}>Марія Коваленко</h3>
            <p style={styles.teamRole}>Ветеринарний консультант</p>
            <p style={styles.teamBio}>
              Практикуючий ветеринар з досвідом 15 років. 
              Відповідає за медичну підтримку та консультації.
            </p>
          </div>
          
          <div style={styles.teamCard}>
            <div style={styles.teamAvatar}>👨‍💻</div>
            <h3 style={styles.teamName}>Дмитро Іваненко</h3>
            <p style={styles.teamRole}>Технічний директор</p>
            <p style={styles.teamBio}>
              Розробник з пристрастю до створення інструментів 
              для соціального впливу.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.partnersSection}>
        <h2 style={styles.sectionTitle}>Наші партнери</h2>
        <p style={styles.sectionSubtitle}>
          Разом ми робимо більше
        </p>
        
        <div style={styles.partnerLogos}>
          <div style={styles.partnerLogo}>🏥 Vet Clinic</div>
          <div style={styles.partnerLogo}>🏠 Happy Shelter</div>
          <div style={styles.partnerLogo}>🐾 Animal Care</div>
          <div style={styles.partnerLogo}>💚 Pet Foundation</div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Приєднуйтесь до нашої місії</h2>
        <p style={styles.ctaText}>
          Кожне всиновлення — це рятування життя. Станьте частиною історії змін!
        </p>
        <div style={styles.ctaButtons}>
          <Link to="/adopt" style={styles.ctaButtonPrimary}>
            💙 Всиновити тварину
          </Link>
          <Link to="/reviews" style={styles.ctaButtonSecondary}>
            ⭐ Читати відгуки
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },

  hero: {
    background: 'linear-gradient(135deg, #609966 0%, #40513B 100%)',
    borderRadius: '24px',
    padding: '4rem 3rem',
    marginBottom: '3rem',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 12px 40px rgba(64, 81, 59, 0.3)',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
  },
  highlight: {
    color: '#9DC08B',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    opacity: 0.95,
    lineHeight: '1.6',
  },

  storySection: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 4px 20px rgba(64, 81, 59, 0.08)',
  },
  storyGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '3rem',
    alignItems: 'center',
  },
  storyImage: {
    display: 'flex',
    justifyContent: 'center',
  },
  imageCircle: {
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    backgroundColor: '#EDF1D6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid #9DC08B',
  },
  storyEmoji: {
    fontSize: '6rem',
  },
  storyText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  storyTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.5rem',
  },
  storyParagraph: {
    fontSize: '1.05rem',
    lineHeight: '1.8',
    color: '#23322F',
  },

  missionSection: {
    marginBottom: '3rem',
  },
  missionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '2rem',
  },
  missionCard: {
    background: 'linear-gradient(135deg, #9DC08B 0%, #609966 100%)',
    padding: '3rem',
    borderRadius: '20px',
    color: '#fff',
    boxShadow: '0 6px 24px rgba(157, 192, 139, 0.3)',
    textAlign: 'center',
  },
  missionIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  missionCardTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  missionCardText: {
    fontSize: '1.05rem',
    lineHeight: '1.7',
    opacity: 0.95,
  },

  valuesSection: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#40513B',
    textAlign: 'center',
    marginBottom: '0.5rem',
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: '#609966',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  valueCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.08)',
    transition: 'transform 0.3s ease',
  },
  valueIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  valueTitle: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.75rem',
  },
  valueText: {
    fontSize: '0.95rem',
    lineHeight: '1.7',
    color: '#23322F',
  },

  impactSection: {
    backgroundColor: '#EDF1D6',
    borderRadius: '24px',
    padding: '3rem',
    marginBottom: '3rem',
    textAlign: 'center',
  },
  impactTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.5rem',
  },
  impactSubtitle: {
    fontSize: '1.05rem',
    color: '#609966',
    marginBottom: '2.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.1)',
  },
  statNumber: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#609966',
    marginBottom: '0.5rem',
  },
  statLabel: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.5rem',
  },
  statDesc: {
    fontSize: '0.9rem',
    color: '#23322F',
    lineHeight: '1.6',
  },

  teamSection: {
    marginBottom: '3rem',
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  teamCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.08)',
    textAlign: 'center',
  },
  teamAvatar: {
    fontSize: '5rem',
    marginBottom: '1rem',
  },
  teamName: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.25rem',
  },
  teamRole: {
    fontSize: '0.95rem',
    color: '#609966',
    fontWeight: '600',
    marginBottom: '1rem',
  },
  teamBio: {
    fontSize: '0.95rem',
    lineHeight: '1.6',
    color: '#23322F',
  },

  partnersSection: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 4px 20px rgba(64, 81, 59, 0.08)',
    textAlign: 'center',
  },
  partnerLogos: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  partnerLogo: {
    padding: '2rem',
    backgroundColor: '#EDF1D6',
    borderRadius: '12px',
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#40513B',
  },

  ctaSection: {
    background: 'linear-gradient(135deg, #40513B 0%, #609966 100%)',
    borderRadius: '24px',
    padding: '4rem 3rem',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 12px 40px rgba(64, 81, 59, 0.3)',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
  },
  ctaText: {
    fontSize: '1.15rem',
    marginBottom: '2rem',
    opacity: 0.95,
  },
  ctaButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  ctaButtonPrimary: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    background: 'linear-gradient(135deg, #EDF1D6, #9DC08B)',
    color: '#40513B',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.05rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
  },
  ctaButtonSecondary: {
    display: 'inline-block',
    padding: '1rem 2.5rem',
    backgroundColor: 'transparent',
    color: '#fff',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '1.05rem',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s ease',
  },
};

export default About;