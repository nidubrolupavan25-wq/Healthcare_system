import styles from "../css/Header.module.css";


export default function ReceptionHeader({ toggleSidebar }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {/* ☰ Hamburger Icon */}
        <button className={styles.menuButton} onClick={toggleSidebar}>
  <i className="fas fa-bars"></i>
</button>


        <div className={styles.logo}>
          <i className="fas fa-heartbeat"></i>
          <div className={styles.logoText}>
            <h1>JhaiHealthcare</h1>
            <p>Receptionist Panel</p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <i className="fas fa-calendar-day"></i>
            <div>
              <p>Today</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}