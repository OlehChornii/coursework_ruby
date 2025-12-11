// client/src/pages/Home.jsx
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Знайди свого ідеального <span style={styles.highlight}>друга</span>
            </h1>
            <p style={styles.heroSubtitle}>
              Тисячі чотирилапих друзів мріють знайти турботливу родину. 
              Подаруйте їм другий шанс на щастя — всиновіть улюбленця вже сьогодні!
            </p>
            <div style={styles.heroStats}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>2,500+</div>
                <div style={styles.statLabel}>Щасливих всиновлень</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>150+</div>
                <div style={styles.statLabel}>Партнерів-притулків</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>24/7</div>
                <div style={styles.statLabel}>Підтримка власників</div>
              </div>
            </div>
            <div style={styles.ctaButtons}>
              <Link to="/adopt" style={styles.primaryButton}>
                💙 Всиновити тварину
              </Link>
              <Link to="/about" style={styles.secondaryButton}>
                Дізнатись більше
              </Link>
            </div>
          </div>
          <div style={styles.heroImage}>
            <div style={styles.imageCircle}>
              <span style={styles.heroEmoji}>🐾</span>
            </div>
          </div>
        </div>
      </section>

      <section style={styles.missionSection}>
        <h2 style={styles.missionTitle}>Наша місія</h2>
        <p style={styles.missionText}>
          Ми створюємо безпечний простір, де кожна тварина може знайти турботливу родину, 
          а кожна сім'я — вірного друга. Наша платформа об'єднує притулки, розвідників 
          та людей, які мріють подарувати дім чотирилапому улюбленцю.
        </p>
      </section>

      <section style={styles.categoriesSection}>
        <h2 style={styles.sectionTitle}>Оберіть свого майбутнього друга</h2>
        <p style={styles.sectionSubtitle}>
          Переглядайте тварин за категоріями та знайдіть того, хто ідеально вам підійде
        </p>
        <div style={styles.categoryGrid}>
          <Link to="/dogs/list" style={styles.categoryCard}>
            <div style={styles.categoryIconWrapper}>
              <span style={styles.categoryIcon}>🐕</span>
            </div>
            <h3 style={styles.categoryTitle}>Собаки</h3>
            <p style={styles.categoryDesc}>
              Вірні супутники для активного життя та домашнього затишку
            </p>
            <div style={styles.categoryBadge}>10+ доступно</div>
          </Link>
          
          <Link to="/cats/list" style={styles.categoryCard}>
            <div style={styles.categoryIconWrapper}>
              <span style={styles.categoryIcon}>🐈</span>
            </div>
            <h3 style={styles.categoryTitle}>Коти</h3>
            <p style={styles.categoryDesc}>
              Незалежні та ласкаві друзі для затишку вашого дому
            </p>
            <div style={styles.categoryBadge}>10+ доступно</div>
          </Link>
          
          <Link to="/others" style={styles.categoryCard}>
            <div style={styles.categoryIconWrapper}>
              <span style={styles.categoryIcon}>🐰</span>
            </div>
            <h3 style={styles.categoryTitle}>Інші тварини</h3>
            <p style={styles.categoryDesc}>
              Кролики, птахи, гризуни та інші чудові улюбленці
            </p>
            <div style={styles.categoryBadge}>10+ доступно</div>
          </Link>
        </div>
      </section>

      <section style={styles.howItWorksSection}>
        <h2 style={styles.sectionTitle}>Як це працює?</h2>
        <p style={styles.sectionSubtitle}>
          Всиновлення улюбленця — це просто! Дотримуйтесь цих кроків:
        </p>
        <div style={styles.stepsGrid}>
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>1</div>
            <div style={styles.stepIcon}>🔍</div>
            <h3 style={styles.stepTitle}>Знайдіть улюбленця</h3>
            <p style={styles.stepDesc}>
              Переглядайте профілі тварин, використовуйте фільтри за породою, 
              віком, розміром та характером
            </p>
          </div>
          
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>2</div>
            <div style={styles.stepIcon}>📝</div>
            <h3 style={styles.stepTitle}>Подайте заявку</h3>
            <p style={styles.stepDesc}>
              Заповніть просту анкету, розкажіть про себе та умови утримання тварини
            </p>
          </div>
          
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>3</div>
            <div style={styles.stepIcon}>🤝</div>
            <h3 style={styles.stepTitle}>Познайомтесь</h3>
            <p style={styles.stepDesc}>
              Зустріньтесь з улюбленцем особисто, поспілкуйтесь з представниками притулку
            </p>
          </div>
          
          <div style={styles.stepCard}>
            <div style={styles.stepNumber}>4</div>
            <div style={styles.stepIcon}>🏡</div>
            <h3 style={styles.stepTitle}>Заберіть додому</h3>
            <p style={styles.stepDesc}>
              Оформіть документи, отримайте рекомендації з догляду та подаруйте тварині дім
            </p>
          </div>
        </div>
      </section>

      <section style={styles.benefitsSection}>
        <h2 style={styles.sectionTitle}>Чому варто всиновити улюбленця?</h2>
        <div style={styles.benefitsGrid}>
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>💚</div>
            <h3 style={styles.benefitTitle}>Рятуєте життя</h3>
            <p style={styles.benefitText}>
              Всиновлюючи тварину з притулку, ви даєте їй другий шанс на щасливе життя
            </p>
          </div>
          
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>🏥</div>
            <h3 style={styles.benefitTitle}>Ветеринарна допомога</h3>
            <p style={styles.benefitText}>
              Всі тварини вакциновані, стерилізовані та пройшли медичний огляд
            </p>
          </div>
          
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>🎓</div>
            <h3 style={styles.benefitTitle}>Підтримка експертів</h3>
            <p style={styles.benefitText}>
              Безкоштовні консультації з догляду, виховання та адаптації тварини
            </p>
          </div>
          
          <div style={styles.benefitCard}>
            <div style={styles.benefitIcon}>👨‍👩‍👧‍👦</div>
            <h3 style={styles.benefitTitle}>Спільнота</h3>
            <p style={styles.benefitText}>
              Приєднуйтесь до спільноти відповідальних власників і діліться досвідом
            </p>
          </div>
        </div>
      </section>

      <section style={styles.trustSection}>
        <div style={styles.trustGrid}>
          <div style={styles.trustCard}>
            <span style={styles.trustIcon}>🏆</span>
            <h3 style={styles.trustTitle}>Ліцензовані розвідники</h3>
            <p style={styles.trustText}>
              Всі продавці перевірені, мають офіційні ліцензії та дотримуються 
              високих стандартів догляду за тваринами
            </p>
          </div>
          
          <div style={styles.trustCard}>
            <span style={styles.trustIcon}>🔒</span>
            <h3 style={styles.trustTitle}>Безпечні угоди</h3>
            <p style={styles.trustText}>
              Всі транзакції захищені, договори всиновлення юридично оформлені, 
              а права тварин — гарантовані
            </p>
          </div>
          
          <div style={styles.trustCard}>
            <span style={styles.trustIcon}>💙</span>
            <h3 style={styles.trustTitle}>Підтримка притулків</h3>
            <p style={styles.trustText}>
              Частина коштів від продажів спрямовується на підтримку місцевих 
              притулків для тварин
            </p>
          </div>
        </div>
      </section>

      <section style={styles.finalCTA}>
        <h2 style={styles.finalCTATitle}>Готові змінити життя?</h2>
        <p style={styles.finalCTAText}>
          Тисячі тварин чекають на вашу любов і турботу. 
          Почніть пошук свого ідеального друга вже сьогодні!
        </p>
        <Link to="/adopt" style={styles.finalCTAButton}>
          Почати пошук 🐾
        </Link>
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
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 12px 40px rgba(64, 81, 59, 0.25)',
    color: '#fff',
  },
  heroContent: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: '3rem',
    alignItems: 'center',
  },
  heroText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    lineHeight: '1.2',
    margin: 0,
  },
  highlight: {
    color: '#9DC08B',
  },
  heroSubtitle: {
    fontSize: '1.15rem',
    lineHeight: '1.7',
    opacity: 0.95,
    margin: 0,
  },
  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1.5rem',
    marginTop: '1rem',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#9DC08B',
  },
  statLabel: {
    fontSize: '0.85rem',
    opacity: 0.9,
    marginTop: '0.25rem',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  primaryButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #EDF1D6, #9DC08B)',
    color: '#40513B',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.05rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
    border: 'none',
    display: 'inline-block',
  },
  secondaryButton: {
    padding: '1rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    color: '#fff',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '1.05rem',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
  heroImage: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCircle: {
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    backgroundColor: 'rgba(157, 192, 139, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: '4px solid rgba(255, 255, 255, 0.1)',
  },
  heroEmoji: {
    fontSize: '8rem',
  },

  missionSection: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 4px 20px rgba(64, 81, 59, 0.08)',
    textAlign: 'center',
  },
  missionTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '1.5rem',
  },
  missionText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#23322F',
    maxWidth: '800px',
    margin: '0 auto',
  },

  categoriesSection: {
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#40513B',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  sectionSubtitle: {
    fontSize: '1.05rem',
    color: '#609966',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: '2.5rem 2rem',
    borderRadius: '20px',
    boxShadow: '0 6px 24px rgba(64, 81, 59, 0.1)',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryIconWrapper: {
    width: '100px',
    height: '100px',
    margin: '0 auto 1.5rem',
    backgroundColor: '#EDF1D6',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: '3.5rem',
  },
  categoryTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.75rem',
  },
  categoryDesc: {
    fontSize: '0.95rem',
    color: '#609966',
    lineHeight: '1.6',
    marginBottom: '1rem',
  },
  categoryBadge: {
    display: 'inline-block',
    backgroundColor: '#9DC08B',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },

  howItWorksSection: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '3rem',
    marginBottom: '3rem',
    boxShadow: '0 4px 20px rgba(64, 81, 59, 0.08)',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  stepCard: {
    padding: '2rem',
    borderRadius: '16px',
    backgroundColor: '#EDF1D6',
    textAlign: 'center',
    position: 'relative',
  },
  stepNumber: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '40px',
    height: '40px',
    backgroundColor: '#609966',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    fontWeight: '700',
  },
  stepIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  stepTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.75rem',
  },
  stepDesc: {
    fontSize: '0.95rem',
    color: '#23322F',
    lineHeight: '1.6',
  },

  benefitsSection: {
    marginBottom: '3rem',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '2rem',
  },
  benefitCard: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 16px rgba(64, 81, 59, 0.08)',
    textAlign: 'center',
  },
  benefitIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  benefitTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#40513B',
    marginBottom: '0.75rem',
  },
  benefitText: {
    fontSize: '0.95rem',
    color: '#609966',
    lineHeight: '1.6',
  },

  trustSection: {
    marginBottom: '3rem',
  },
  trustGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  trustCard: {
    background: 'linear-gradient(135deg, #9DC08B 0%, #7db876 100%)',
    padding: '2.5rem',
    borderRadius: '20px',
    color: '#fff',
    boxShadow: '0 8px 28px rgba(157, 192, 139, 0.35)',
  },
  trustIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem',
  },
  trustTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '1rem',
  },
  trustText: {
    fontSize: '1rem',
    lineHeight: '1.7',
    opacity: 0.95,
  },

  finalCTA: {
    background: 'linear-gradient(135deg, #40513B 0%, #609966 100%)',
    borderRadius: '24px',
    padding: '4rem 3rem',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 12px 40px rgba(64, 81, 59, 0.3)',
  },
  finalCTATitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '1rem',
  },
  finalCTAText: {
    fontSize: '1.15rem',
    marginBottom: '2rem',
    opacity: 0.95,
    lineHeight: '1.7',
  },
  finalCTAButton: {
    display: 'inline-block',
    padding: '1.25rem 3rem',
    background: 'linear-gradient(135deg, #EDF1D6, #9DC08B)',
    color: '#40513B',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '1.15rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
  },
};

export default Home;